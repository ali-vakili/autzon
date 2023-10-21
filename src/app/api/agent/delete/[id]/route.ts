import { NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib";


type requestParams = {
  params: {
    id: string
  }
}

export const DELETE = async (req: Request, { params }: requestParams) => {
  try {
    connectDB()
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const agent = await prisma.autoGalleryAgent.findUnique({
      where: { 
        email: session.user.email,
        AND: { id: session.user.id }
      }
    })

    if (!agent) {
      return NextResponse.json(
        {
          error: "agent does not match",
        },
        { status: 401 }
      );
    }

    if (agent.id === params.id) {
      await prisma.autoGalleryAgent.delete({
        where : { 
          email: agent.email,
          AND: { id: agent.id }
        }
      })
    }else {
      return NextResponse.json(
        {
          message: "agent credentials are mismatched"
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        message: "Your agent account deleted successfully"
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