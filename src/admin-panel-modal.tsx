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

let submitted = false;

//-------------------------------- Modal ------------------------------
export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showData, setShowData] = useState("showData", false);
  const [users, setUsers] = useState<Array<string>>("setUsers");

  //fetch Users from DB
  const fetchUsers = async () => {
    const usersArr: any = await User.find();
    setUsers(usersArr);
  };

  return (
    <Modal title={`Admin Panel`} submit="Update Admin permissions">
      {!showData && (
        <Actions>
          <Button
            action="showData"
            onClick={async () => {
              await fetchUsers();
              await setShowData(true);
              submitted = true;
            }}>
            Show current ADMINS
          </Button>
        </Actions>
      )}

      {showData && users && (
        <>
          <Input label="Current Admins (checkbox enabled):">
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
  const [cancelled, setCancelled] = useState<boolean>("cancelled", false);

  let form = null;
  let user: any = null;
  let userToken: string = null;
  let admins: any = null;

  const openModal = useModal("modal", AdminPanelModal, async (event) => {
    if (submitted) {
      user = event.user;
      form = event.form;
      admins = event.form.checkboxes;

      //update permissions
      await User.update({}, { $set: { isAdmin: false } }, { multi: true });

      const query = admins.map((id: any) => {
        return { slackID: id };
      });

      await User.update(
        { $or: query },
        { $set: { isAdmin: true } },
        { multi: true }
      );
      submitted = false;
    } else {
      setCancelled(true);
    }
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
