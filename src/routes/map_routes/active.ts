import express from "express";
import { StatusCodes } from "http-status-codes";
import { organization } from "../../enum/organization";
import { organizationRepository, personRepository } from "../../repository";
import { createResponse } from "../../utils/response";

const activeDonorRoutes = express.Router();
const activeAmbulance = express.Router();

activeDonorRoutes.get("/api/active/bloodDonors", async (req, res) => {
  const bloodDonors = await personRepository
    .createQueryBuilder("person")
    .leftJoinAndSelect("person.user", "user")
    .where("person.is_donor = :is_donor", { is_donor: true })
    .select(["person.id", "user.longitude", "user.latitude"])
    .getMany();
  console.log(bloodDonors);
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: bloodDonors,
  });
});

activeAmbulance.get("/api/active/ambulance", async (req, res) => {
  const ambulance = await organizationRepository
    .createQueryBuilder("organization")
    .leftJoinAndSelect("organization.user", "user")
    .where("organization.organizationType = :type", {
      type: organization.AMBULANCE,
    })
    .select(["organization.id", "user.longitude", "user.latitude"])
    .getMany();
  console.log(ambulance);
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: ambulance,
  });
});

export { activeAmbulance as activeAmbulance, activeDonorRoutes as activeDonor };
