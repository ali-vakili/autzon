import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { AgentUpdateSchema, AgentUpdateType } from "@/validation/validations";
import { agentsBucketUrl } from "@/constants/supabaseStorage";
import supabase from "@/lib/supabase";


type requestProps = {
  params: {
    id: string
  }
}

export const PATCH = async (req: Request, { params }: requestProps) => {
  try {
    connectDB();
  
    const session = await validateSession();
    if (session instanceof NextResponse) return session;

    const body = await req.formData();

    const formDataObject = Object.fromEntries(body.entries());
    const validData = AgentUpdateSchema.safeParse(formDataObject);
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const {imageFile, firstName, lastName, phone_number, bio } = formDataObject;
    
    if (!firstName || !lastName || !phone_number) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }
      
    const { user } = session;
      
    if (user.id === params.id) {
      const { data, error } = await supabase.storage.from("agents").upload(`agent_${session.user.id}` + "/" + Date.now() + "/profile", imageFile!);
      
      if (error) {
        return NextResponse.json(
          { error: "Error uploading image" },
          { status: 500 }
        );
      }

      const imageUrl = data ? agentsBucketUrl + data.path : null;
      await prisma.autoGalleryAgent.update({
        where: { id: user.id },
        data: {
          image_id: {
            upsert: {
              create: { url: imageUrl ?? "" },
              update: { url: imageUrl ?? "" }
            }
          },
          firstName: firstName.toString(),
          lastName: lastName.toString(),
          phone_number: phone_number.toString(),
          bio: bio.toString(),
          is_profile_complete: true
        },
      })
      return NextResponse.json(
        {
          message: "Your profile updated successfully",
          image_url: imageUrl
        },
        { status: 200 }
      )

    }else {
      return NextResponse.json(
        {
          error: "agent credentials are mismatched"
        },
        { status: 403 }
      )
    }
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