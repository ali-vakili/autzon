import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GalleryCreateAndUpdateSchema, GalleryCreateAndUpdateSchemaType } from "@/validation/validations";


export const GET = async () => {
  try {
    connectDB();

    const galleries = await prisma.autoGallery.findMany(
      {
        select: {
          id: true,
          name: true,
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

    const body = await req.json();
    const validData = GalleryCreateAndUpdateSchema.safeParse(body);

    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { name, address, city, phone_numbers, categories }: GalleryCreateAndUpdateSchemaType = body;

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
          message: "You already have an auto gallery"
        },
        { status: 409 }
      )
    }
    
    await prisma.autoGallery.create({
      data: {
        name,
        address,
        city_id: +city,
        agent_id: agent.id,
        phone_numbers: {
          createMany:{
            data: phone_numbers.map(phone_number => ({ number: phone_number.number }))
          } 
        },
        categories: {
          connect: categories.map(categoryId => ({ id: +categoryId }))
        }
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