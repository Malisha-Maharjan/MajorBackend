import express from "express";
import { getMessaging } from "firebase-admin/messaging";
import { StatusCodes } from "http-status-codes";
import { organization } from "../enum/organization";
import {
  organizationRepository,
  personRepository,
  userRepository,
} from "../repository";
import { ambulanceNearby, shortestPath } from "./distance";
import { createResponse } from "./response";

const requestBloodNotificationRouter = express.Router();
const respondNotificationRouter = express.Router();
const confirmNotificationRouter = express.Router();
const requestAmbulanceNotificationRouter = express.Router();
const respondAmbulanceNotificationRouter = express.Router();
const confirmAmbulanceNotificationRouter = express.Router();

requestBloodNotificationRouter.post(
  "/api/send/notifications/request/blood",
  async (req, res) => {
    const data = req.body;
    console.log({ data });
    const bloodGroup = data["bloodGroup"];
    const username = data["userName"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];

    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username })
      .getOne();
    if (!user) return res.send("Error");
    const persons = await shortestPath(1, bloodGroup, user.userName);
    if (!persons || persons.length === 0) {
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["No any active user found."] },
      });
    }
    const phoneNumber = !user.phoneNumber ? "" : user.phoneNumber;

    const deviceId = persons.map((person: any) => person.user.deviceId);
    const users = persons.map((person: any) => person.user.userName);
    console.log(`${users}`);
    console.log({ phoneNumber });
    console.log(deviceId);
    const message = {
      notification: {
        title: "Blood Request",
        body: `${username} is urgently requesting for ${bloodGroup} blood.`,
      },
      tokens: deviceId,
      // data: {
      //   userName: user.userName,
      //   phoneNumber,
      //   longitude,
      //   latitude,
      //   requestId,
      //   bloodGroup,
      //   type: data["type"],
      //   status,
      //   requestType: data["requestType"],
      //   sent_to: `${users}`,
      // },
    };
    getMessaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log(response);
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: user.userName,
            phoneNumber,
            longitude,
            latitude,
            requestId,
            bloodGroup,
            type: data["type"],
            status,
            requestType: data["requestType"],
            sent_to: `${users}`,
            notification: {
              title: "Blood Request",
              body: `${username} is urgently requesting for ${bloodGroup} blood.`,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

respondNotificationRouter.post(
  "/api/send/notifications/blood/respond",
  async (req, res) => {
    const data = req.body;
    console.log(data);
    const bloodGroup = data["bloodGroup"];
    const requestInitiator = data["requestInitiator"];
    const responder = data["responder"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];
    const requestInitiatorInfo = await userRepository
      .createQueryBuilder("user")
      .where(`user.userName = :username`, { username: requestInitiator })
      .getOne();
    const responderInfo = await userRepository
      .createQueryBuilder("user")
      .where(`user.userName = :username`, { username: responder })
      .getOne();
    console.log({ requestInitiatorInfo, responderInfo });
    if (!requestInitiatorInfo || !responderInfo) return res.send("Error");
    const phoneNumber = !responderInfo.phoneNumber
      ? ""
      : responderInfo.phoneNumber;
    const message = {
      notification: {
        title: "Blood Request Accepted",
        body: `${responderInfo.userName} has responded your request.`,
      },
      token: requestInitiatorInfo.deviceId,
    };
    getMessaging()
      .send(message)
      .then((response) => {
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: responderInfo.userName,
            phoneNumber,
            longitude,
            latitude,
            requestId,
            bloodGroup,
            type: data["type"],
            status,
            requestType: data["requestType"],
            sent_to: requestInitiatorInfo.userName,
            notification: {
              title: "Blood Request Accepted",
              body: `${responderInfo.userName} has responded your request.`,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

confirmNotificationRouter.post(
  "/api/send/notifications/blood/confirm",
  async (req, res) => {
    const data = req.body;
    const requestInitiator = data["responder"];
    const responder = data["requestInitiator"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];
    const bloodGroup = data["bloodGroup"];
    const requestInitiatorInfo = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username: requestInitiator })
      .getOne();
    const responderInfo = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username: responder })
      .getOne();
    if (responderInfo === null) {
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["error."] },
      });
    }
    responderInfo.inService = true;
    responderInfo.save();

    const persons = await personRepository
      .createQueryBuilder("person")
      .leftJoinAndSelect("person.user", "user")
      .where("person.blood_Group = :bloodGroup", { bloodGroup })
      .andWhere("user.is_active = :isActive and user.userName != :username", {
        isActive: false,
        username: requestInitiator,
      })
      .select(["person.id", "user.deviceId", "user.userName"])
      .getMany();
    if (!persons || persons.length === 0) {
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["No any active user found."] },
      });
    }

    const users = persons.map((person) => person.user.userName);
    if (!requestInitiatorInfo || !responderInfo) return res.send("Error");
    const phoneNumber = !requestInitiatorInfo.phoneNumber
      ? ""
      : requestInitiatorInfo.phoneNumber;
    const message = {
      notification: {
        title: "Accepted Request Confirmed",
        body: `${requestInitiatorInfo.userName} has confirmed your response. Please hurry `,
      },
      token: responderInfo.deviceId,
    };
    getMessaging()
      .send(message)
      .then((response) => {
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: requestInitiatorInfo.userName,
            phoneNumber,
            longitude,
            latitude,
            bloodGroup: data["bloodGroup"],
            requestId,
            type: data["type"],
            status,
            users: `${users}`,
            requestType: data["requestType"],
            sent_to: responderInfo.userName,
            notification: {
              title: "Blood Request Accepted",
              body: `${requestInitiatorInfo.userName} has confirmed your response. Please hurry `,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

requestAmbulanceNotificationRouter.post(
  "/api/send/notifications/request/ambulance",
  async (req, res) => {
    const data = req.body;
    const username = data["userName"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];

    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username })
      .getOne();
    if (!user)
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["User not found."] },
      });
    const phoneNumber = !user.phoneNumber ? "" : user.phoneNumber;
    const a = await organizationRepository.find();
    console.log(a);
    // const ambulances = await organizationRepository
    //   .createQueryBuilder("organization")
    //   .leftJoinAndSelect("organization.user", "user")
    //   .where("organization.organizationType = :organizationType", {
    //     organizationType: organization.AMBULANCE,
    //   })
    //   .andWhere("user.is_active = :isActive and user.userName != :username", {
    //     isActive: false,
    //     username: username,
    //   })
    //   .select(["organization.id", "user.deviceId", "user.userName"])
    //   .getMany();
    const ambulances = await ambulanceNearby(1, "Malisha");
    console.log(ambulances);
    if (!ambulances || ambulances.length === 0) {
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["No any active user found."] },
      });
    }
    const deviceId = ambulances.map(
      (ambulance: any) => ambulance.user.deviceId
    );
    const users = ambulances.map((ambulance: any) => ambulance.user.userName);
    const message = {
      notification: {
        title: "Ambulance Request",
        body: `${username} is urgently requesting for an ambulance.`,
      },
      tokens: deviceId,
      data: {
        userName: user.userName,
        phoneNumber,
        longitude,
        latitude,
        requestId,
        type: data["type"],
        status,
        requestType: data["requestType"],
        sent_to: `${users}`,
      },
    };
    getMessaging()
      .sendEachForMulticast(message)
      .then((response) => {
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: user.userName,
            phoneNumber,
            longitude,
            latitude,
            requestId,
            type: data["type"],
            status,
            requestType: data["requestType"],
            sent_to: `${users}`,
            notification: {
              title: "Ambulance Request",
              body: `${username} is urgently requesting for an ambulance.`,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

respondAmbulanceNotificationRouter.post(
  "/api/send/notifications/ambulance/respond",
  async (req, res) => {
    const data = req.body;
    console.log(data);
    const requestInitiator = data["requestInitiator"];
    const responder = data["responder"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];
    const requestInitiatorInfo = await userRepository
      .createQueryBuilder("user")
      .where(`user.userName = :username`, { username: requestInitiator })
      .getOne();
    const responderInfo = await userRepository
      .createQueryBuilder("user")
      .where(`user.userName = :username`, { username: responder })
      .getOne();
    console.log({ requestInitiatorInfo, responderInfo });
    if (!requestInitiatorInfo || !responderInfo) return res.send("Error");
    const phoneNumber = !responderInfo.phoneNumber
      ? ""
      : responderInfo.phoneNumber;
    const message = {
      notification: {
        title: "Notification",
        body: "Test test test",
      },
      token: requestInitiatorInfo.deviceId,
    };
    getMessaging()
      .send(message)
      .then((response) => {
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: responderInfo.userName,
            phoneNumber,
            longitude,
            latitude,
            requestId,
            type: data["type"],
            status,
            requestType: data["requestType"],
            sent_to: requestInitiatorInfo.userName,
            notification: {
              title: "Ambulance Request Accepted",
              body: `${responderInfo.userName} has responded your request.`,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

confirmAmbulanceNotificationRouter.post(
  "/api/send/notifications/ambulance/confirm",
  async (req, res) => {
    const data = req.body;
    const requestInitiator = data["responder"];
    const responder = data["requestInitiator"];
    const longitude = data["longitude"];
    const latitude = data["latitude"];
    const requestId = data["requestId"];
    const status = data["status"];
    const requestInitiatorInfo = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username: requestInitiator })
      .getOne();
    const responderInfo = await userRepository
      .createQueryBuilder("user")
      .where("user.userName = :username", { username: responder })
      .getOne();

    if (!requestInitiatorInfo || !responderInfo) return res.send("Error");
    responderInfo.inService = true;
    responderInfo.save();

    const phoneNumber = !requestInitiatorInfo.phoneNumber
      ? ""
      : requestInitiatorInfo.phoneNumber;
    const ambulances = await organizationRepository
      .createQueryBuilder("organization")
      .leftJoinAndSelect("organization.user", "user")
      .where("organization.organizationType = :organizationType", {
        organizationType: organization.AMBULANCE,
      })
      .andWhere("user.is_active = :isActive and user.userName != :username", {
        isActive: false,
        username: requestInitiator,
      })
      .select(["organization.id", "user.deviceId", "user.userName"])
      .getMany();

    if (!ambulances || ambulances.length === 0) {
      return createResponse(res, StatusCodes.BAD_REQUEST, {
        status: "error",
        error: { message: ["No any active user found."] },
      });
    }
    const users = ambulances.map((ambulance) => ambulance.user.userName);
    const message = {
      notification: {
        title: "Accepted Request Confirmed",
        body: `${responderInfo.userName} has accepted your service. Please proceed towards the destination`,
      },
      token: responderInfo.deviceId,
    };
    getMessaging()
      .send(message)
      .then((response) => {
        return createResponse(res, StatusCodes.OK, {
          status: "success",
          data: {
            userName: requestInitiatorInfo.userName,
            phoneNumber,
            longitude,
            latitude,
            requestId,
            type: data["type"],
            status,
            users: `${users}`,
            requestType: data["requestType"],
            sent_to: responderInfo.userName,
            notification: {
              title: "Ambulance Request Accepted",
              body: `${requestInitiatorInfo.userName} has accepted your service. Please proceed towards the destination`,
            },
          },
        });
      })
      .catch((error) => {
        console.log({ error });
        return createResponse(res, StatusCodes.BAD_REQUEST, {
          status: "error",
          error: { message: ["Error occurred"] },
        });
      });
  }
);

export {
  requestAmbulanceNotificationRouter as ambulanceRequest,
  confirmAmbulanceNotificationRouter as confirmAmbulance,
  confirmNotificationRouter as confirmNotification,
  requestBloodNotificationRouter as notification,
  respondAmbulanceNotificationRouter as respondAmbulance,
  respondNotificationRouter as respondNotification,
};
