import express from "express";
import { StatusCodes } from "http-status-codes";
import { Post } from "../../entity/Post";
import { postRepository, userRepository } from "../../repository";

import { AppDataSource } from "../../data-source";
import { paginated } from "../../types/paginated";
import { createResponse } from "../../utils/response";
import { createPostSchema } from "../../zod-schema/post-post";
import { userNameSchema } from "../../zod-schema/user-schema";

const createPostRouter = express.Router();
// const likePostRouter = express.Router();
const getPostRouter = express.Router();
const getPostOfUserRouter = express.Router();
const getAllPostRouter = express.Router();
const sharedPostRouter = express.Router();
const deletePostRouter = express.Router();
const reportPostRouter = express.Router();

createPostRouter.post("/api/post/create", async (req, res) => {
  const data = req.body;
  console.log(data);
  createPostSchema.parse(data);
  const user = await userRepository.findOne({
    where: {
      userName: data["userName"],
    },
  });
  // console.log(user);

  if (!user) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User not found"] },
    });
  }

  if (!data["post"] && !data["photo"]) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Null post"] },
    });
  }
  console.log(user);
  const post = postRepository.create();
  post.photo = data["photo"];
  post.user = user;
  post.date = new Date();
  post.post = data["post"];

  return createResponse<Post>(res, StatusCodes.OK, {
    status: "success",
    data: await post.save(),
  });
});

// likePostRouter.put("/api/post/like/:id", async (req, res) => {
//   const postId = { id: parseInt(req.params.id) };
//   const post = await postRepository.findOne({
//     where: {
//       id: postId["id"],
//     },
//   });
//   if (!post) {
//     return createResponse(res, StatusCodes.BAD_REQUEST, {
//       status: "error",
//       error: { message: ["Post not available"] },
//     });
//   }
//   post.likes = post.likes + 1;
//   post.save();
//   return createResponse(res, StatusCodes.OK, {
//     status: "success",
//     data: "Like Updated",
//   });
// });

getPostRouter.get("/api/post/get/:id", async (req, res) => {
  const postId = { id: parseInt(req.params.id) };
  const post = await postRepository.findOne({
    where: {
      id: postId["id"],
    },
  });

  if (!post) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }
  // console.log(post);
  return createResponse<Post>(res, StatusCodes.OK, {
    status: "success",
    data: post,
  });
});

getPostOfUserRouter.get("/api/post/:userName", async (req, res) => {
  console.log("getting post");
  console.log(req.query.pageNumber);
  const page = parseInt((req.query.pageNumber as string) || "0");
  const limit = parseInt((req.query.take as string) || "5");
  const skip = page * limit;
  const data = { userName: req.params.userName };
  userNameSchema.parse(data);
  const user = await userRepository.findOne({
    where: {
      userName: data["userName"],
    },
  });

  if (!user) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["User not available"] },
    });
  }

  // const post = await postRepository
  //   .createQueryBuilder("post")
  //   .leftJoinAndSelect("post.like", "like")
  //   .leftJoin("post.user", "user")
  //   .select(["post", "user.userName, user.photo"])
  //   .where("post.userId = :id", { id: user.id })
  //   .addSelect([
  //     `CASE WHEN like.userId =${user.id}  THEN true ELSE false END AS isLiked`,
  //   ])
  //   .orderBy({ date: "DESC" })
  //   .limit(limit)
  //   .offset(skip)
  //   .getRawMany();
  const post = await AppDataSource.query(`
    SELECT u.userName, p.post, p.date, u.user_photo, p.photo, p.id, 
      (SELECT COUNT(*) FROM \`like\` WHERE userId = 17 AND postId = p.Id) > 0 AS isLiked
    FROM post AS p
    LEFT JOIN user AS u ON u.id = p.userId where p.userId = ${user.id}
    ORDER BY p.date desc
    LIMIT ${limit} OFFSET ${skip};
  `);
  const previous_link = `/api/post/${data["userName"]}?pageNumber=${page}`;
  const next_link = `/api/post/${data["userName"]}?pageNumber=${
    post.length !== limit ? undefined : page + 1
  }`;
  const result: paginated = {
    current_page: page,
    take: post.length,
    next_page: post.length !== limit ? undefined : page + 1,
    previous_link: previous_link,
    next_link: next_link,
    data: post,
  };
  if (post === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: result,
  });
});

