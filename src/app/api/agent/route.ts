import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";


export const GET = async () => {
  try {
    connectDB();

    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const agents = await prisma.autoGalleryAgent.findMany(
      {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          email: true,
          phone_number: true,
          is_subscribed: true,
          is_verified: true,
          join_date: true,
          updatedAt: true,
        },
      }
    )

    return NextResponse.json(
      {
        data: agents
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