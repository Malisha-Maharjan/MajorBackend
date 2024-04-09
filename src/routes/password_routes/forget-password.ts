import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRepository } from "../../repository";
import { sendEmail } from "../../utils/email";
import { createResponse } from "../../utils/response";
import { forgetPasswordSchema } from "../../zod-schema/forget-passwrd";
const router = express.Router();

router.post("/api/forget/password", async (req, res) => {
  const data = req.body;
  console.log(data);
  forgetPasswordSchema.parse(data);
  console.log("hihii");
  const user = await userRepository.findOne({
    where: {
      userName: data["userName"],
      email: data["email"],
    },
  });
  console.log(user);
  if (!user) {
    return createResponse(res, StatusCodes.UNAUTHORIZED, {
      status: "error",
      error: { message: ["Invalid Username or email."] },
    });
  }
  await sendEmail(
    [user.email],
    "Forget Password",
    `<p>Following is your login credentials.</p><br/><br/><p><b>User Name: ${user.userName}</b><br/></p><b>Password:${user.password}</b><p></p></br></br><p><i>Best Regards,</i></p><p>GeoMedLink</p>`
  );
  return createResponse(res, StatusCodes.OK, {
    status: "success",
  });
});

export { router as forgetPassword };
