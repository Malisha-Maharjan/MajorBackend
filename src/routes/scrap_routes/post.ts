import { bsToAd } from "@sbmdkl/nepali-date-converter";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { scrapNewsRepository } from "../../repository";
import { paginated } from "../../types/paginated";
import { createResponse } from "../../utils/response";

const scrapDataPostRouter = express.Router();
const scrapDataGetRouter = express.Router();

scrapDataPostRouter.post("/api/post/scrap", async (req, res) => {
  const data = req.body;
  console.log(data);
  if (data.english_date == null) {
    data.english_date = bsToAd(data.nepali_date);
  }
  const existingPost = await scrapNewsRepository.findOne({
    where: {
      date: data.english_date,
      headline_link: data.headline_link,
    },
  });
  if (existingPost)
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Data already stored"] },
    });
  console.log(data.english_date);

  const post = {
    headline: data.headline,
    headline_link: data.headline_link,
    date: data.english_date,
    image_url: data.image_url,
    paragraph: data.paragraph,
  };
  console.log("post", post);
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: await scrapNewsRepository.create(post).save(),
  });
  // return response.send({ message: "ok" });
});

scrapDataGetRouter.get("/api/post/scrap", async (req, res) => {
  const page = parseInt((req.query.pageNumber as string) || "0");
  const limit = parseInt((req.query.take as string) || "5");
  const skip = page * limit;
  const news = await scrapNewsRepository.find({
    order: { date: "DESC" },
    take: limit,
    skip: skip,
  });
  console.log(news);
  if (news.length === 0)
    return createResponse(res, StatusCodes.BAD_REQUEST, {
      status: "error",
      error: { message: ["Bad Request"] },
    });
  const previous_link = `/api/post/scrap?pageNumber=${page}`;
  const next_link = `/api/post/scrap?pageNumber=${
    news.length !== limit ? undefined : page + 1
  }`;
  const result: paginated = {
    current_page: page,
    take: news.length,
    next_page: news.length !== limit ? undefined : page + 1,
    previous_link: previous_link,
    next_link: next_link,
    data: news,
  };
  return createResponse(res, StatusCodes.OK, {
    status: "success",
    data: result,
  });
});

export { scrapDataGetRouter as scrapGet, scrapDataPostRouter as scrapPost };
