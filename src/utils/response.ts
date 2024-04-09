import { Response } from "express";
import { ApiResponse } from "../types/api-response";

export const createResponse = <T>(
  res: Response,
  statusCode: number,
  apiResponse: ApiResponse<T>
) => res.status(statusCode).send(apiResponse);
