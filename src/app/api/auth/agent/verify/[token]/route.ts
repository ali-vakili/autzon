import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest, { params } : {params: { token: string }}) => {
  const { token } = params;
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const activationToken = await prisma.activationToken.findUnique({
    where: {
      verifyToken: token,
      AND: [
        {
          activatedAt: null,
        },
        {
          createdAt: {
            gt: twelveHoursAgo, // 12 hour ago
          }
        },
        {
          verifyToken: token
        }
      ]
    },
    include: {
      agent: true
    }
  })

  if (!activationToken) {
    return NextResponse.json(
      { error: "Token is invalid" },
      { status: 401 }
    )
  }

  if (activationToken.createdAt <= twelveHoursAgo) {
    return NextResponse.json(
      { error: "Token expired" },
      { status: 401 }
    )
  }
  
  if (activationToken.activatedAt !== null) {
    return NextResponse.json(
      { error: "Account already activated" },
      { status: 409 }
    )
  }

  await prisma.autoGalleryAgent.update({
    where: { id: activationToken.agent_id },
    data: { is_verified: true },
  });
  
  await prisma.activationToken.update({
    where: { verifyToken: token },
    data: { activatedAt: new Date() },
  });

  redirect("/sign-in")
}