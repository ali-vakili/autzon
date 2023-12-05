import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GalleryCreateAndUpdateSchema } from "@/validation/validations";
import { galleriesBucketUrl } from "@/constants/supabaseStorage";
import supabase from "@/lib/supabase";


type requestProps = {
  params: {
    id: string
  }
}

export const PATCH = async (req: Request, { params }: requestProps) => {
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

    const gallery = await prisma.autoGallery.findUnique({
      where: { 
        id: params.id,
        AND: { agent_id: agent.id }
      }
    });

    if (!gallery) {
      return NextResponse.json(
        {
          error: "auto gallery does not found",
        },
        { status: 404 }
      );
    }

    else if (!gallery.is_verified) {
      return NextResponse.json(
        {
          error: "Your auto gallery in not verified",
        },
        { status: 401 }
      );
    }

    else if (gallery.agent_id !== agent.id) {
      return NextResponse.json(
        {
          error: "auto gallery credentials with your account information are mismatched",
        },
        { status: 401 }
      );
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

    await prisma.autoGallery.update({
      where: { id: gallery.id },
      data: {
        name: name.toString(),
        address: address.toString(),
        city_id: +city,
        phone_numbers: {
          deleteMany: {},
          createMany: {
            //@ts-ignore
            data: phone_numbers.map(phone_number => ({ number: phone_number.number }))
          }
        },
        categories: {
          set: [],
          //@ts-ignore
          connect: categories.map(categoryId => ({ id: +categoryId }))
        },
        about: about.toString()
      },
    })

    return NextResponse.json(
      {
        message: "auto gallery updated successfully"
      },
      { status: 200 }
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