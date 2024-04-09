import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string({ invalid_type_error: "Must be a string" }),
  address: z.string({ invalid_type_error: "Must be a string" }),
  bio: z.string({ invalid_type_error: "Must be a string" }),
  email: z
    .string({ invalid_type_error: "Must be a string" })
    .email("Invalid email pattern"),
  phoneNumber: z.string().regex(/^9\d{9}$/, "Invalid Phone number"),
  type: z.number(),
  userName: z.string({ invalid_type_error: "Must be a string" }),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/, "Password is invalid"),
});
