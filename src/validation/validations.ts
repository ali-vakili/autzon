import { z } from "zod";


const MAX_IMAGE_SIZE = 4194304;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const emailSchema = z
  .string()
  .toLowerCase()
  .min(1, "Email is required")
  .email();

const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .max(11, "Phone number is too long")
  .refine((value) => !value.includes(" "), "Phone number cannot contain spaces")
  .refine(
    (value) => /^\d+$/.test(value),
    "Phone number can only contain digits"
  );

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must have at least 8 characters long")
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((value) => /\d/.test(value), {
    message: "Password must contain at least one number",
  })
  .refine((value) => /^[a-zA-Z0-9]+$/.test(value), {
    message: "Password must only contain alphanumeric characters",
  });

const imageFileSchema = z
  .any()
  .refine((file) => file === undefined || file === null || file.size <= MAX_IMAGE_SIZE, {
    message: "Max image size is 4MB.",
  })
  .refine((file) => file === undefined || file === null || ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, and .png formats are supported.",
  })
  .nullable()
  .optional()


// Agent
const AccountCreateSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmation of password is required"),
  })
  .required()
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

const AgentUpdateSchema = z
  .object({
    imageUrl: z.any()
    .nullable()
    .optional(),
    imageFile: imageFileSchema,
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone_number: phoneNumberSchema,
    bio: z
      .string()
      .max(1024, "Bio must not be longer than 1024 characters")
      .optional(),
  })
  .required();


const AccountManagementSchema = z
  .object({
    email: emailSchema
  })
  .required();


const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z
    .string()
    .min(1, "Confirmation of new password is required"),
  })
  .required()
  .refine((data) => data?.newPassword === data?.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Password do not match",
  });
  


// Gallery
const GalleryCreateAndUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(30, "Name must be less that 30 characters"),
    imageUrl: z.any()
    .nullable()
    .optional(),
    imageFile: imageFileSchema,
    address: z.string().min(1, "Address is required"),
    categories: z
      .array(z.string())
      .nonempty("At least one category must be selected"),
    city: z.string().min(1, "Please select a city"),
    phone_numbers: z
      .array(
        z.object({
          number: phoneNumberSchema,
        })
      )
      .nonempty("At least one phone number must be provided")
      .max(3, "Can not add more than 3 phone numbers"),
    about: z
      .string()
      .max(1024, "Bio must not be longer than 1024 characters")
      .optional(),
  })
  .required();



// Car
const CarCommonSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    model: z.string().min(1, "Car model is required"),
    buildYear: z.string().min(1, "Build Year is required"),
    fuelType: z.string().min(1, "Fuel Type is required"),
    seats: z.string().min(1, "Car seats is required"),
    imagesUrl: z.array(
      z.object({
        imageUrl: z.any()
        .nullable()
        .optional(),
      })
    ).nullable().optional(),
    imagesFile: z.array(
      z.object({
        imageFile: imageFileSchema
      })
      .nullable()
    )
    .max(4, "Can not add more than 4 images")
    .nullable()
    .optional(),
    category: z
      .string()
      .min(1, "Category must be selected"),
    description: z.string().max(1024, "Description must not be longer than 1024 characters").optional(),
    is_published: z.boolean().default(true),
  })

const AddAndUpdateRentalCarSchema = CarCommonSchema.merge(
  z
  .object({
      price_per_day: z
        .string()
        .min(0.01, "Price per day must be a positive number")
        .refine(value => Number.isFinite(parseFloat(value)) && !Number.isNaN(parseFloat(value)), {
          message: "Price per day must be a number",
        }),
      pick_up_place: z.string().min(1, "Pick up place is required"),
      drop_off_place: z.string().min(1, "Drop off place is required"),
      reservation_fee_percentage: z
      .string()
      .refine(value => value === "" || (Number.isFinite(parseFloat(value)) && !Number.isNaN(parseFloat(value))), {
        message: "Reservation fee percentage must be a number",
      })
      .optional(),
      late_return_fee_per_hour: z
      .string()
      .refine(value => value === "" || (Number.isFinite(parseFloat(value)) && !Number.isNaN(parseFloat(value))), {
        message: "Late return fee per hour must be a number",
      })
      .optional(),
      extra_time: z.boolean().default(false),
      })
    )
    .refine(data => !data.extra_time || !!data.late_return_fee_per_hour, {
      message: "Late return fee per hour is required if extra time is enabled",
      path: ["late_return_fee_per_hour"],
    })



// Forgot Password
const ForgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .required();



// Reset Password
const RestPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirmation of new password is required"),
  })
  .required()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Password do not match",
  });



// Sign In
const SignInFormSchema = z
  .object({
    email: z.string().toLowerCase().min(1, "Email is required").email(),
    password: z.string().min(1, "Password is required"),
  })
  .required();




type AccountCreateType = z.infer<typeof AccountCreateSchema>;
type AgentUpdateType = z.infer<typeof AgentUpdateSchema>;
type AccountManagementSchemaType = z.infer<typeof AccountManagementSchema>;
type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
type GalleryCreateAndUpdateSchemaType = z.infer<
  typeof GalleryCreateAndUpdateSchema
>;
type AddAndUpdateRentalCarSchemaType = z.infer<typeof AddAndUpdateRentalCarSchema>;
type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;
type RestPasswordSchemaType = z.infer<typeof RestPasswordSchema>; 
type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export {
  AccountCreateSchema,
  AgentUpdateSchema,
  AccountManagementSchema,
  ChangePasswordSchema,
  GalleryCreateAndUpdateSchema,
  AddAndUpdateRentalCarSchema,
  SignInFormSchema,
  RestPasswordSchema,
  ForgotPasswordSchema
};
export type {
  AccountCreateType,
  AgentUpdateType,
  AccountManagementSchemaType,
  ChangePasswordSchemaType,
  GalleryCreateAndUpdateSchemaType,
  AddAndUpdateRentalCarSchemaType,
  SignInFormSchemaType,
  RestPasswordSchemaType,
  ForgotPasswordSchemaType
};
