import { NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/hash";

export const POST = async (req: Request) => {
  try {
    connectDB();

    const body = await req.json();
    const { email, password, confirmationPassword } = body;

    if (!email || !password || !confirmationPassword) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    if (password !== confirmationPassword) {
      return NextResponse.json(
        { error: "Password and Confirmation Password are not match" },
        { status: 401 }
      )
    }

    const existingAgent = await prisma.autoGalleryAgent.findUnique({
      where: { email: email }
    })

    if (existingAgent) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password);

    await prisma.autoGalleryAgent.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { message: "Auto Gallery Agent Created Successfully" },
      { status: 201 }
    );

  }
  catch(error) {
    return NextResponse.json({ error: "Something went wrong please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}

