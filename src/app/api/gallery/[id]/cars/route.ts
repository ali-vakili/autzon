import { NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib"


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

    const { user } = session;

    const gallery = await prisma.autoGallery.findUnique({
      where: { 
        id: params.id,
        AND: { agent_id: user.id }
      }
    });

    if (!gallery) {
      return NextResponse.json(
        {
          error: "auto gallery does not found",
        },
        { status: 404 }
      );
    }

    const car = await prisma.car.findMany(
      {
        where: { gallery_id: gallery.id },
        select: {
          id: true,
          title: true,
          fuel_type: {
            select: {
              id: true,
              type: true
            }
          },
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
              price: true
            }
          },
          is_car_rented: true,
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