import { default as express } from "express";
import "express-async-errors";
import { StatusCodes } from "http-status-codes";
import { users } from "../../enum/user";
import {
  organizationRepository,
  personRepository,
  userRepository,
} from "../../repository";
import { createResponse } from "../../utils/response";
import {
  createOrganizationSchema,
  createPersonSchema,
  createUserSchema,
  userNameSchema,
} from "../../zod-schema/user-schema";

const createRouter = express.Router();
const getAllRouter = express.Router();
const deleteRouter = express.Router();
const getRouter = express.Router();
const updateRouter = express.Router();

createRouter.post("/api/user", async (req, res) => {
  console.log(req.body);
  const userData = {
    userName: req.body["userName"],
    address: req.body["address"],
    email: req.body["email"],
    password: req.body["password"],
    phoneNumber: req.body["phoneNumber"],
    type: req.body["type"],
    user_photo: req.body["image"],
    longitude: req.body["longitude"],
    latitude: req.body["latitude"],
    deviceId: req.body["deviceId"],
  };
  const existingUser = await userRepository.findOne({
    where: {
      userName: userData["userName"],
    },
  });
  if (existingUser) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User name already exist"] },
    });
  }
  createUserSchema.parse(userData);
  if (userData["type"] === users.USER) {
    const person = {
      firstName: req.body["firstName"],
      middleName: req.body["middleName"],
      lastName: req.body["lastName"],
      gender: req.body["gender"],
    };
    createPersonSchema.parse(person);
    const user = await userRepository.save(userData);
    const userPeople = personRepository.create();
    userPeople.firstName = person["firstName"];
    userPeople.middleName = person["middleName"];
    userPeople.lastName = person["lastName"];
    userPeople.user = user;
    return createResponse(res, StatusCodes.OK, {
      status: "success",
      data: await personRepository.save(userPeople),
    });
  } else if (userData["type"] === users.ORGANIZATION) {
    const organization = {
      name: req.body["name"],
      bio: req.body["bio"],
      organizationType: req.body["organizationType"],
      services: req.body["services"],
    };
    createOrganizationSchema.parse(organization);
    const user = await userRepository.save(userData);
    const userOrganization = organizationRepository.create();
    userOrganization.name = organization["name"];
    userOrganization.bio = organization["bio"];
    userOrganization.organizationType = organization["organizationType"];
    userOrganization.services = organization["services"];
    userOrganization.user = user;

    return createResponse(res, StatusCodes.OK, {
      status: "success",
      data: await organizationRepository.save(userOrganization),
    });
  }
  return createResponse(res, StatusCodes.BAD_REQUEST, {
    status: "error",
    error: { message: ["Error occurred"] },
  });
});

getAllRouter.get("/api/user/all", async (req, res) => {
  const user = await userRepository.find();
  console.log(user);
  if (user.length === 0)
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Bad Request"] },
    });
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: user,
  });
});

deleteRouter.delete("/api/user/:username", async (req, res) => {
  const data = { userName: req.params.username };
  userNameSchema.parse(data);
  const user = await userRepository.findBy({ userName: data["userName"] });
  if (user.length === 0) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: {
        message: ["User Not Found"],
      },
    });
  }
  await userRepository.delete({ userName: data["userName"] });
  return createResponse(res, StatusCodes.OK, {
    status: "success",
  });
});

getRouter.get("/api/user/:username", async (req, res) => {
  const data = { userName: req.params.username };
  userNameSchema.parse(data);
  const user = await userRepository.findOne({
    where: {
      userName: data["userName"],
    },
  });
  if (!user)
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User Not Found"] },
    });
  if (user.type === users.USER) {
    const person = await personRepository.findOne({
      where: { user: { id: user.id } },
    });

    return createResponse(res, StatusCodes.OK, {
      status: "success",
      data: person,
    });
  } else if (user.type === users.ORGANIZATION) {
    const organization = await organizationRepository.findOne({
      where: { user: { id: user.id } },
    });

    return createResponse(res, StatusCodes.OK, {
      status: "success",
      data: organization,
    });
  }
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: "hellp hoo",
  });
});

// updateRouter.put("/api/user", async (req, res) => {
//   console.log(req.body);
//   const userName = req.body["userName"];
//   console.log("hello");
//   const user = await userRepository.findOne({
//     where: {
//       userName: userName,
//     },
//   });
//   if (user === null) {
//     return createResponse(res, StatusCodes.BAD_REQUEST, {
//       status: "error",
//       error: {
//         message: ["User Not Found"],
//       },
//     });
//   }
//   const userData = {
//     userName: req.body["userName"],
//     address: req.body["address"],
//     email: req.body["email"],
//     password: req.body["password"],
//     phoneNumber: req.body["phoneNumber"],
//     type: req.body["type"],
//   };
//   createUserSchema.parse(userData);
//   await userRepository.merge(user, userData).save();
//   console.log(user);
//   if (userData["type"] === users.USER) {
//     const personData = {
//       firstName: req.body["firstName"],
//       middleName: req.body["middleName"],
//       lastName: req.body["lastName"],
//     };
//     createPersonSchema.parse(personData);
//     const person = await personRepository.findOne({
//       where: {
//         user: { id: user.id },
//       },
//     });

//     if (person === null) {
//       return createResponse(res, StatusCodes.BAD_REQUEST, {
//         status: "error",
//         error: {
//           message: ["User Not Found"],
//         },
//       });
//     }
//     return createResponse(res, StatusCodes.OK, {
//       status: "success",
//       data: await personRepository.merge(person, personData).save(),
//     });
//   } else if (userData["type"] === users.ORGANIZATION) {
//     const organizationData = {
//       name: req.body["name"],
//       bio: req.body["bio"],
//       organizationType: req.body["organizationType"],
//       services: req.body["services"],
//     };
//     createOrganizationSchema.parse(organizationData);
//     const organization = await organizationRepository.findOne({
//       where: {
//         user: { id: user.id },
//       },
//     });

//     if (organization === null) {
//       return createResponse(res, StatusCodes.BAD_REQUEST, {
//         status: "error",
//         error: {
//           message: ["User Not Found"],
//         },
//       });
//     }
//     return createResponse(res, StatusCodes.OK, {
//       status: "success",
//       data: await organizationRepository
//         .merge(organization, organizationData)
//         .save(),
//     });
//   }
//   return createResponse(res, StatusCodes.BAD_REQUEST, {
//     status: "error",
//     error: { message: ["User Not Found"] },
//   });
// });

updateRouter.put("/api/user", async (req, res) => {
  console.log(req.body);
  const userName = req.body["userName"];
  console.log("hello");
  const user = await userRepository.findOne({
    where: {
      userName: userName,
    },
  });
  if (user === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: {
        message: ["User Not Found"],
      },
    });
  }

  user.user_photo = req.body["image"];
  user.save();
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: user.user_photo,
  });
});

export {
  createRouter as createUser,
  deleteRouter as deleteUser,
  getAllRouter as getAllUser,
  getRouter as getUser,
  updateRouter as updateUser,
};
