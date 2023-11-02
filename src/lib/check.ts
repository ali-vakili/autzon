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

type agentProfile = {
  firstName: string | null;
  lastName: string | null;
  phone_number: string | null;
}

const checkAgentProfile = (agent: agentProfile) => {
  if (!agent.firstName || !agent.lastName || !agent.phone_number) {
    return NextResponse.json(
      { message: "Please complete your account information in order to create an auto gallery" },
      { status: 400 }
    );
  }

  return true;
}

const checkAgent = async (session: session | null) => {
  if (!session || !session.user) {
    return NextResponse.json(
      {
        error: "Session does not exist",
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

  else if (!agent.is_verified) {
    return NextResponse.json(
      { message: "Your account is not verified" },
      { status: 401 }
    );
  }

  const agentProfile = checkAgentProfile(agent);
  if (agentProfile instanceof NextResponse) return agentProfile;

  return agent;
}

export { checkAgent }