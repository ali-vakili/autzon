import { NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import prisma from "@/lib/prisma"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { hashPassword } from "@/lib/hash";
import { AgentSchema, AgentType } from "@/validation/validations";
import generateToken from "@/lib/token";
import sendMail from "@/lib/sendMail";


export const POST = async (req: Request) => {
  try {
    connectDB();

    const body = await req.json();
    const validData = AgentSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { email, password, confirmPassword }: AgentType = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password and Confirmation Password are not match" },
        { status: 401 }
      )
    }

    const existingAgent = await prisma.autoGalleryAgent.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAgent) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }
    
    const hashedPassword = await hashPassword(password);
    const token = generateToken()

    await prisma.autoGalleryAgent.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        activation_token: {
          create: {
            verifyToken: token
          }
        }
      }
    })

    await sendMail({ email, token })

    return NextResponse.json(
      { message: "Auto Gallery Agent Created Successfully" },
      { status: 201 }
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