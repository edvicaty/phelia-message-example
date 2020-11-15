import express from "express";
import { GetTasksCurrentUser } from "../components/GetTasksCurrentUser";
import { GetTasks } from "../components/GetTasks";
import { TextMessage } from "../components/TextMessage";
import db from "../config/firestore";
import client from "../config/phelia";
import getData from "../graphQL/fetchData";

const router = express.Router();

//get tasks admin : /get-tasks command
router.post("/get-tasks-admin", async function (req, res) {
  await res.sendStatus(200);

  const { user_id } = await req.body;

  const slackIdVar = {
    slackId: user_id,
  };

  const getUserBySlackIdQuery = `
  query($slackId: String!) {
    filtered: users(
      options: {
        filter: [{ field: "services.slack.id", operator: "==", value: $slackId }]
        limit: 1
      }
    ) {
      id
      createdAt
      updatedAt
      services {
        clickUp {
          id
          token
          workspace
          isAdmin
        }
        slack {
          id
          username
        }
      }
    }
  }
  `;
  const user = await getData(getUserBySlackIdQuery, slackIdVar);

  if (user.filtered[0].id && user.filtered[0].services.clickUp.isAdmin) {
    client.postMessage(GetTasks, `${user_id}`);
  } else {
    const message = `You need to have ADMIN status to be able to check the tasks of all users. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
    client.postMessage(TextMessage, `${user_id}`, { message });
  }
});

//get tasks current user : /get-my-tasks command
router.post("/get-tasks-user", async function (req, res) {
  await res.sendStatus(200);

  const { user_id } = await req.body;

  client.postMessage(GetTasksCurrentUser, `${user_id}`);
});

export default router;
