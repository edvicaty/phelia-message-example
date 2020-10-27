import React from "react";

import {
  Actions,
  Button,
  Checkboxes,
  DatePicker,
  Input,
  Message,
  Modal,
  Option,
  PheliaMessageProps,
  Section,
  Text,
  TextField,
  PheliaModalProps,
} from "phelia";
import axios from "axios";
import User from "./models/User";

const baseURL = "https://phelia-test-slack.herokuapp.com/";
const createTaskService = axios.create({
  baseURL,
});

export function CreateTaskModal({ useState, props }: PheliaModalProps) {
  const [showForm, setShowForm] = useState("showForm", false);
  return (
    <Modal title={`Create new task`} submit="submit">
      {!showForm && (
        <Actions>
          <Button
            action="showForm"
            onClick={() => {
              setShowForm(true);
            }}>
            {`show form ${props?.name}`}
          </Button>
        </Actions>
      )}

      {showForm && (
        <>
          <Input label="Task name">
            <TextField action="name" placeholder="Write the task's name" />
          </Input>
          <Input label="Task description">
            <TextField
              action="description"
              placeholder="Write the task's description"
            />
          </Input>
        </>
      )}
    </Modal>
  );
}

type State = "submitted" | "canceled" | "init";

type Props = {
  name: string;
};

export function CreateTask({
  useModal,
  useState,
  props,
}: PheliaMessageProps<Props>) {
  const [state, setState] = useState<State>("state", "init");
  const [form, setForm] = useState("form", "");
  const [token, setToken] = useState("token");

  const openModal = useModal(
    "modal",
    CreateTaskModal,
    async (event) => {
      // console.log(`form ------------------`, event);
      await setClickUpToken(event.user.id);
      setState("submitted");
      setForm(JSON.stringify(event, null, 2));
      console.log(`token -----------`, token);
      console.log(`form ----------`, form);
    },
    () => setState("canceled")
  );
  //fetch clickUP token from DB
  async function setClickUpToken(slackID: any) {
    const user = await User.findOne({ slackID });
    setToken(user.clickUpToken);
  }
  //TODO me quede aqui

  //clickUP API function
  // async function createTask(form: any) {
  //   const listID = `46365851`;
  //   await createTaskService.post(
  //     `https://api.clickup.com/api/v2/list/${listID}/task/`,
  //     form,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `${props.clickUpToken}`,
  //       },
  //     }
  //   );
  // }

  return (
    <Message text="Create task example">
      <Section>
        <Text type="mrkdwn">hey {props?.name}!</Text>
      </Section>

      {state === "canceled" && (
        <Section>
          <Text>Create new task cancelled</Text>
        </Section>
      )}

      {/* {state === "submitted" && (
        <Section>
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )} */}

      {state !== "init" && (
        <Actions>
          <Button
            style="danger"
            action="reset"
            onClick={() => setState("init")}>
            reset
          </Button>
        </Actions>
      )}

      {state === "init" && (
        <Actions>
          <Button
            style="primary"
            action="openModal"
            onClick={async () => {
              openModal();
            }}>
            Open the modal
          </Button>
        </Actions>
      )}
    </Message>
  );
}