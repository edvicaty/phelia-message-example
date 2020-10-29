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
} from "phelia";
import { ConversationsSelectMenuModal } from "./example-messages";

//-------------------------------- Modal ------------------------------
//TODO: setup modal logic
export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showData, setShowData] = useState("showData", false);
  return (
    <Modal title={`A fancy pants modal`} submit="cancel">
      {!showData && (
        <Actions>
          <Button
            // url="https://app.clickup.com/api?client_id=RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V&redirect_uri=https://phelia-test-slack.herokuapp.com/auth"
            action="showData"
            onClick={() => {
              // console.log(`event ------`, e);
              // console.log(`props from click event ------`, props);
              setShowData(true);
            }}>
            {`show form `}
          </Button>
        </Actions>
      )}

      {showData && (
        <>
          <Actions>
            <Input label="Some checkboxes">
              <Checkboxes action="checkboxes">
                <Option value="option-a">option a</Option>

                <Option value="option-b" selected>
                  option b
                </Option>

                <Option value="option-c">option c</Option>
              </Checkboxes>
            </Input>
          </Actions>
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
