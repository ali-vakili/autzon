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
              price_per_day: true,
              extra_time: true,
            }
          },
          for_sale: {
            select: {
              id: true,
              price: true,
            }
          },
          is_car_rented: true,
          category: {
            select: {
              id: true,
              category: true,
              abbreviation: true
            }
          },
          car_seat:{
            select: {
              seats_count: true
            }
          },
          description: true,
          is_published: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc"
        }
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