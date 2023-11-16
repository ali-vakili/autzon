import { NextResponse } from "next/server"
import { connectDB, prisma } from "@/lib"


type requestProps = {
  params: {
    id: string
  }
}

export const GET = async (req: Request, { params }: requestProps) => {
  try {
    connectDB();

    const car = await prisma.car.findUnique(
      {
        where: { id: params.id },
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
          gallery: {
            select: {
              id: true,
              name: true,
              categories: {
                select: {
                  id: true,
                  category: true
                }
              },
              city: {
                select: {
                  id: true,
                  name_en: true
                }
              },
              address: true,
              image_id: {
                select: {
                  id: true,
                  url: true
                }
              },
              phone_numbers: {
                select: {
                  id: true,
                  number: true
                }
              }
            }
          },
          for_rent: {
            select: {
              id: true,
              price_per_day: true,
              price_per_hour: true
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
        data: car
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