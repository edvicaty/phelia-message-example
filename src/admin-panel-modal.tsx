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
} from "phelia";

//-------------------------------- Modal ------------------------------

export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showForm, setShowForm] = useState("showForm", false);
  return (
    <Modal title={`A fancy pants modal`} submit="cancel">
      {!showForm && (
        <Actions>
          <Button
            // url="https://app.clickup.com/api?client_id=RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V&redirect_uri=https://phelia-test-slack.herokuapp.com/auth"
            action="showForm"
            onClick={() => {
              // console.log(`event ------`, e);
              // console.log(`props from click event ------`, props);
              setShowForm(true);
            }}>
            {`show form `}
          </Button>
        </Actions>
      )}

      {showForm && (
        <>
          <Actions>
            <Button
              // url="https://app.clickup.com/api?client_id=RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V&redirect_uri=https://phelia-test-slack.herokuapp.com/auth"
              action="showForm"
              onClick={() => {
                // console.log(`event ------`, e);
                // console.log(`props from click event ------`, props);
                setShowForm(true);
              }}>
              {`show form `}
            </Button>
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
