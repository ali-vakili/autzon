import { NextResponse } from "next/server"
import { connectDB, validateSession, prisma, checkAgent } from "@/lib";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { AddAndUpdateRentalCarSchema } from "@/validation/validations";
import { carsBucketUrl } from "@/constants/supabaseStorage";
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
    const allImagesFile = body.getAll("imagesFile");
    const parsedImagesFile = allImagesFile.map((file) => {
      if (typeof file === 'string') {
        return JSON.parse(file);
      }
      return file;
    });
  
    const formDataObject = Object.fromEntries(body.entries());

    if (formDataObject.deleted_images_id) {
      formDataObject.deleted_images_id = JSON.parse(formDataObject.deleted_images_id as string);
    }
    if (formDataObject.updated_images_id_and_index) {
      formDataObject.updated_images_id_and_index = JSON.parse(formDataObject.updated_images_id_and_index as string);
    }
    if (formDataObject.is_published) {
      formDataObject.is_published = JSON.parse(formDataObject.is_published as string);
    }
    if (formDataObject.extra_time) {
      formDataObject.extra_time = JSON.parse(formDataObject.extra_time as string);
    }
    if (formDataObject.imagesFile) {
      formDataObject.imagesFile = parsedImagesFile as any;
    }

    const validData = AddAndUpdateRentalCarSchema.safeParse(formDataObject);
    if (!validData.success) {
      const zodError = new ZodError(validData.error.errors);
      throw zodError;
    }

    const { title, buildYear, model, seats, fuelType, category, pick_up_place, drop_off_place, price_per_day, reservation_fee_percentage, description="", extra_time, late_return_fee_per_hour, is_published, deleted_images_id, updated_images_id_and_index } = formDataObject;

    if (!title || !buildYear || !model || !seats || !fuelType || !pick_up_place || !drop_off_place || !price_per_day ) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 422 }
      )
    }

    const agent = await checkAgent(session);
    if (agent instanceof NextResponse) return agent;

    const existingAutoGallery = await prisma.autoGallery.findFirst({
      where: { agent_id: agent.id }
    });

    if (!existingAutoGallery) {
      return NextResponse.json(
        { error: "Order to add cars first you need to create an auto gallery." },
        { status: 422 }
      )
    }

    if (!existingAutoGallery.is_verified) {
      return NextResponse.json(
        { error: "Your gallery is not verified." },
        { status: 422 }
      )
    }

    const existingCar = await prisma.car.findUnique({
      where: {
        id: params.id,
        AND: {
          gallery_id: existingAutoGallery.id
        }
      }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: "Requested car not found." },
        { status: 404 }
      )
    }

    if (deleted_images_id) {
      const deleted_images_id_array = Array.isArray(deleted_images_id)
      ? deleted_images_id.map((value) => value.toString())
      : [deleted_images_id.toString()];

      await prisma.image.deleteMany({
        where: {
          id: {
            in: deleted_images_id_array,
          },
          car_id: existingCar.id,
        },
      });
    }

    if (parsedImagesFile !== undefined && parsedImagesFile.length > 0) {
      const updated_images_id_and_index_array = Array.isArray(updated_images_id_and_index) && updated_images_id_and_index.length > 0
      ? updated_images_id_and_index
      : [];
      
      if (updated_images_id_and_index_array !== undefined && updated_images_id_and_index_array.length > 0) {
        updated_images_id_and_index_array.forEach(async (updatedImage: { id: string, index: number }) => {
          const index = updatedImage.index;
          if (index < parsedImagesFile.length + 1) {
            const imageToUpdate = index <= 1 ? parsedImagesFile[index] : parsedImagesFile[index-1];
            const { data, error } = await supabase.storage.from("cars").upload(`car_${existingAutoGallery.id}` + "/rental" + `/${Date.now()}_image`, imageToUpdate, { cacheControl: '3600', upsert: true });
      
            if (error) {
              return NextResponse.json(
                { error: "Error uploading image" },
                { status: 500 }
              );
            } else if (data) {
              await prisma.image.update({
                where: { id: updatedImage.id },
                data: {
                  url: carsBucketUrl + data.path,
                  car_id: existingCar.id
                }
              });
            }
          }
        });
      }

      parsedImagesFile.forEach(async (image, index) => {
        if (!updated_images_id_and_index_array.some((obj) => obj.index === parsedImagesFile.length <= 2 ? index : index + 1)) {
          const { data, error } = await supabase.storage.from("cars").upload(`car_${existingAutoGallery.id}` + "/rental" + `/${Date.now()}_image`, image, {cacheControl: '3600', upsert: true});
          
          if (error) {
            return NextResponse.json(
              { error: "Error uploading image" },
              { status: 500 }
            );
          }
          else if (data) {
            await prisma.image.create({
              data: {
                url: carsBucketUrl + data.path,
                car_id: existingCar.id
              }
            })
          }
        }
      });
    }

    await prisma.car.update({
      where: {
        id: existingCar.id
      },
      data: {
        gallery_id: existingAutoGallery.id,
        title: title.toString(),
        build_year_id: +buildYear,
        model_id: +model,
        car_seat_id: +seats,
        fuel_type_id: +fuelType,
        category_id: +category,
        description: description.toString(),
        for_rent: {
          update: {
            price_per_day: +price_per_day,
            pick_up_place: pick_up_place.toString() ?? existingAutoGallery.address,
            drop_off_place: drop_off_place.toString() ?? existingAutoGallery.address,
            reservation_fee_percentage: +reservation_fee_percentage,
            late_return_fee_per_hour: !!extra_time ? +late_return_fee_per_hour : null,
            extra_time: !!extra_time
          }
        },
        is_published: !!is_published
      },
    })

    return NextResponse.json(
      {
        message: "Rental car updated successfully"
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