import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

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
  return session;
}

export default validateSession;