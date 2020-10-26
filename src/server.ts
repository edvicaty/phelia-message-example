import dotenv from "dotenv";
import express from "express";
import { createEventAdapter } from "@slack/events-api";
import bodyParser from "body-parser";
import Phelia from "phelia";
import axios from "axios";
import mongoose from "mongoose";
import User from "./models/User";

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
import { RegistrationModal } from "./registration-modal";
import { CreateFileModal } from "./create-file-modal";

dotenv.config();

const app = express();

const port = process.env.PORT || 80;

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([
  CreateFileModal,
  RegistrationModal,
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

// Register your Home App
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

app.use("/events", slackEvents.requestListener());

//post HomeApp component when app is opened
// slackEvents.on("app_home_opened", client.appHomeHandler(HomeApp));

//Here are the documentation's base components to be implemented. For some of them to work, user data will be required (pass user data as props)

// client.postMessage(RandomImage, "U01CMED2XF1"); //main account user ID for edvicaty. User ID or @edvicaty will work. ID recommended
// client.postMessage(RandomImage, "C01D8BH4L2G"); //using channel's ID get from slack API https://api.slack.com/methods/conversations.list/test token is bot oauth token.
// client.postMessage(BirthdayPicker, "#general"); //using channel's name with # prefix will work too
// client.postMessage(RandomImage, "general"); //using channel's name without prefix will work. Not recommended
// client.postMessage(BirthdayPicker, "U01CMED2XF1");
// client.postMessage(ChannelsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ChannelsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(ConversationsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ConversationsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(Counter, "U01CMED2XF1");
// client.postMessage(ExternalSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ExternalSelectMenuModal, "U01CMED2XF1");
// client.postMessage(Greeter, "U01CMED2XF1");
// client.postMessage(ModalExample, "U01CMED2XF1");
// client.postMessage(MultiChannelsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiChannelsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiConversationsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiConversationsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiExternalSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiExternalSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiStaticSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiStaticSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiUsersSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiUsersSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MyModal, "U01CMED2XF1");
// client.postMessage(OverflowMenuExample, "U01CMED2XF1");
// client.postMessage(RadioButtonExample, "U01CMED2XF1");
// client.postMessage(RadioButtonModal, "U01CMED2XF1");
// client.postMessage(RandomImage, "U01CMED2XF1");
// client.postMessage(StaticSelectMenuExample, "U01CMED2XF1");
// client.postMessage(StaticSelectMenuModal, "U01CMED2XF1");
// client.postMessage(UsersSelectMenuExample, "U01CMED2XF1");
// client.postMessage(UsersSelectMenuModal, "U01CMED2XF1");
// client.postMessage(HomeApp, "U01CMED2XF1");

//loading body parser before phelia components will crash the app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//--------------------------------------------------------- config & imports END ----------------------------------------------------------------------------------

//----------------------------------------------                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ----------- mongoDB START ----------------------------------------------------------------------------------
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });
//--------------------------------------------------------- mongoDB END ------------------------------------------------------------------------------------

//--------------------------------------------------------- routes START ----------------------------------------------------------------------------------

//On slack app you will define post routes for slash commands, here is te POST route corresponding to /randomImg
app.post("/test", async function (req, res) {
  //A response with status 200 is needed to prevent slack's incomplete message feedback
  await res.sendStatus(200);

  //The body of the request will contain the following data:
  const {
    token,
    team_id,
    team_domain,
    user_id,
    user_name,
    api_app_id,
    trigger_id,
  } = await req.body;

  // You can post a message to a certain user or channel, te first parameter of the following function is the component to be loaded, the second parameter corresponds to
  // the user or channel in which the message will be posted. You can use ID's (recommended for users) or #channel for channel (e.g. #general)
  // client.postMessage(HomeApp, "U01CMED2XF1");

  //You can also set a modal to be oppened. It's recommended to pass as props the data needed to that modal to load (e.g. here we are passing the user_name as the prop 'name')
  // await client.openModal(CreateFileModal, trigger_id, { name: user_name });
  // await client.openModal(CreateFileModal, trigger_id, { name: user_name });
  client.postMessage(ModalExample, "U01CMED2XF1");
});
//TODO: make routes to interact with clickUP
//--------------------------------------------------------- routes END ----------------------------------------------------------------------------------

//--------------------------------------------------------- AUTH START ----------------------------------------------------------------------------------

//AUTH functions START ------------------------------------
const baseURL = "https://phelia-test-slack.herokuapp.com/";
const userService = axios.create({
  baseURL,
  withCredentials: false,
});

async function auth(clientID: any, clientSecret: any, authCode: any) {
  const accessToken = await userService.post(
    `https://api.clickup.com/api/v2/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authCode}`
  );
  return accessToken;
}
//AUTH functions END --------------------------------------

let slackUserIDToRegister: string = null;

//slash command POST route => set from slack web app /register command
app.post("/redirect", async function (req, res) {
  await res.sendStatus(200);

  const {
    token,
    team_id,
    team_domain,
    user_id,
    user_name,
    api_app_id,
    trigger_id,
  } = await req.body;

  slackUserIDToRegister = user_id;

  const user = await User.findOne({ slackID: user_id });
  if (!user) {
    User.create({
      username: user_name,
      slackID: user_id,
      clickUpToken: "",
    });
  }
  await client.openModal(RegistrationModal, trigger_id, { name: user_name });

  // const client_id = "RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V"; //from slack web app
  // const redirect_uri = "https://phelia-test-slack.herokuapp.com/auth";
});

//auth to bind ClickUp's API token to DB. The DB will relate slack's user ID to clickUP access token for future post request to ClickUp API
app.get("/auth", async function (req, res) {
  const authCode = await req.query.code;
  console.log(`auth code`, authCode);

  const accessToken = await auth(
    process.env.CLICKUP_ID,
    process.env.CLICKUP_SECRET,
    authCode
  );

  await User.findOneAndUpdate(
    { slackID: slackUserIDToRegister },
    { clickUpToken: accessToken.data.access_token }
  );

  slackUserIDToRegister = null;

  res.redirect("/registration");
});

//feedback route
app.get("/registration", function (req, res) {
  res.send("Registration completed");
});
//--------------------------------------------------------- AUTH END ----------------------------------------------------------------------------------

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
