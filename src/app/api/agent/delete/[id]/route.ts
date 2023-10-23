import { NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib";


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

    if (user.id === params.id) {
      await prisma.autoGalleryAgent.delete({
        where : { 
          email: user.email,
          AND: { id: user.id }
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