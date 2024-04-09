import express from "express";
import { StatusCodes } from "http-status-codes";
import { Doctor } from "../../entity/Doctor";
import { doctorRepository, personRepository } from "../../repository";
import { createResponse } from "../../utils/response";

const unverifiedDoctorRouter = express.Router();

unverifiedDoctorRouter.get("/api/unverified/doctor", async (req, res) => {
  const person = await personRepository.find({
    where: {
      is_doctor: false,
    },
  });

  const doctors = await doctorRepository.find({
    where: {
      is_verified: false,
    },
  });

  if (person === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }

  if (doctors === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }

  console.log(doctors);

  return createResponse<Doctor[]>(res, StatusCodes.OK, {
    status: "success",
    data: doctors,
  });
});

export { unverifiedDoctorRouter as unverifiedDoctor };
