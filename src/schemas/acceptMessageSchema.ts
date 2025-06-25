import { z } from "zod/v4";

export const acceptMessageSchema = z.object({
    acceptMessage: z.boolean()
})