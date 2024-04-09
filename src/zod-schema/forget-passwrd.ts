import { z } from "zod";
export const forgetPasswordSchema = z.object({
  userName: z.string({ invalid_type_error: "Must be a string" }),
  email: z.string().email("Invalid email pattern"),
});
