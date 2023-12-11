import { NextRequest, NextResponse } from "next/server"
import { connectDB, prisma, validateSession } from "@/lib"
import { Prisma } from '@prisma/client';


type requestProps = {
  params: {
    id: string
  }
}

export const GET = async (req: NextRequest, { params }: requestProps) => {
  const searchParam = req.nextUrl.searchParams.get("order-by");
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

    let orderByOption: Prisma.CarOrderByWithRelationInput;
    switch (searchParam) {
      case 'newest':
        orderByOption = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderByOption = { createdAt: 'asc' };
        break;
      case 'last-updated':
        orderByOption = { updatedAt: 'desc' };
        break;
      default:
        orderByOption = { createdAt: 'desc' };
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
              price: true,
              color: true
            }
          },
          is_car_rented: true,
          description: true,
          is_published: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: orderByOption
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
    return NextResponse.json({ error: "Something went wrong fetching your gallery cars please try again later" }, { status: 500 })
  }
  finally {
    await prisma.$disconnect()
  }
}