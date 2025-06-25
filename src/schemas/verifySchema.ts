import { z } from "zod/v4";

export const verifySchema = z.object({
    code: z.string().length(6,'Verification code must be exactly 6 characters long'),
})