getAllPostRouter.get("/api/post/all", async (req, res) => {
  const token = req.headers["authorization"];
  const token_payload = JSON.parse(
    Buffer.from(token!.split(".")[1], "base64").toString()
  );

  const page = parseInt((req.query.pageNumber as string) || "0");
  const limit = 5;
  const skip = page * limit;
  const post = await AppDataSource.query(`
  SELECT u.userName, p.post, p.date, u.user_photo, p.photo, p.id, p.is_spam, p.count_likes,
    (SELECT COUNT(*) FROM \`like\` WHERE userId = 17 AND postId = p.Id) > 0 AS isLiked
  FROM post AS p
  LEFT JOIN user AS u ON u.id = p.userId
  ORDER BY p.date desc
  LIMIT ${limit} OFFSET ${skip};
`);

  if (post === null) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }
  const previous_link = `/api/post/all?pageNumber=${page}`;
  const next_link = `/api/post/all?pageNumber=${
    post.length !== limit ? undefined : page + 1
  }`;
  const result: paginated = {
    current_page: page,
    take: post.length,
    next_page: post.length !== limit ? undefined : page + 1,
    previous_link: previous_link,
    next_link: next_link,
    data: post,
  };
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: result,
  });
});

// sharedPostRouter.post("/api/post/shared", async (req, res) => {
//   const data = req.body;
//   sharedPostSchema.parse(data);
//   const user = await userRepository.findOne({
//     where: {
//       userName: data["userName"],
//     },
//   });
//   if (!user) {
//     return createResponse(res, StatusCodes.BAD_REQUEST, {
//       status: "error",
//       error: { message: ["User not found"] },
//     });
//   }
//   const sharedPost = postRepository.create();
//   if (!(await postRepository.findOne({ where: { id: data["id"] } }))) {
//     return createResponse(res, StatusCodes.BAD_REQUEST, {
//       status: "error",
//       error: { message: ["Shared_item is not available"] },
//     });
//   }
//   sharedPost.is_shared = true;
//   sharedPost.sharedPID = data["sharedPID"];
//   sharedPost.post = data["post"];
//   sharedPost.photo = data["image"];
//   sharedPost.user = user;
//   sharedPost.date = new Date();
//   await sharedPost.save();
//   return createResponse(res, StatusCodes.OK, {
//     status: "success",
//     data: await sharedPost.save(),
//   });
// });

deletePostRouter.delete("/api/post/delete/:id", async (req, res) => {
  const postId = { id: parseInt(req.params.id) };
  const post = await postRepository.findOne({
    where: {
      id: postId["id"],
    },
  });
  if (!post) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Comment not available"] },
    });
  }
  await postRepository.delete({ id: postId["id"] });
  console.log("deleted");
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: { message: "successfully deleted" },
  });
});

reportPostRouter.put("/api/post/report/:id", async (req, res) => {
  const postId = { id: parseInt(req.params.id) };
  const post = await postRepository.findOne({
    where: {
      id: postId["id"],
    },
  });
  if (!post) {
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Post not available"] },
    });
  }
  console.log("spam spam");
  post.reported_spam = post.reported_spam + 1;
  post.save();
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: "Spam Reported",
  });
});

export {
  // likePostRouter as LikePost,
  createPostRouter as createPost,
  deletePostRouter as deletePost,
  getAllPostRouter as getAllPost,
  getPostRouter as getPost,
  reportPostRouter as reportPost,
  sharedPostRouter as sharedPost,
  getPostOfUserRouter as userPost,
};
