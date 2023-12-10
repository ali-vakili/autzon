import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";


type requestProps = {
  params: {
    id: string
  }
}

export const DELETE = async (req: Request, { params }: requestProps) => {
  try {
    connectDB()
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const { user } = session;

    const existingAutoGallery = await prisma.autoGallery.findFirst({
      where: { agent_id: user.id }
    });

    if (!existingAutoGallery) {
      return NextResponse.json(
        {
          error: "auto gallery does not found",
        },
        { status: 404 }
      );
    }

    else if (!existingAutoGallery.is_verified) {
      return NextResponse.json(
        {
          error: "Your auto gallery in not verified",
        },
        { status: 401 }
      );
    }

    else if (existingAutoGallery.agent_id !== user.id) {
      return NextResponse.json(
        {
          error: "auto gallery credentials with your account information are mismatched",
        },
        { status: 401 }
      );
    }

    const existingCar = await prisma.car.findUnique({
      where: { 
        id: params.id,
        AND: { gallery_id: existingAutoGallery.id }
      }
    })

    if (!existingCar) {
      return NextResponse.json(
        {
          error: "car does not found",
        },
        { status: 404 }
      );
    }

    else if (existingCar.gallery_id !== existingAutoGallery.id) {
      return NextResponse.json(
        {
          error: "car credentials with your auto gallery information are mismatched",
        },
        { status: 401 }
      );
    }

    await prisma.car.delete({
      where: { id: existingCar.id }
    })

    return NextResponse.json(
      {
        message: "Car deleted successfully"
      },
      { status: 200 }
    )

  }
  catch(err) {
    return NextResponse.json({ error: "Something went wrong when deleting the car please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}