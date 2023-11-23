import { NextResponse } from "next/server"
import { connectDB, prisma } from "@/lib";


type requestProps = {
  params: {
    id: string
  }
}

export const GET = async (req: Request, { params }: requestProps) => {
  try {
    connectDB();
  
    const galleries = await prisma.autoGallery.findUnique(
      {
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          image: true,
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
          phone_numbers: {
            select: {
              id: true,
              number: true
            }
          },
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