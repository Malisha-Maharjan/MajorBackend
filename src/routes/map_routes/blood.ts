import express from "express";
import { StatusCodes } from "http-status-codes";
import { personRepository } from "../../repository";
import { createResponse } from "../../utils/response";

const bloodDonorFilterRouter = express.Router();

bloodDonorFilterRouter.get("/api/bloodDonors/:bloodGroup", async (req, res) => {
  const data = req.params;
  const bloodDonors = await personRepository
    .createQueryBuilder("person")
    .leftJoinAndSelect("person.user", "user")
    .where("person.is_donor = :is_donor", { is_donor: true })
    .andWhere("person.blood_Group=:bloodGroup", {
      bloodGroup: data["bloodGroup"],
    })
    .select([
      "person.id",
      "person.firstName",
      "person.lastName",
      "person.blood_Group",
      "user.userName",
      "user.phoneNumber",
      "user.user_photo",
      "user.longitude",
      "user.latitude",
      "user.address",
      "user.email",
      "user.deviceId",
    ])
    .getMany();
  console.log(bloodDonors);
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: bloodDonors,
  });
});

export { bloodDonorFilterRouter as bloodFilter };
