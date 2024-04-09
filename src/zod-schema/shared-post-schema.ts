import { z } from "zod";

export const sharedPostSchema = z.object({
  userName: z.string(),
  sharedPID: z.number(),
  post: z.string({ invalid_type_error: "Must be string" }).nullable(),
  photo: z.string({ invalid_type_error: "Must be string" }).nullable(),
});
