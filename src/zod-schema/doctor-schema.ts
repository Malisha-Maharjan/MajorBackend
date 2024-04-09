import { z } from "zod";

export const DoctorSchema = z.object({
  NMC: z.number({ invalid_type_error: "Should be number" }),
  degree: z.string({ invalid_type_error: "Must be a string" }),
  userName: z.string({ invalid_type_error: "Must be a string" }),
});
