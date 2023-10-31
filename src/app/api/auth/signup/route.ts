import { NextResponse } from "next/server"
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { AgentCreateSchema, AgentCreateType } from "@/validation/validations";
import { sendMail, connectDB, hashPassword, generateToken, prisma } from "@/lib";


export const POST = async (req: Request) => {
  try {
    connectDB();

    const body = await req.json();
    const validData = AgentCreateSchema.safeParse(body);
    
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { email, password, confirmPassword }: AgentCreateType = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    else if (password !== confirmPassword) {
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
    const token = generateToken();

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