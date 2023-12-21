import { NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib"


export const GET = async (req: Request) => {
  try {
    connectDB();

    const session = await validateSession();
    if (session instanceof NextResponse) return NextResponse.json({ data: []}, { status: 200 });

    const { user } = session;

    const cars = await prisma.userSavedCars.findMany({
      where: { user_id:  user.id },
      select: {
        car: {
          select: {
            id: true,
            title: true,
            gallery: {
              select: {
                id: true,
                image: {
                  select: {
                    url: true
                  }
                },
                name: true,
                phone_numbers: {
                  select: {
                    id: true,
                    number: true
                  }
                },
                city: {
                  select: {
                    name_en: true,
                    province: {
                      select: {
                        name_en: true,
                      }
                    }
                  }
                },
                is_verified: true,
              }
            },
            model_id: true,
            model: {
              select: {
                id: true,
                name: true,
                brand: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            },
            build_year_id: true,
            build_year: {
              select: {
                year: true,
              }
            },
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
            for_rent: true,
            for_sale: {
              select: {
                id: true,
                color: true,
                price: true,
                mileage: true,
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
                id: true,
                seats_count: true
              }
            },
            description: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    })

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