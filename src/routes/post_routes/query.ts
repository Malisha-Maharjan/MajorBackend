import express from "express";
import { AppDataSource } from "../../data-source";

export const query = express.Router();

query.get("/api/query", async (req, res) => {
  const result = await AppDataSource.query(
    `Select c.comment, c.date, u.userName, u.photo from comment as c left join user as u on u.id = c.userId order by c.date desc Limit 2 where c.postId = 12`
  );
  console.log(result);
  return res.send("ok");
});
