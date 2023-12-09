import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AddAndUpdateSaleCarSchemaType } from "@/validation/validations"
import axios from "axios";


const createSaleCar = async (values: AddAndUpdateSaleCarSchemaType) => {
  const { imagesFile, title, buildYear, model, seats, fuelType, category, price, mileage, color, description, is_published } = values;

  const formData = new FormData();
  if (imagesFile) {
    imagesFile.forEach((fileObj) => {
      if (fileObj && fileObj.imageFile) {
        const { imageFile } = fileObj;
        if (imageFile) {
          formData.append('imagesFile', imageFile);
        }
      }
    });
  }
  formData.append('title', title);
  formData.append('buildYear', buildYear);
  formData.append('model', model);
  formData.append('seats', seats);
  formData.append('fuelType', fuelType);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('mileage', mileage);
  formData.append('color', color);
  if (description) {
    formData.append('description', description);
  }
  formData.append('is_published', JSON.stringify(is_published));

  const { data } = await axios.post(
    "/api/car/sale", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  
  return data;
}

export const useCreateSaleCar = () => {
  return useMutation({
    mutationFn: createSaleCar,
  })
}


export type createSaleCarHookType = {
  mutate: UseMutateFunction<any, unknown, AddAndUpdateSaleCarSchemaType, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}