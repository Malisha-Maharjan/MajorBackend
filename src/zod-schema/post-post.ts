import { z } from "zod";

export const createPostSchema = z.object({
  userName: z.string(),
  post: z.string({ invalid_type_error: "Must be string" }).nullable(),
  photo: z.string({ invalid_type_error: "Must be string" }).nullable(),
});
