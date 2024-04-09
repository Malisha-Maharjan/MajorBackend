import { default as express } from "express";
import { StatusCodes } from "http-status-codes";
import { organization } from "../../enum/organization";
import { services } from "../../enum/services";
import { createResponse } from "../../utils/response";

const servicesRouter = express.Router();
const organizationRouter = express.Router();

servicesRouter.get("/api/services", async (req, res) => {
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: services,
  });
});

organizationRouter.get("/api/organizations", async (req, res) => {
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: organization,
  });
});

export {
  organizationRouter as getOrganizations,
  servicesRouter as getServices,
};
