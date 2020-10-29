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
  Actions,
  Checkboxes,
  Option,
  TextField,
} from "phelia";
import { ConversationsSelectMenuModal } from "./example-messages";

//-------------------------------- Modal ------------------------------
//TODO: setup modal logic
export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showData, setShowData] = useState("showData", false);
  const [users, setUsers] = useState<Array<string>>("setUsers");

  //fetch Users from DB
  const fetchUsers = async () => {
    const usersArr: any = await User.find();
    setUsers(usersArr);
  };

  return (
    <Modal title={`Admin Panel`} submit="submit">
      {!showData && (
        <Actions>
          <Button
            action="showData"
            onClick={async () => {
              await fetchUsers();
              setShowData(true);
            }}>
            Show current ADMINS
          </Button>
        </Actions>
      )}

      {showData && users && (
        <>
          <Input label="Some checkboxes">
            <Checkboxes action="checkboxes">
              {users.map((user: any) => {
                return (
                  <Option
                    value={`${user.slackID}`}
                    selected={user.isAdmin ? true : false}>
                    {user.username}
                  </Option>
                );
              })}
            </Checkboxes>
          </Input>
        </>
      )}
    </Modal>
  );
}

//-------------------------------- Message API fetch----------------------

export function AdminPanel({ useModal, useState }: PheliaMessageProps) {
  let form = null;
  let user: any = null;
  let userToken: string = null;

  const openModal = useModal("modal", AdminPanelModal, async (event) => {
    user = event.user;
    form = event.form;
    console.log(`event -----------`, event);
    const slackID = user.id;
    const currentUser = await User.findOne({ slackID });
    userToken = currentUser.clickUpToken;
  });

  //retrieving modal data functions

  return (
    <Message text="Get tasks">
      <Section
        accessory={
          <Button
            action="open-modal"
            onClick={async () => {
              openModal();
            }}>
            Open Panel
          </Button>
        }>
        <Text>Opens the ADMIN panel. Click the button to begin</Text>
      </Section>
    </Message>
  );
}
