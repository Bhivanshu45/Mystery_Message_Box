import { z } from "zod/v4";

export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string()
})