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
  return (
    <Modal title={`Admin Panel`} submit="submit">
      {!showData && (
        <Actions>
          <Button
            action="showData"
            onClick={() => {
              setShowData(true);
            }}>
            Show current ADMINS
          </Button>
        </Actions>
      )}

      {showData && (
        <>
          <Input label="Some checkboxes">
            <Checkboxes action="checkboxes">
              <Option value="option-a">option a</Option>

              <Option value="option-b" selected>
                option b
              </Option>

              <Option value="option-c">option c</Option>
            </Checkboxes>
          </Input>
          <Input label="Select menu">
            <MultiSelectMenu
              onSelect={async (event) => {
                console.log(`event --------------`, event);
              }}
              type="users"
              action="selection"
              placeholder="A placeholder"
            />
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
