import express from "express";
import { StatusCodes } from "http-status-codes";
import { Like } from "typeorm";
import { userRepository } from "../../repository";
import { createResponse } from "../../utils/response";
export const searchRoute = express.Router();

searchRoute.get("/api/search/:value", async (req, res) => {
  const value = req.params["value"];
  const user = await userRepository.find({
    where: { userName: Like(`%${value}%`) },
    select: ["id", "userName", "user_photo"],
  });
  if (user.length === 0) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Not Found"] },
    });
  }
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: user,
  });
});
