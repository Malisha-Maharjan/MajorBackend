import express from "express";
import { StatusCodes } from "http-status-codes";
import { People } from "../../entity/People";
import { personRepository, userRepository } from "../../repository";
import { createResponse } from "../../utils/response";
import { DonorSchema, userNameSchema } from "../../zod-schema/user-schema";

const activeDonorRouter = express.Router();
const deactivateDonorRouter = express.Router();

activeDonorRouter.put("/api/donor/activate/:userName", async (req, res) => {
  // const data = req.body;
  const username = req.params.userName;
  // DonorSchema.parse(data);
  const data = {
    userName: username,
    blood_Group: req.body["blood_Group"],
  };
  DonorSchema.parse(data);
  const user = await userRepository.findOne({
    where: {
      userName: username,
    },
  });
  if (user === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User Not Found"] },
    });
  }

  const person = await personRepository.findOne({
    where: {
      user: { id: user.id },
    },
  });

  if (person === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: {
        message: ["User Not Found"],
      },
    });
  }
  person.blood_Group = data.blood_Group;
  person.is_donor = true;
  await person.save();
  return createResponse<People>(res, StatusCodes.OK, {
    status: "success",
    data: person,
  });
});

deactivateDonorRouter.put("/api/donor/:userName", async (req, res) => {
  const userName = req.params.userName;
  const data = {
    userName: userName,
  };
  userNameSchema.parse(data);
  const user = await userRepository.findOne({
    where: {
      userName: userName,
    },
  });
  if (user === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User Not Found"] },
    });
  }
  const person = await personRepository.findOne({
    where: {
      user: { id: user.id },
    },
  });

  if (person === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: {
        message: ["User Not Found"],
      },
    });
  }
  person.is_donor = req.body["is_donor"];
  person.blood_Group = req.body["blood_Group"];
  person.save();
  return createResponse<People>(res, StatusCodes.OK, {
    status: "success",
    data: person,
  });
});

export {
  activeDonorRouter as activateDonor,
  deactivateDonorRouter as deactivateDonor,
};
