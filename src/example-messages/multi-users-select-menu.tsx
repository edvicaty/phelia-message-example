import React from "react";

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

//returns the slack ID's of the selected users
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
  // const [form, setForm] = useState("form");
  // const [selected, setSelected] = useState("selected");

  let form = null;
  let user = null;

  const openModal = useModal("modal", MultiUsersSelectMenuModal, (event) => {
    user = event.user;
    form = event.form;

    console.log(`form ------------------`, user, form);
  });

  return (
    <Message text="Get tasks">
      {/* {selected && (
        <Section>
          <Text type="mrkdwn">*Selected:* {selected}</Text>
        </Section>
      )}

      {!selected && (
        <Section
          text="A Multi-Select Menu in a Section component"
          accessory={
            <MultiSelectMenu
              type="users"
              action="select"
              placeholder="A placeholder"
              onSelect={(event) => setSelected(event.selected.join(", "))}
            />
          }
        />
      )} */}

      {/* <Divider /> */}

      <Section
        text="Open get tasks modal"
        accessory={
          <Button action="open-modal" onClick={() => openModal()}>
            Open modal
          </Button>
        }
      />

      {/* {form && (
        <Section text="Modal submission:">
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )} */}
    </Message>
  );
}
