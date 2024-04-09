import { z } from "zod";

export const createUserSchema = z.object({
  userName: z.string({ invalid_type_error: "Must be a string" }),
  address: z.string({ invalid_type_error: "Last name must be a string" }),
  email: z
    .string({ invalid_type_error: "Must be a string" })
    .email("Invalid email pattern"),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/, "Password is invalid"),
  user_photo: z.string({ invalid_type_error: "Must be a string" }).nullable(),
  phoneNumber: z.number().nullable(),
  type: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  deviceId: z.string(),
});

export const createPersonSchema = z.object({
  firstName: z.string({ invalid_type_error: "Must be a string" }),
  middleName: z.string({ invalid_type_error: "Must be a string" }).nullable(),
  lastName: z.string({ invalid_type_error: "Must be a string" }),
  gender: z.string(),
});

export const createOrganizationSchema = z.object({
  name: z.string(),
  organizationType: z.number(),
  bio: z.string(),
  services: z.number().array(),
});

export const DonorSchema = z.object({
  blood_Group: z
    .string({ invalid_type_error: "Must be a string" })
    .regex(/^(A|B|AB|O)[+-]$/, "Invalid Blood Group"),
  userName: z.string(),
});

export const loginSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

export const userNameSchema = z.object({
  userName: z.string(),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/, "Password is invalid"),
});
