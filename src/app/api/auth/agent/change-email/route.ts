import { NextResponse } from "next/server"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { AccountManagementSchema, AccountManagementSchemaType } from "@/validation/validations";
import { sendMail, connectDB, prisma, validateSession } from "@/lib";


export const POST = async (req: Request) => {
  try {
    connectDB();
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const validData = AccountManagementSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { email }: AccountManagementSchemaType = body;

    if (!email) {
      return NextResponse.json(
        { error: "If you want to change your email please provide an email." },
        { status: 422 }
      )
    }

    const existingAgent = await prisma.autoGalleryAgent.findUnique({
      where: { email: session.user.email }
    })

    if (!existingAgent) {
      return NextResponse.json(
        { error: "Account was not found" },
        { status: 409 }
      )
    }

    const existingAgentWithNewEmail = await prisma.autoGalleryAgent.findUnique({
      where: {
        email
      },
    });

    if (existingAgentWithNewEmail) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      )
    }

    await prisma.autoGalleryAgent.update({
      where: { email: existingAgent.email },
      data: {
        email
      }
    })

    return NextResponse.json(
      { message: "Your email changed successfully" },
      { status: 200 }
    );

  }
  catch(error) {
    if (error instanceof ZodError) {
      const errorMessages = fromZodError(error);
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