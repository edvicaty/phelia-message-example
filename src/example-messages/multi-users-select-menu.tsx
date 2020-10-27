import React from "react";
import User from "../models/User";

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
} from "phelia";

//TODO: 2 fetch users clickUP IDs from slack ID's
export function MultiUsersSelectMenuModal() {
  return (
    <Modal title="Users multi select menu" submit="Submit">
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
  let user = null;

  const openModal = useModal(
    "modal",
    MultiUsersSelectMenuModal,
    async (event) => {
      user = event.user;
      form = event.form;
      //form.selection to get users IDs is an array of slack IDs
      const query = form.selection.map((id: any) => {
        return { slackID: id };
      });
      console.log(`query -------------------`, query);
      // await User.find();
    }
  );

  return (
    <Message text="Get tasks">
      <Section
        text="Open get tasks modal"
        accessory={
          <Button action="open-modal" onClick={() => openModal()}>
            Open modal
          </Button>
        }
      />
    </Message>
  );
}
