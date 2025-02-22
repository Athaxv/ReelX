import { z } from "zod"

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    confirmpassword: z.string().min(4),
})