import dotenv from "dotenv";
import express from "express";
import { createEventAdapter } from "@slack/events-api";
import bodyParser from "body-parser";

import Phelia from "phelia";
import {
  BirthdayPicker,
  ChannelsSelectMenuExample,
  ChannelsSelectMenuModal,
  ConversationsSelectMenuExample,
  ConversationsSelectMenuModal,
  Counter,
  ExternalSelectMenuExample,
  ExternalSelectMenuModal,
  Greeter,
  ModalExample,
  MultiChannelsSelectMenuExample,
  MultiChannelsSelectMenuModal,
  MultiConversationsSelectMenuExample,
  MultiConversationsSelectMenuModal,
  MultiExternalSelectMenuExample,
  MultiExternalSelectMenuModal,
  MultiStaticSelectMenuExample,
  MultiStaticSelectMenuModal,
  MultiUsersSelectMenuExample,
  MultiUsersSelectMenuModal,
  MyModal,
  OverflowMenuExample,
  RadioButtonExample,
  RadioButtonModal,
  RandomImage,
  StaticSelectMenuExample,
  StaticSelectMenuModal,
  UsersSelectMenuExample,
  UsersSelectMenuModal,
  HomeApp,
} from "./example-messages";

dotenv.config();

const app = express();
const port = process.env.PORT || 80;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([
  BirthdayPicker,
  Counter,
  Greeter,
  ModalExample,
  MyModal,
  RandomImage,
  OverflowMenuExample,
  RadioButtonModal,
  RadioButtonExample,
  StaticSelectMenuExample,
  StaticSelectMenuModal,
  UsersSelectMenuExample,
  UsersSelectMenuModal,
  ConversationsSelectMenuExample,
  ConversationsSelectMenuModal,
  ChannelsSelectMenuModal,
  ChannelsSelectMenuExample,
  ExternalSelectMenuExample,
  ExternalSelectMenuModal,
  MultiStaticSelectMenuExample,
  MultiStaticSelectMenuModal,
  MultiExternalSelectMenuExample,
  MultiExternalSelectMenuModal,
  MultiUsersSelectMenuExample,
  MultiUsersSelectMenuModal,
  MultiChannelsSelectMenuExample,
  MultiChannelsSelectMenuModal,
  MultiConversationsSelectMenuExample,
  MultiConversationsSelectMenuModal,
]);

// Register the interaction webhook
app.post(
  "/interactions",
  client.messageHandler(process.env.SLACK_SIGNING_SECRET)
);

app.post("/test", function (req, res) {
  client.postMessage(RandomImage, "U01CMED2XF1");
  console.log(`slash command body----------`, req.body);
  console.log(`slash command params----------`, req.params);
  console.log(`slash command headers----------`, req.headers);
  console.log(`slash command rawheaders----------`, req.rawHeaders);
  // /randomImg
});

// Register your Home App
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on("app_home_opened", client.appHomeHandler(HomeApp));

app.use("/events", slackEvents.requestListener());

// (async () => {
//   const key = await client.postMessage(ModalExample, "@max", { name: "Max" });

//   await client.updateMessage(key, { name: "me but laters" });
// })();

client.postMessage(BirthdayPicker, "U01CMED2XF1");
client.postMessage(ChannelsSelectMenuExample, "U01CMED2XF1");
client.postMessage(ChannelsSelectMenuModal, "U01CMED2XF1");
client.postMessage(ConversationsSelectMenuExample, "U01CMED2XF1");
client.postMessage(ConversationsSelectMenuModal, "U01CMED2XF1");
client.postMessage(Counter, "U01CMED2XF1");
client.postMessage(ExternalSelectMenuExample, "U01CMED2XF1");
client.postMessage(ExternalSelectMenuModal, "U01CMED2XF1");
client.postMessage(Greeter, "U01CMED2XF1");
client.postMessage(ModalExample, "U01CMED2XF1");
client.postMessage(MultiChannelsSelectMenuExample, "U01CMED2XF1");
client.postMessage(MultiChannelsSelectMenuModal, "U01CMED2XF1");
client.postMessage(MultiConversationsSelectMenuExample, "U01CMED2XF1");
client.postMessage(MultiConversationsSelectMenuModal, "U01CMED2XF1");
client.postMessage(MultiExternalSelectMenuExample, "U01CMED2XF1");
client.postMessage(MultiExternalSelectMenuModal, "U01CMED2XF1");
client.postMessage(MultiStaticSelectMenuExample, "U01CMED2XF1");
client.postMessage(MultiStaticSelectMenuModal, "U01CMED2XF1");
client.postMessage(MultiUsersSelectMenuExample, "U01CMED2XF1");
client.postMessage(MultiUsersSelectMenuModal, "U01CMED2XF1");
client.postMessage(MyModal, "U01CMED2XF1");
client.postMessage(OverflowMenuExample, "U01CMED2XF1");
client.postMessage(RadioButtonExample, "U01CMED2XF1");
client.postMessage(RadioButtonModal, "U01CMED2XF1");
client.postMessage(RandomImage, "U01CMED2XF1");
client.postMessage(StaticSelectMenuExample, "U01CMED2XF1");
client.postMessage(StaticSelectMenuModal, "U01CMED2XF1");
client.postMessage(UsersSelectMenuExample, "U01CMED2XF1");
client.postMessage(UsersSelectMenuModal, "U01CMED2XF1");
client.postMessage(HomeApp, "U01CMED2XF1");

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
