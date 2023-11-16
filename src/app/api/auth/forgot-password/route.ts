import { NextResponse } from "next/server"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/validation/validations";
import { sendMail, connectDB, generateToken, prisma } from "@/lib";


export const POST = async (req: Request) => {
  try {
    connectDB();

    const body = await req.json();
    const validData = ForgotPasswordSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { email }: ForgotPasswordSchemaType = body;

    if (!email) {
      return NextResponse.json(
        { error: "Please fill the required field" },
        { status: 422 }
      )
    }

    const existingAgent = await prisma.autoGalleryAgent.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!existingAgent) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 409 }
      )
    }
    
    const token = generateToken();

    await prisma.passwordResetToken.create({
      data: {
        agent_id: existingAgent.id,
        token
      }
    })

    await sendMail({ email, token, type: "RESET_PASSWORD" })

    return NextResponse.json(
      { message: "A reset password link sent to your email" },
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