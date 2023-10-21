import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { AgentUpdateSchema, AgentUpdateType } from "@/validation/validations";


type requestParams = {
  params: {
    id: string
  }
}

export const PATCH = async (req: Request, { params }: requestParams) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.json();
    const validData = AgentUpdateSchema.safeParse(body);

    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { firstName, lastName, phone_number }: AgentUpdateType = body;

    if (!firstName || !lastName || !phone_number) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    const agent = await prisma.autoGalleryAgent.findUnique({
      where: { 
        email: session.user.email,
        AND: { id: session.user.id }
      }
    })

    if (!agent) {
      return NextResponse.json(
        {
          error: "agent does not found",
        },
        { status: 401 }
      );
    }

    if (agent.id === params.id) {
      await prisma.autoGalleryAgent.update({
        where: { id: agent.id },
        data: {
          firstName,
          lastName,
          phone_number
        },
      })
    }else {
      return NextResponse.json(
        {
          message: "agent credentials are mismatched"
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        message: "agent profile updated successfully"
      },
      { status: 200 }
    )

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