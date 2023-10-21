import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GalleryCreateSchema, GalleryCreateSchemaType } from "@/validation/validations";


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
    const validData = GalleryCreateSchema.safeParse(body);

    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { name, address, city, phone_numbers, categories }: GalleryCreateSchemaType = body;

    const agent = await prisma.autoGalleryAgent.findUnique({
      where: { 
        email: session.user.email,
        AND: { id: session.user.id }
      }
    })

    if (!agent) {
      return NextResponse.json(
        {
          error: "agent does not found credentials are mismatched",
        },
        { status: 401 }
      );
    }

    if (!agent.is_verified) {
      return NextResponse.json(
        { message: "Your account is not verified" },
        { status: 401 }
      );
    }

    if (!agent.firstName || !agent.lastName || !agent.phone_number) {
      return NextResponse.json(
        { message: "Please complete your account information in order to create an auto gallery" },
        { status: 400 }
      );
    }

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
          create: phone_numbers.map(number => ({ number }))
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