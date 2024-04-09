// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { verifyToken } from "../routes/login_routes/jwt";
// import { createResponse } from "../utils/response";

// export const token = (req: Request, res: Response, next: NextFunction) => {
//   if (
//     req.url != "/api/login" &&
//     req.url != "/api/user" &&
//     req.url != "/api/forget/password"
//   ) {
//     const token = req.headers["authorization"];
//     if (!token)
//       return createResponse(res, StatusCodes.UNAUTHORIZED, {
//         status: "error",
//         error: { message: ["Invalid Token"] },
//       });
//     if (!token?.startsWith("Bearer "))
//       return createResponse(res, StatusCodes.UNAUTHORIZED, {
//         status: "error",
//         error: { message: ["Token invalid"] },
//       });

//     if (verifyToken(token.split(" ")[1])) {
//       console.log({ token });
//     }
//   }
//   next();
// };
