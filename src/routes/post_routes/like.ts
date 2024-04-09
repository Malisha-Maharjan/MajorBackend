import express from "express";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../../data-source";
import { Like } from "../../entity/Like";
import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { createResponse } from "../../utils/response";

const likePostRouter = express.Router();
likePostRouter.put("/api/post/like/:id/:username", async (req, res) => {
  console.log("This is like");
  const queryRunner = AppDataSource.createQueryRunner();
  const userRunner = queryRunner.manager.getRepository(User);
  const likeRunner = queryRunner.manager.getRepository(Like);
  const postRunner = queryRunner.manager.getRepository(Post);
  await queryRunner.startTransaction();

  const postId = { id: parseInt(req.params.id) };
  const username = req.params.username;
  try {
    const post = await postRunner.findOne({
      where: {
        id: postId["id"],
      },
    });
    const user = await userRunner.findOne({
      where: {
        userName: username,
      },
    });
    if (!post || !user) {
      throw new Error();
    }
    const existingLike = await likeRunner.findOne({
      where: { user: { id: user.id }, post: { id: post.id } },
    });
    if (existingLike) {
      post.count_likes = post.count_likes - 1;
      post.save();
      await likeRunner.delete({ id: existingLike.id });
    } else {
      const like = likeRunner.create();
      like.post = post;
      like.user = user;
      post.count_likes = post.count_likes + 1;
      like.save();
      post.save();
    }
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    return createResponse(res, StatusCodes.OK, {
      status: "error",
      error: { message: ["Error Occurred"] },
    });
  } finally {
    await queryRunner.release();
  }

  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: postId,
  });
});
export { likePostRouter as LikeRouter };
