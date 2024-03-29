import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import prisma from "./prisma";

const validateSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email || !session.user.id) {
    return NextResponse.json(
      {
        error: "unauthorized please sign in",
      },
      { status: 401 }
    );
  }

  const agent = await prisma.autoGalleryAgent.findUnique({
    where: { 
      email: session.user.email,
      AND: { id: session.user.id }
    }
  });

  if (!agent) {
    return NextResponse.json(
      {
        error: "Session credentials are invalid",
      },
      { status: 401 }
    );
  }
  
  return session;
}

export default validateSession;