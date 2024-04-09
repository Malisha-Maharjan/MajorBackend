import { default as express } from "express";
import { sendEmail } from "../../utils/email";

const send = express.Router();

send.get("/api/send", async (req, res) => {
  await sendEmail(
    ["malishamaharjan00@gmail.com"],
    "Verified Successful",
    `<p>GeoMedLink</p>`
  );
  return res.send("ok");
});

export { send as send };
