import { NextResponse } from "next/server"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { ChangePasswordSchema, ChangePasswordSchemaType } from "@/validation/validations";
import { sendMail, connectDB, prisma, validateSession, verifyPassword, hashPassword } from "@/lib";


export const POST = async (req: Request) => {
  try {
    connectDB();
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const validData = ChangePasswordSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { oldPassword, newPassword, confirmNewPassword }: ChangePasswordSchemaType = body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { error: "Please fill the required fields" },
        { status: 422 }
      )
    }

    else if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: "Password and Confirmation of Password are not match" },
        { status: 401 }
      )
    }

    const hashedPassword = await hashPassword(newPassword); 

    const existingAgent = await prisma.autoGalleryAgent.findUnique({
      where: { email: session.user.email }
    })

    if (!existingAgent) {
      return NextResponse.json(
        { error: "Account was not found" },
        { status: 409 }
      )
    }

    if (existingAgent.password) {
      const passwordMatch = await verifyPassword(oldPassword, existingAgent.password);
      if(!passwordMatch) return NextResponse.json(
        { error: "The provided old password does not match with your current password." },
        { status: 409 }
      )
      else if (oldPassword === newPassword) {
        return NextResponse.json(
          { error: "Your new password can not be as same as your old password." },
          { status: 409 }
        )
      }
    }

    await prisma.autoGalleryAgent.update({
      where: { email: existingAgent.email },
      data: {
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { message: "Your password changed successfully" },
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