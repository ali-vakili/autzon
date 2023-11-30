import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AddRentalCarSchemaType } from "@/validation/validations"
import axios from "axios";


const createRentalCar = async (values: AddRentalCarSchemaType) => {
  const { imagesFile, title, buildYear, model, fuelType, category, pick_up_place, drop_off_place, price_per_day, reservation_fee_percentage, description, extra_time, late_return_fee_per_hour, is_published } = values;

  const formData = new FormData();
  if (imagesFile) {
    imagesFile.forEach((fileObj) => {
      const { imageFile } = fileObj;
      if (imageFile) {
        formData.append('imagesFile', imageFile);
      }
    });
  }
  formData.append('title', title);
  formData.append('buildYear', buildYear);
  formData.append('model', model);
  formData.append('fuelType', fuelType);
  formData.append('category', category);
  formData.append('pick_up_place',  pick_up_place);
  formData.append('drop_off_place', drop_off_place);
  formData.append('price_per_day', price_per_day);
  if (reservation_fee_percentage) {
    formData.append('reservation_fee_percentage', reservation_fee_percentage);
  }
  if (description) {
    formData.append('description', description);
  }
  formData.append('extra_time', JSON.stringify(extra_time));
  if (late_return_fee_per_hour) {
    formData.append('late_return_fee_per_hour', late_return_fee_per_hour);
  }
  formData.append('is_published', JSON.stringify(is_published));

  const { data } = await axios.post(
    "/api/car/rental", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  
  return data;
}

export const useCreateRentalCar = () => {
  return useMutation({
    mutationFn: createRentalCar,
  })
}


export type createRentalCarHookType = {
  mutate: UseMutateFunction<any, unknown, AddRentalCarSchemaType, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}