import { NextResponse } from "next/server"
import { connectDB, prisma } from "@/lib";


export const GET = async () => {
  try {
    connectDB()

    const galleries = await prisma.autoGallery.findMany(
      {
        select: {
          id: true,
          name: true,
          cars: true,
          categories: {
            select: {
              category: true,
              abbreviation: true
            }
          },
          city: {
            select: {
              name_en: true,
              name_fa: true,
              slug: true
            }
          },
          address: true,
          phone_number: true,
          agent: {
            select: {
              firstName:true,
              lastName: true
            },
          },
          is_verified: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    )

    return NextResponse.json(
      {
        data: galleries
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