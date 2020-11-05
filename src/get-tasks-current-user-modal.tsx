import React from "react";
import axios from "axios";
import db from "./firestore-config";
import {
  Button,
  Divider,
  Input,
  Message,
  Modal,
  MultiSelectMenu,
  PheliaMessageProps,
  Section,
  Text,
  DatePicker,
  Actions,
} from "phelia";

let updatedDate: any = null;

//-------------------------------- Modal ------------------------------

export function GetTasksCurrentUserModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Section
        text={`Select a day`}
        accessory={
          <DatePicker
            onSelect={async ({ user, date }) => {
              updatedDate = await Number(new Date(date).getTime());
            }}
            action="date"
          />
        }
      />
    </Modal>
  );
}

//-------------------------------- Message API fetch----------------------

export function GetTasksCurrentUser({
  useModal,
  useState,
}: PheliaMessageProps) {
  const [tasks, setTasks] = useState<Array<string>>("tasks");
  const [showForm, setShowForm] = useState("showForm", false);

  let form = null;
  let user: any = null;
  let userToken: string = null;

  const openModal = useModal(
    "modal",
    GetTasksCurrentUserModal,
    async (event) => {
      // console.log(`submit trigered------`, event);
      user = event.user;
      form = event.form;
      const slackID = user.id;

      // const currentUser = await User.findOne({ slackID });
      const userRef = await db.collection(`users`).doc(`${slackID}`);
      const currentUser = await userRef.get();

      userToken = currentUser.data().clickUpToken;

      // console.log(`userToken ------`, userToken);

      const fetchedTasks = await getFilteredTasks(
        String(currentUser.data().clickUpID)
      );

      console.log(`tasks when not fetched --------`, fetchedTasks);

      if (fetchedTasks.tasks.length === 0 || !fetchedTasks) {
        setTasks(null);
      } else {
        setTasks(fetchedTasks.tasks);
      }
      setShowForm(true);
    }
  );

  //retrieving modal data functions
  async function getFilteredTasks(users: string) {
    const teamID = 8509000; //worskpace ID
    const page = 0;
    const oneDay = 86400000;
    const utcToCentral = updatedDate + 21600000;
    const dateLt = utcToCentral + oneDay;

    const url = `https://api.clickup.com/api/v2/team/${teamID}/task?page=${page}&date_updated_gt=${utcToCentral}&date_updated_lt=${dateLt}&assignees[]=${users}`;

    // console.log(`url -------------`, url);

    const tasks = await axios.get(`${url}`, {
      headers: { Authorization: `${userToken}` },
    });

    return tasks.data;
  }

  return (
    <Message text="Get tasks">
      <Section
        accessory={
          <Button
            action="open-modal"
            onClick={async () => {
              openModal();
            }}>
            Get tasks
          </Button>
        }>
        <Text>Get tasks from the current user. Click the button to begin</Text>
      </Section>

      {showForm && tasks && (
        <Section
          accessory={
            <Button
              action="tasks"
              onClick={() => {
                console.log(tasks);
              }}>
              log tasks
            </Button>
          }>
          {tasks.map((task: any) => (
            <Text type="mrkdwn">
              * *Task:* {task.name}
              {`\n`} {``}* *Description:* {``}
              {task.description}
              {`\n`} {``}* *Assignee:* {``}
              {task.assignees.map((assignee: any) => `${assignee.username}, `)}
              {`\n`}* *Status:* {``}```
              {task.status.type}``` ----------
            </Text>
          ))}
        </Section>
      )}
    </Message>
  );
}
