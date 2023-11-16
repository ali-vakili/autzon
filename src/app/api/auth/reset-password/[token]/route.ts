import { NextResponse } from "next/server"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { RestPasswordSchema, RestPasswordSchemaType } from "@/validation/validations";
import { sendMail, connectDB, hashPassword, prisma } from "@/lib";


export const POST = async (req: Request, { params } : {params: { token: string }}) => {
  try {
    connectDB();
    const { token } = params
    const oneHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

    const body = await req.json();
    const validData = RestPasswordSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { newPassword, confirmPassword }: RestPasswordSchemaType = body;

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Please fill the required fields" },
        { status: 422 }
      )
    }

    else if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and Confirmation Password are not match" },
        { status: 401 }
      )
    }

    const hashedPassword = await hashPassword(newPassword);

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { 
        token,
        AND: [
          {
            resetAt: null,
          },
          {
            createdAt: {
              gt: oneHoursAgo, // 1 hour ago
            }
          }
        ]
      },
      include: { agent: true }
    })

    if (!passwordResetToken) {
      return NextResponse.json(
        { error: "Password Reset credentials are not valid" },
        { status: 409 }
      )
    }

    else if (passwordResetToken.createdAt <= oneHoursAgo) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      )
    }
    
    else if (passwordResetToken.resetAt !== null) {
      return NextResponse.json(
        { error: "Token already used" },
        { status: 409 }
      )
    }

    else if (!passwordResetToken.agent_id) {
      return NextResponse.json(
        { error: "Password Reset credentials are not valid" },
        { status: 409 }
      )
    }

    await prisma.autoGalleryAgent.update({
      where: { id: passwordResetToken.agent_id },
      data: {
        password: hashedPassword
      }
    })

    await prisma.passwordResetToken.update({
      where: { id: passwordResetToken.id },
      data: {
        resetAt: new Date(),
      },
    })

    return NextResponse.json(
      { message: "Your password reset successfully" },
      { status: 201 }
    );

  }
  catch(error) {
    console.log(error)
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