import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GalleryCreateAndUpdateSchema, GalleryCreateAndUpdateSchemaType } from "@/validation/validations";


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

    await prisma.autoGallery.update({
      where: { id: gallery.id },
      data: {
        name,
        address,
        city_id: +city,
        phone_numbers: {
          deleteMany: {},
          createMany: {
            data: phone_numbers.map(number => ({ number }))
          }
        },
        categories: {
          set: [],
          connect: categories.map(categoryId => ({ id: +categoryId }))
        }
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