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
          error: "agent does not found",
        },
        { status: 401 }
      );
    }

    const gallery = await prisma.autoGallery.findUnique({
      where: {
        id: params.id,
      }
    })

    if (!gallery) {
      return NextResponse.json(
        {
          error: "auto gallery does not found",
        },
        { status: 404 }
      );
    }

    if (gallery.agent_id === agent.id) {
      await prisma.autoGallery.delete({
        where : { 
          id: gallery.id,
          AND: { agent_id: agent.id }
        }
      })
    }else {
      return NextResponse.json(
        {
          message: "auto gallery credentials with your account information are mismatched"
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        message: "Your auto gallery deleted successfully"
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