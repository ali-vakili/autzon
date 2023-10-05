import { z } from "zod"


const AgentSchema = z.object({
  email: z.string().toLowerCase().email(),
  password: z.string().min(1, "Password is required").min(8, "Password must have at least 8 characters long").refine(value =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value),
    {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number.",
    }
  ),
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