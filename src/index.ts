import express from "express";
import "express-async-errors";
import http from "http";
import { AppDataSource } from "./data-source";
// var admin = require("firebase-admin");
import { applicationDefault, initializeApp } from "firebase-admin/app";
// var serviceAccount = require("path/to/serviceAccountKey.json");

import bodyParser from "body-parser";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { pagination } from "typeorm-pagination";
import { errorMiddleware } from "./middleware/error";
import { routes } from "./routes";
import { createResponse } from "./utils/response";
const app = express();

const hostname = "192.168.1.67";

async function main() {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Database connected.");
    })
    .catch((error) => console.log(error));

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "100mb",
      parameterLimit: 50000,
    })
  );
  app.use(express.json({ limit: "30mb" }));
  app.use((req, res, next) => {
    console.log(req.url);
    console.log("This is hitting api");
    next();
  });

  app.post("/", async (req, res) => {
    return createResponse(res, StatusCodes.BAD_GATEWAY, {
      status: "error",
      error: { message: ["error error"] },
    });
  });

  app.use(
    cors({
      origin: "* ",
    })
  );
  app.use(routes);

  // app.use(token);

  app.use(errorMiddleware);
  app.use(pagination);

  // var serviceAccount = require("path/to/serviceAccountKey.json");
  process.env.GOOGLE_APPLICATION_CREDENTIALS;
  initializeApp({
    credential: applicationDefault(),
    projectId: "geomedlink-a59fa",
  });

  const server = http.createServer(app);
  const port = 3000;
  // server.listen(port, hostname, () => {
  //   console.log(`Server running at http://${hostname}:${port}`);
  // });

  app.listen(10000, "0.0.0.0", () => {
    console.log("Now running on port 10000");
  });
}

main();
