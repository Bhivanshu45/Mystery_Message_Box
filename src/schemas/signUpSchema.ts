import { email, z } from "zod/v4";

export const usernameValidation = z
    .string()
    .min(3,"Username  must be at least 3 characters long")
    .max(20,"Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_-]+$/,"Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email Address'}),
    password: z.string().min(8,{message: 'Password must be at least 8 characters long'}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/, {message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character'})
})