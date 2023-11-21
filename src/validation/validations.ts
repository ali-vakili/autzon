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


// Agent
const AgentCreateSchema = z
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
    imageFile: z.any()
    .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Max image size is 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg and .png formats are supported."
    )
    .nullable()
    .optional(),
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




type AgentCreateType = z.infer<typeof AgentCreateSchema>;
type AgentUpdateType = z.infer<typeof AgentUpdateSchema>;
type AccountManagementSchemaType = z.infer<typeof AccountManagementSchema>;
type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;
type GalleryCreateAndUpdateSchemaType = z.infer<
  typeof GalleryCreateAndUpdateSchema
>;
type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;
type RestPasswordSchemaType = z.infer<typeof RestPasswordSchema>; 
type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export {
  AgentCreateSchema,
  AgentUpdateSchema,
  AccountManagementSchema,
  ChangePasswordSchema,
  GalleryCreateAndUpdateSchema,
  SignInFormSchema,
  RestPasswordSchema,
  ForgotPasswordSchema
};
export type {
  AgentCreateType,
  AgentUpdateType,
  AccountManagementSchemaType,
  ChangePasswordSchemaType,
  GalleryCreateAndUpdateSchemaType,
  SignInFormSchemaType,
  RestPasswordSchemaType,
  ForgotPasswordSchemaType
};
