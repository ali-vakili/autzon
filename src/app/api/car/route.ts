import { NextResponse } from "next/server"
import { connectDB, prisma } from "@/lib"


export const GET = async () => {
  try {
    connectDB();

    const cars = await prisma.car.findMany(
      {
        select: {
          id: true,
          title: true,
          build_year: true,
          fuel_type: {
            select: {
              id: true,
              type: true
            }
          },
          images: {
            select: {
              id: true,
              url: true
            }
          },
          for_rent: {
            select: {
              id: true,
              price_per_day: true
            }
          },
          for_sale: {
            select: {
              id: true,
              price: true
            }
          },
          description: true,
          is_published: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    )

    return NextResponse.json(
      {
        data: cars
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