import express from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../entity/User";
import { userRepository } from "../../repository";
import { createResponse } from "../../utils/response";
import { createToken } from "./jwt";

const router = express.Router();
type LoginParams = {
  token: string;
  username: string;
  userType: number;
  image: string;
};

router.post("/api/login", async (req, res) => {
  console.log("Login");
  const data = req.body;
  // const email = validator.isEmail(data["userName"]);
  // console.log(email);
  // console.log(data);
  // loginSchema.parse(data);
  // if (email) {
  //   console.log("This is an email.");
  //   const user = await userRepository.findOne({
  //     where: {
  //       email: data["userName"].replace(),
  //       password: data["password"],
  //     },
  //   });
  //   if (!user) {
  //     return createResponse<User>(res, 400, {
  //       status: "error",
  //       error: { message: ["Invalid Username Or Password"] },
  //     });
  //   }
  //   const token = createToken(user.id, user.userName);
  //   return createResponse(res, StatusCodes.OK, {
  //     status: "success",
  //     data: token,
  //   });
  // } else {
  const user = await userRepository.findOne({
    where: {
      userName: data["userName"].replace(),
      password: data["password"],
    },
  });
  if (!user) {
    return createResponse<User>(res, 400, {
      status: "error",
      error: { message: ["Invalid Username Or Password"] },
    });
  }
  // user.is_active = true;
  user.deviceId = data["deviceId"];
  user.save();
  const token = createToken(user.id, user.userName);
  const result: LoginParams = {
    token,
    username: data["userName"],
    userType: user.type,
    image: user.user_photo,
  };
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: result,
  });
});
export { router as login };
