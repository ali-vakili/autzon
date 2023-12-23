import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";



export const GET = async (req: Request) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return NextResponse.json({ data: [] }, { status: 200 });

    const userRentRequests = await prisma.rentRequest.findMany({
      where: {
        user_id: session.user.id,
      },
      select: {
        status: true,
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
        }
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


export const POST = async (req: Request) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const { car_id, auto_gallery_id } = body;

    const agent = await checkAgent(session);
    if (agent instanceof NextResponse) return agent;

    const userRentRequest = await prisma.rentRequest.findMany({
      where: {
        user_id: session.user.id,
        status: "PENDING"
      }
    })

    if (userRentRequest.length > 1) {
      return NextResponse.json({ error: "You can not add another rent request when you have a pending request" }, { status: 400 });
    }

    const userExistingRentRequest = await prisma.rentRequest.findMany({
      where: {
        user_id: session.user.id,
        car_id,
        status: "PENDING"
      }
    })

    if (userExistingRentRequest.length > 0) {
      return NextResponse.json({ error: "Your rent request is pending already" }, { status: 400 });
    }

    const newRequest = await prisma.rentRequest.create({
      data: {
        user_id: session.user.id,
        car_id,
        auto_gallery_id,
        status: "PENDING"
      }
    })

    return NextResponse.json({ message: "Your rent request was sent successfully, you can find it in the requests page", status:newRequest.status }, { status: 201 })

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


export const PATCH = async (req: Request) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.json();

    const { request_id, car_id, auto_gallery_id, user_id, action } = body;

    const agent = await checkAgent(session);
    if (agent instanceof NextResponse) return agent;

    await prisma.rentRequest.update({
      where: {
        id: request_id,
        user_id,
        car_id,
        auto_gallery_id,
      },
      data: {
        status: action
      }
    })

    return NextResponse.json({ message: `Request ${action}` }, { status: 200 })

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