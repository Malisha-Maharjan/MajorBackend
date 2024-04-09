import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRepository } from "../repository";
import { createResponse } from "./response";

export const completedRouter = express.Router();

completedRouter.put("/api/completed", async (req, res) => {
  const data = req.body;
  const user = await userRepository
    .createQueryBuilder("user")
    .where("user.userName = :username", { username: data["username"] })
    .getOne();
  if (!user) {
    return res.send("Error");
  }
  user.inService = false;
  user.save();
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: { message: "Thank you for your service." },
  });
});
