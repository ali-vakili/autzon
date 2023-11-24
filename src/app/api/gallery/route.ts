import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GalleryCreateAndUpdateSchema } from "@/validation/validations";
import { galleriesBucketUrl } from "@/constants/supabaseStorage";
import supabase from "@/lib/supabase";


export const GET = async () => {
  try {
    connectDB();

    const galleries = await prisma.autoGallery.findMany(
      {
        select: {
          id: true,
          name: true,
          image: true,
          cars: true,
          categories: {
            select: {
              category: true,
              abbreviation: true
            }
          },
          city: {
            select: {
              name_en: true,
              name_fa: true,
              slug: true
            }
          },
          address: true,
          phone_numbers: {
            select: {
              id: true,
              number: true
            }
          },
          agent: {
            select: {
              firstName:true,
              lastName: true
            },
          },
          is_verified: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    )

    return NextResponse.json(
      {
        data: galleries
      },
      { status: 200 }
    )

  }
  catch(err) {
    return NextResponse.json({ error: "Something went wrong please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}


export const POST = async (req: Request) => {
  try {
    connectDB();

    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.formData();

    const formDataObject = Object.fromEntries(body.entries());
    if (formDataObject.phone_numbers) {
      formDataObject.phone_numbers = JSON.parse(formDataObject.phone_numbers as string);
    }
    if (formDataObject.categories) {
      formDataObject.categories = JSON.parse(formDataObject.categories as string);
    }

    const validData = GalleryCreateAndUpdateSchema.safeParse(formDataObject);
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { name, imageFile, address, city, phone_numbers, categories, about } = formDataObject;

    if (!name || !address || !city || !phone_numbers || !categories) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    const agent = await checkAgent(session);
    if (agent instanceof NextResponse) return agent;

    const existingAutoGallery = await prisma.autoGallery.findFirst({
      where: { agent_id: agent.id }
    });

    if (existingAutoGallery) {
      return NextResponse.json(
        {
          error: "You already have an auto gallery"
        },
        { status: 409 }
      )
    }

    let imageUrl = null

    if (imageFile && imageFile !== undefined && imageFile !== null && imageFile !== 'null') {
      const { data, error } = await supabase.storage.from("galleries").upload(`gallery_${session.user.id}` + "/" + Date.now() + "/image", imageFile!);
      
      if (error) {
        return NextResponse.json(
          { error: "Error uploading image" },
          { status: 500 }
        );
      }
      imageUrl = data ? galleriesBucketUrl + data.path : null;
    }
    
    await prisma.autoGallery.create({
      data: {
        name: name.toString(),
        image: {
          create: { url: imageUrl ?? "" }
        },
        address: address.toString(),
        city_id: +city,
        agent_id: agent.id,
        phone_numbers: {
          createMany:{
            data: phone_numbers.map(phone_number => ({ number: phone_number.number }))
          } 
        },
        categories: {
          connect: categories.map(categoryId => ({ id: +categoryId }))
        },
        about: about.toString()
      },
    })

    return NextResponse.json(
      {
        message: "Your auto gallery created successfully"
      },
      { status: 201 }
    )

  }
  catch(err) {
    if (err instanceof ZodError) {
      const errorMessages = fromZodError(err);
      const messages = [...errorMessages.details];
      const message = messages.map(message => ({ message: message.message, path: message.path[0]} ));
      return NextResponse.json({ error: message }, { status: 422 });
    }

    return NextResponse.json({ error: "Something went wrong please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}