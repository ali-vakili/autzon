import { NextResponse } from "next/server";
import  prisma from "./prisma";


type session = {
  user : {
    id: string,
    email: string,
    role: string,
    is_verified: boolean,
    is_subscribed: boolean,
  }
}

const checkAgent = async (session: session | null) => {
  if (!session || !session.user) {
    return NextResponse.json(
      {
        error: "Session is not valid",
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
        error: "agent does not found",
      },
      { status: 401 }
    );
  }

  else if (!agent.is_verified) {
    return NextResponse.json(
      { message: "Your account is not verified" },
      { status: 401 }
    );
  }

  else if (!agent.firstName || !agent.lastName || !agent.phone_number) {
    return NextResponse.json(
      { message: "Please complete your account information in order to create an auto gallery" },
      { status: 400 }
    );
  }

  return agent;
}

export { checkAgent }