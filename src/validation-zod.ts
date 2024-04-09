import "express-async-errors";
import { ZodObject, ZodRawShape } from "zod";

export const validate = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  param: unknown
) => {
  console.log("validator");
  return schema.parse(param);
};
