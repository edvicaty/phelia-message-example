import React from "react";
import User from "./models/User";
import axios from "axios";

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
} from "phelia";

//get yesterday function
// let yesterday: string = null;
// let date = new Date();
// date.setDate(date.getDate() - 1);
// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();
// if (month < 10) {
//   yesterday = `${year}-0${month}-${day}`;
// } else {
//   yesterday = `${year}-${month}-${day}`;
// }

//correction by utc to central and minus one day
// let updatedDate: any = Number(new Date().getTime()) - 21600000 - 86400000;

let updatedDate: any = null;

//-------------------------------- Modal ------------------------------

export function GetTasksByTimeModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Section
        text={`Select a day, default date: yesterday`}
        accessory={
          <DatePicker
            // initialDate={yesterday}
            onSelect={async ({ user, date }) => {
              updatedDate = await Number(new Date(date).getTime());
            }}
            action="date"
          />
        }
      />
      <Input label="Select menu">
        <MultiSelectMenu
          type="users"
          action="selection"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}
export function ShowTasksModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Section
        text={`Select a day, default date: yesterday`}
        accessory={
          <DatePicker
            // initialDate={yesterday}
            onSelect={async ({ user, date }) => {
              updatedDate = await Number(new Date(date).getTime());
            }}
            action="date"
          />
        }
      />
      <Input label="Select menu">
        <MultiSelectMenu
          type="users"
          action="selection"
          placeholder="A placeholder"
        />
      </Input>
    </Modal>
  );
}

//-------------------------------- Message API fetch----------------------

export function GetTasks({ useModal, useState }: PheliaMessageProps) {
  const [tasks, setTasks] = useState<any>("tasks");

  let form = null;
  let user: any = null;
  let userToken: string = null;

  const openDataModal = useModal(
    "modal",
    ShowTasksModal,
    (event) => console.log(event),
    () => console.log("canceled")
  );

  const openModal = useModal("modal", GetTasksByTimeModal, async (event) => {
    user = event.user;
    form = event.form;
    const slackID = user.id;
    const currentUser = await User.findOne({ slackID });
    userToken = currentUser.clickUpToken;

    const query = form.selection.map((id: any) => {
      return { slackID: id };
    });

    const usersArr = await User.find({ $or: query });
    const usersString = usersArr.map((user) => user.clickUpID).toString();

    const fetchedTasks = await getFilteredTasks(usersString);
    // setTasks(fetchedTasks.tasks);
    // setShowData(true);
    console.log(`fetched ----------`, tasks);
    setTimeout(openDataModal, 1000);
    // openDataModal(); //{ tasks: fetchedTasks.tasks }
  });

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
        text="Open get tasks modal"
        accessory={
          <Button
            action="open-modal"
            onClick={() => {
              openModal();
            }}>
            Open modal
          </Button>
        }
      />
    </Message>
  );
}
