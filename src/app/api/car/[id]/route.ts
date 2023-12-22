import { NextRequest, NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib"


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
              image: {
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


export const POST = async (req: NextRequest, { params }: requestProps) => {
  try {
    connectDB();

    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const { user } = session;
    const body = await req.json();
    const { action } = body;

    if (action === 'SAVE') {
      await prisma.autoGalleryAgent.update({
        where: { id: user.id },
        data: {
          UserSavedCars: {
            create: {
              car: {
                connect: { id: params.id },
              }
            }
          }
        }
      });
    }
    else if (action === 'UNSAVE') {
      await prisma.autoGalleryAgent.update({
        where: { id: user.id },
        data: {
          UserSavedCars: {
            delete: { 
              user_id_car_id: {
                user_id: user.id,
                car_id: params.id
              }
            }
          }
        }
      });

      return NextResponse.json(
        {
          message: "Car successfully Unsaved.",
          saved: false
        },
        { status: 200 }
      )
    }
    else {
      return NextResponse.json({ error: "Invalid action specified" }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "Car successfully saved you can find it in saves page.",
        saved: true
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