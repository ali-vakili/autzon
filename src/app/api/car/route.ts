import { NextRequest, NextResponse } from "next/server"
import { connectDB, prisma } from "@/lib"
import { Prisma } from '@prisma/client';


export const GET = async (req: NextRequest) => {
  const searchParamFor = req.nextUrl.searchParams.get("for");
  const searchParamCityId = req.nextUrl.searchParams.get("city_id") ?? "52";
  try {
    connectDB();

    let whereClause: Prisma.CarWhereInput = {
      gallery: {
        city_id: +searchParamCityId,
      },
      is_published: true
    };

    switch (searchParamFor) {
      case 'rent':
        whereClause.for_rent = { isNot: null };
        break;
      case 'sale':
        whereClause.for_sale = { isNot: null };
        break;
    }

    const cars = await prisma.car.findMany(
      {
        where: whereClause,
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
        },
        orderBy: {
          updatedAt: "desc"
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