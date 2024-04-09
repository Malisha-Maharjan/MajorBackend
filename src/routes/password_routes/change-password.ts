import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRepository } from "../../repository";
import { createResponse } from "../../utils/response";
import { passwordSchema, userNameSchema } from "../../zod-schema/user-schema";

const router = express.Router();

router.post("/api/change/password", async (req, res) => {
  const data = req.body;
  userNameSchema.parse({ userName: data["username"] });
  const user = await userRepository.findOne({
    where: {
      userName: data["username"].replace(),
    },
  });
  console.log(user);
  if (!user) {
    return createResponse(res, StatusCodes.UNAUTHORIZED, {
      status: "error",
      error: { message: ["Invalid Username."] },
    });
  }
  if (user.password !== data["currentPassword"]) {
    return createResponse(res, StatusCodes.UNAUTHORIZED, {
      status: "error",
      error: { message: ["Incorrect old password."] },
    });
  }
  passwordSchema.parse({ password: data["newPassword"] });
  if (data["newPassword"] !== data["confirmPassword"]) {
    return createResponse(res, StatusCodes.UNAUTHORIZED, {
      status: "error",
      error: { message: ["New password and confirm password does not match."] },
    });
  }
  user.password = data["newPassword"];
  user.save();
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: { message: "Password changes Successfully." },
  });
});

export { router as changePassword };
