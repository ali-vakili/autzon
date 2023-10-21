import { z } from "zod"


const phoneNumberSchema = z.string().min(1, "Phone number is required").max(11, "Phone number is too long")
.refine(value => !value.includes(' '), "Phone number cannot contain spaces")
.refine(value => /^\d+$/.test(value), "Phone number can only contain digits");



// Agent
const AgentCreateSchema = z.object({
  email: z.string().toLowerCase().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required").min(8, "Password must have at least 8 characters long")
  .refine(value => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine(value => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine(value => /\d/.test(value), {
    message: "Password must contain at least one number",
  })
  .refine(value => /^[a-zA-Z0-9]+$/.test(value), {
    message: "Password must only contain alphanumeric characters",
  }),
  confirmPassword: z.string().min(1, "Confirmation password is required")
}).required().refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password do not match"
});


const AgentUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone_number: phoneNumberSchema
}).required()



// Gallery
const GalleryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name must be less that 30 characters"),
  address: z.string().min(1, "Address is required"),
  categories: z.array(z.string()).nonempty("At least one category must be selected"),
  city: z.string(),
  phone_numbers: z.array(phoneNumberSchema).nonempty("At least one phone number must be provided").max(3, "Can not add more than 3 phone numbers"),
}).required()


const GalleryUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name must be less that 30 characters"),
  address: z.string().min(1, "Address is required"),
  categories: z.array(z.string()).nonempty("At least one category must be selected"),
  city: z.string(),
  phone_numbers: z.array(phoneNumberSchema).nonempty("At least one phone number must be provided").max(3, "Can not add more than 3 phone numbers")
}).required()


const SignInFormSchema = z.object({
  email: z.string().toLowerCase().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required")
}).required()



type AgentCreateType = z.infer<typeof AgentCreateSchema>
type AgentUpdateType = z.infer<typeof AgentUpdateSchema>
type GalleryCreateSchemaType = z.infer<typeof GalleryCreateSchema>
type GalleryUpdateSchemaType = z.infer<typeof GalleryUpdateSchema>
type SignInFormSchemaType = z.infer<typeof SignInFormSchema>

export {
  AgentCreateSchema,
  AgentUpdateSchema,
  GalleryCreateSchema,
  GalleryUpdateSchema, 
  SignInFormSchema
}
export type { 
  AgentCreateType,
  AgentUpdateType,
  GalleryCreateSchemaType,
  GalleryUpdateSchemaType,
  SignInFormSchemaType
}