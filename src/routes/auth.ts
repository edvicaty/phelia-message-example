import Axios from "axios";
import express from "express";
import { AdminPanel } from "../components/admin-panel-modal";
import { RegistrationModal } from "../components/registration-modal";
import { TextMessage } from "../components/text-message";
import db from "../firestore-config";
import client from "../phelia-config";

const router = express.Router();

//AUTH functions START ------------------------------------
const baseURL = "https://phelia-test-slack.herokuapp.com/";
const userService = Axios.create({
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

//slash command POST route => set from slack web app : /register command
router.post("/redirect", async function (req, res) {
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

  //name of the docs corresponds to the user slack ID
  const userRef = await db.collection(`users`).doc(`${user_id}`);
  const user = await userRef.get();
  if (!user.exists) {
    await userRef.set({
      username: user_name,
      slackID: user_id,
      clickUpToken: "",
      clickUpID: "",
      isAdmin: false,
    });
  }

  await client.openModal(RegistrationModal, trigger_id, { name: user_name });
});

//auth to bind ClickUp's API token to DB
router.get("/auth", async function (req, res) {
  const authCode = await req.query.code;

  const accessToken = await auth(
    process.env.CLICKUP_ID,
    process.env.CLICKUP_SECRET,
    authCode
  );

  const user = await getUser(accessToken.data.access_token);

  await db.collection(`users`).doc(`${slackUserIDToRegister}`).update({
    clickUpToken: accessToken.data.access_token,
    clickUpID: user.data.user.id,
  });

  slackUserIDToRegister = null;

  res.redirect("/registration");
});

//feedback route
router.get("/registration", function (req, res) {
  res.send("Registration completed");
});

//set current slack user as admin route : /setAdmin [token] command
router.post("/setadmin", async function (req, res) {
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
    await db.collection(`users`).doc(`${user_id}`).update({ isAdmin: true });
    message = `${user_name} is now admin`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  } else {
    message = "Wrong token";
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//admin panel to list and modify slack admins: /admin-panel command
router.post("/admin-panel", async function (req, res) {
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

  const userRef = await db.collection(`users`).doc(`${user_id}`);
  const user = await userRef.get();

  if (user.exists && user.data().isAdmin) {
    client.postMessage(AdminPanel, `${user_id}`);
  } else {
    const message = `You need to have ADMIN status to be able to use this command. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

export default router;
