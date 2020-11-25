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
import { CreateTask, CreateTaskModal } from "./create-task-modal";
import { GetTasks, GetTasksByTimeModal } from "./get-tasks-modal";
import { TextMessage } from "./text-message";
import {
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
  // testModal,
} from "./get-tasks-current-user-modal";
import { AdminPanel, AdminPanelModal } from "./admin-panel-modal";

dotenv.config();

const app = express();

const port = process.env.PORT || 80;

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([
  TextMessage,
  AdminPanel,
  AdminPanelModal,
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
  GetTasksByTimeModal,
  GetTasks,
  CreateTaskModal,
  CreateTask,
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
  // testModal,
]);

// Register the interaction webhook
app.post(
  "/interactions",
  client.messageHandler(process.env.SLACK_SIGNING_SECRET)
);

// Register your Home App
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on("app_home_opened", client.appHomeHandler(HomeApp));

app.use("/events", slackEvents.requestListener());

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

//get tasks admin
app.post("/get-tasks-admin", async function (req, res) {
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

  const user = await User.findOne({ slackID: user_id });

  if (user.isAdmin) {
    client.postMessage(GetTasks, `${user_id}`);
  } else {
    const message = `You need to have ADMIN status to be able to check the tasks of all users. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//get tasks current user
app.post("/get-tasks-user", async function (req, res) {
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

  client.postMessage(GetTasksCurrentUser, `${user_id}`);
});
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

async function getUser(token: any) {
  const user = await userService.get(`https://api.clickup.com/api/v2/user`, {
    headers: { Authorization: `${token}` },
  });
  return user;
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
      clickUpID: "",
      isAdmin: false,
    });
  }
  await client.openModal(RegistrationModal, trigger_id, { name: user_name });
});

//auth to bind ClickUp's API token to DB.
app.get("/auth", async function (req, res) {
  const authCode = await req.query.code;

  const accessToken = await auth(
    process.env.CLICKUP_ID,
    process.env.CLICKUP_SECRET,
    authCode
  );

  const user = await getUser(accessToken.data.access_token);

  await User.findOneAndUpdate(
    { slackID: slackUserIDToRegister },
    {
      clickUpToken: accessToken.data.access_token,
      clickUpID: user.data.user.id,
    }
  );

  slackUserIDToRegister = null;

  res.redirect("/registration");
});

//feedback route
app.get("/registration", function (req, res) {
  res.send("Registration completed");
});

//set current slack user as admin route (/setAdmin)
app.post("/setadmin", async function (req, res) {
  await res.sendStatus(200);

  const {
    token,
    team_id,
    team_domain,
    user_id,
    user_name,
    api_app_id,
    trigger_id,
    text,
  } = await req.body;

  let message: string = null;

  if (text === process.env.SLACK_ADMIN_TOKEN) {
    await User.findOneAndUpdate({ slackID: user_id }, { isAdmin: true });
    message = `${user_name} is now admin`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  } else {
    message = "Wrong token";
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//admin panel to list and modify slack admins (/admin-panel)
app.post("/admin-panel", async function (req, res) {
  await res.sendStatus(200);

  const {
    token,
    team_id,
    team_domain,
    user_id,
    user_name,
    api_app_id,
    trigger_id,
    text,
  } = await req.body;

  const user = await User.findOne({ slackID: user_id });

  if (user.isAdmin) {
    client.postMessage(AdminPanel, `${user_id}`);
  } else {
    const message = `You need to have ADMIN status to be able to use this command. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//--------------------------------------------------------- AUTH END ----------------------------------------------------------------------------------

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
