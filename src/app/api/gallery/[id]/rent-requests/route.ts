import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";



type requestProps = {
  params: {
    id: string
  }
}

export const GET = async (req: Request, { params }: requestProps) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;


    const userRentRequests = await prisma.rentRequest.findMany({
      where: {
        auto_gallery_id: params.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone_number: true,
            city: {
              select: {
                id: true,
                name_en: true,
                province: {
                  select: {
                    id: true,
                    name_en: true
                  }
                }
              }
            },
            image: {
              select:{
                id: true,
                url: true
              }
            }
          }
        },
        auto_gallery_id: true,
        car: {
          select: {
            id: true,
            title: true,
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
            images: {
              select: {
                id: true,
                url: true
              }
            },
            for_rent: true,
            is_car_rented: true,
            category: {
              select: {
                id: true,
                category: true,
                abbreviation: true
              }
            },
            createdAt: true,
            updatedAt: true,
          },
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ data: userRentRequests }, { status: 200 })

  }
  catch(err) {
    if (err instanceof ZodError) {
      const errorMessages = fromZodError(err);
      const messages = [...errorMessages.details];
      const message = messages.map(message => ({ message: message.message, path: message.path[0]} ));
      return NextResponse.json({ error: message }, { status: 422 });
    }

    return NextResponse.json({ error: "Something went wrong please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}