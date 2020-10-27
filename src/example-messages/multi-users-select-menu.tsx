import React from "react";
import User from "../models/User";
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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const today = new Date().toISOString().split("T")[0];
let updatedDate: any = null;

export function MultiUsersSelectMenuModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Section
        text={`Select a day`}
        accessory={
          <DatePicker
            initialDate={today}
            onSelect={async ({ user, date }) => {
              await delay(2000);
              //2020-10-26 date format === date
              //timeStamp is for sending request to clickUP API
              updatedDate = new Date(date).getTime() / 1000;
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

export function MultiUsersSelectMenuExample({
  useModal,
  useState,
}: PheliaMessageProps) {
  let form = null;
  let user: any = null;
  let userToken: string = null;

  const openModal = useModal(
    "modal",
    MultiUsersSelectMenuModal,
    async (event) => {
      user = event.user;
      form = event.form;

      const slackID = user.id;
      const currentUser = await User.findOne({ slackID });
      userToken = currentUser.clickUpToken;

      const query = form.selection.map((id: any) => {
        return { slackID: id };
      });

      const usersArr = await User.find({ $or: query });
      // console.log(`users ----------------------`, usersArr);
      const usersString = usersArr.map((user) => user.clickUpID).toString();
      await getFilteredTasks(usersString);
    }
  );

  async function getFilteredTasks(users: string) {
    //TODO: page pending
    //TODO: date pending check for date Updated
    const teamID = 8509000;
    const page = 0;
    const oneDay = 1588671070;
    const dateLt = updatedDate + oneDay;

    const url = `https://api.clickup.com/api/v2/team/${teamID}/task?page=${page}&date_updated_gt=${updatedDate}&date_updated_lt=${dateLt}&assignees[]=${users}`;

    console.log(`url --------------`, url);
    const tasks = await axios.get(`${url}`, {
      headers: { Authorization: `${userToken}` },
    });

    console.log(`tasks -------------`, tasks);
  }

  return (
    <Message text="Get tasks">
      <Section
        text="Open get tasks modal"
        accessory={
          <Button
            action="open-modal"
            onClick={async () => {
              openModal();
            }}>
            Open modal
          </Button>
        }
      />
    </Message>
  );
}
