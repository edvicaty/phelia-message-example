import dotenv from "dotenv";
import express from "express";

import Phelia from "phelia";
import { RandomImage } from "./random-image";

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([RandomImage]);
// Register the interaction webhook
app.post(
  "/interactions",
  client.messageHandler(process.env.SLACK_SIGNING_SECRET)
);
app.get("/", function (req, res) {
  res.send(`hello`);
});

// This is how you post a message....
client.postMessage(RandomImage, "U01CMED2XF1");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
