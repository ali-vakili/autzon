import { z } from "zod"


const AgentSchema = z.object({
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

const SignInFormSchema = z.object({
  email: z.string().toLowerCase().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required")
}).required()

type AgentType = z.infer<typeof AgentSchema>
type SignInFormSchemaType = z.infer<typeof SignInFormSchema>


export { AgentSchema, SignInFormSchema }
export type { AgentType, SignInFormSchemaType }