import express from "express";
import { GetTasksCurrentUser } from "../components/get-tasks-current-user-modal";
import { GetTasks } from "../components/get-tasks-modal";
import { TextMessage } from "../components/text-message";
import db from "../firestore-config";
import client from "../phelia-config";

const router = express.Router();

//get tasks admin : /get-tasks command
router.post("/get-tasks-admin", async function (req, res) {
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

  const userRef = await db.collection(`users`).doc(`${user_id}`);
  const user = await userRef.get();

  if (user.exists && user.data().isAdmin) {
    client.postMessage(GetTasks, `${user_id}`);
  } else {
    const message = `You need to have ADMIN status to be able to check the tasks of all users. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//get tasks current user : /get-my-tasks command
router.post("/get-tasks-user", async function (req, res) {
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

export default router;
