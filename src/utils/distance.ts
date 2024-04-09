import express from "express";
import haversine from "haversine-distance";
import { organization } from "../enum/organization";
import { organizationRepository, personRepository } from "../repository";
export const shortestPath = async (
  distance: number,
  bloodGroup: string,
  username: string
) => {
  const users = await personRepository
    .createQueryBuilder("person")
    .leftJoinAndSelect("person.user", "user")
    .where("person.is_donor = :is_donor", { is_donor: true })
    .andWhere("person.blood_Group=:bloodGroup", {
      bloodGroup,
    })
    .andWhere(
      "user.is_active = :isActive and user.userName != :username and user.inService = :inService",
      {
        isActive: false,
        username: username,
        inService: false,
      }
    )
    .select([
      "person.id",
      "user.longitude",
      "user.latitude",
      "user.userName",
      "user.deviceId",
    ])
    .getMany();
  console.log({ users1: JSON.stringify(users) });

  var availableDonors: any = [];
  users.map((user: any) => {
    const longitude = user.user.longitude;
    const latitude = user.user.latitude;
    const coordinates = { longitude, latitude };
    const request = { longitude: 85, latitude: 27 };
    const distance = haversine(coordinates, request);
    user.distance = distance;
    availableDonors.push(user);
    availableDonors.sort((a: any, b: any) => a.distance - b.distance);
  });
  console.log({ availableDonors });
  return availableDonors;
};

export const ambulanceNearby = async (distance: number, username: string) => {
  const ambulances = await organizationRepository
    .createQueryBuilder("organization")
    .leftJoinAndSelect("organization.user", "user")
    .where("organization.organizationType = :organizationType", {
      organizationType: organization.AMBULANCE,
    })
    .andWhere(
      "user.is_active = :isActive and user.userName != :username and user.inService =:inService",
      {
        isActive: false,
        username: username,
        inService: false,
      }
    )
    .select([
      "organization.id",
      "user.deviceId",
      "user.userName",
      "user.longitude",
      "user.latitude",
    ])
    .getMany();

  var availableAmbulance: any = [];
  ambulances.map((ambulance: any) => {
    const longitude = ambulance.user.longitude;
    const latitude = ambulance.user.latitude;
    const coordinates = { longitude, latitude };
    const request = { longitude: 85, latitude: 27 };
    const distance = haversine(coordinates, request);
    ambulance.distance = distance;
    availableAmbulance.push(ambulance);
    availableAmbulance.sort((a: any, b: any) => a.distance - b.distance);
  });
  console.log({ availableAmbulance });
  return availableAmbulance;
};

const distanceRouter = express.Router();

distanceRouter.get("/api/get/:bloodGroup", async (req, res) => {
  const data = req.params;
  await shortestPath(1, "AB-", "Malisha");

  res.send("ok");
});

export { distanceRouter as distanceRouter };
