import express from "express";
import {
  notSpam,
  spamPost,
  spamVerified,
} from "./routes/admin_routes/spam_post";
import { unverifiedDoctor } from "./routes/admin_routes/unverified_doctor";
import {
  deleteComment,
  getComment,
  likeComment,
  postComment,
  updateComment,
} from "./routes/comment_routes/comment";

import {
  addEvent,
  deleteEvent,
  getEvent,
} from "./routes/event_routes/addEvent";
import { login } from "./routes/login_routes/login";
import { activeAmbulance, activeDonor } from "./routes/map_routes/active";
import { bloodFilter } from "./routes/map_routes/blood";
import { changePassword } from "./routes/password_routes/change-password";
import { forgetPassword } from "./routes/password_routes/forget-password";
import { LikeRouter } from "./routes/post_routes/like";
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  reportPost,
  userPost,
} from "./routes/post_routes/post";
import { query } from "./routes/post_routes/query";
import { scrapGet, scrapPost } from "./routes/scrap_routes/post";
import { send } from "./routes/scratch/emails";
import {
  getOrganizations,
  getServices,
} from "./routes/services_routes/organization_services";
import {
  activateDonor,
  deactivateDonor,
} from "./routes/user_routes/blood-donor";
import {
  UpdateDoctor,
  getDoctor,
  registerDoctor,
  verifyDoctor,
} from "./routes/user_routes/doctor";
import { searchRoute } from "./routes/user_routes/search_user";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from "./routes/user_routes/user";
import { completedRouter } from "./utils/completed";
import { distanceRouter } from "./utils/distance";
import {
  ambulanceRequest,
  confirmAmbulance,
  confirmNotification,
  notification,
  respondAmbulance,
  respondNotification,
} from "./utils/notification";

const app = express();

export const routes =
  (app.use(createUser),
  app.use(getAllUser),
  app.use(getUser),
  app.use(deleteUser),
  app.use(updateUser),
  app.use(activateDonor),
  app.use(deactivateDonor),
  app.use(UpdateDoctor),
  app.use(verifyDoctor),
  app.use(registerDoctor),
  app.use(getDoctor),
  app.use(scrapGet),
  app.use(scrapPost),
  app.use(login),
  app.use(forgetPassword),
  app.use(LikeRouter),
  app.use(createPost),
  app.use(deletePost),
  app.use(getAllPost),
  app.use(userPost),
  app.use(getPost),
  app.use(deleteComment),
  app.use(getComment),
  app.use(likeComment),
  app.use(postComment),
  app.use(updateComment),
  app.use(reportPost),
  app.use(spamPost),
  app.use(unverifiedDoctor),
  app.use(getServices),
  app.use(getOrganizations),
  app.use(send),
  app.use(changePassword),
  app.use(notification),
  app.use(activeDonor),
  app.use(bloodFilter),
  app.use(searchRoute),
  app.use(query),
  app.use(spamVerified),
  app.use(respondNotification),
  app.use(confirmNotification),
  app.use(ambulanceRequest),
  app.use(respondAmbulance),
  app.use(confirmAmbulance),
  app.use(addEvent),
  app.use(getEvent),
  app.use(activeAmbulance),
  app.use(deleteEvent),
  app.use(notSpam),
  app.use(distanceRouter),
  app.use(completedRouter));
