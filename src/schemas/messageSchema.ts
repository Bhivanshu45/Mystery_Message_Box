import { z } from "zod/v4";
import { usernameValidation } from "./signUpSchema";

export const messageSchema = z.object({
    content: z.string()
        .min(3, { message: "Message must be at least 3 characters long" })
        .max(300, { message: "Message must be at most 300 characters long" }),
})