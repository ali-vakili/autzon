import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";


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
  
    const agent = await prisma.autoGalleryAgent.findUnique(
      {
        where: { id: params.id },
        select: {
          id: true,
          image: {
            select: {
              id: true,
              url: true,
              createdAt: true,
              updatedAt: true
            }
          },
          firstName: true,
          lastName: true,
          role: true,
          email: true,
          gallery: {
            select: {
              id: true,
              name: true,
              image: {
                select: {
                  id: true,
                  url: true,
                  createdAt: true,
                  updatedAt: true
                }
              },
              cars: true,
              categories: {
                select: {
                  category: true,
                  abbreviation: true
                }
              },
              city: {
                select: {
                  name_en: true,
                  province: {
                    select: {
                      name_en: true
                    }
                  }
                }
              },
              address: true,
              phone_numbers: {
                select: {
                  id: true,
                  number: true
                }
              },
              is_verified: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          phone_number: true,
          is_subscribed: true,
          is_verified: true,
          join_date: true,
          updatedAt: true,
        }
      }
    )

    return NextResponse.json(
      {
        data: agent
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