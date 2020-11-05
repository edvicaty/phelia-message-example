import React from "react";

import {
  Actions,
  Button,
  Input,
  Message,
  Modal,
  PheliaMessageProps,
  Section,
  Text,
  TextField,
  PheliaModalProps,
} from "phelia";
import axios from "axios";
import db from "../firestore-config";

const baseURL = "https://phelia-test-slack.herokuapp.com/";
const createTaskService = axios.create({
  baseURL,
});

//-----------------------------------MODAL COMPONENT------------------------------

export function CreateTaskModal({ useState }: PheliaModalProps) {
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
            {`show form`}
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

//-----------------------------------TEXT COMPONENT------------------------------

export function CreateTask({
  useModal,
  useState,
  props,
}: PheliaMessageProps<Props>) {
  const [state, setState] = useState<State>("state", "init");

  let token: string = null;
  let form = null;
  let user = null;

  //modal and form main function
  const openModal = useModal(
    "modal",
    CreateTaskModal,
    async (event) => {
      await setClickUpToken(event.user.id);
      setState("submitted");
      form = event.form;
      user = event.user;
      await createTask(form);
    },
    () => setState("canceled")
  );

  //fetch clickUP token from DB
  async function setClickUpToken(slackID: any) {
    const userRef = await db.collection(`users`).doc(`${slackID}`);

    const user = await userRef.get();

    token = user.data().clickUpToken;
  }

  //clickUP API POST function
  async function createTask(form: any) {
    const listID = `46365851`;
    await createTaskService.post(
      `https://api.clickup.com/api/v2/list/${listID}/task/`,
      form,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
  }

  return (
    <Message text="Create task example">
      <Section>
        <Text type="mrkdwn">
          Create a new task. Click the button to continue
        </Text>
      </Section>

      {state === "canceled" && (
        <Section>
          <Text>Create new task cancelled</Text>
        </Section>
      )}

      {state !== "init" && (
        <Actions>
          <Button
            style="danger"
            action="reset"
            onClick={() => setState("init")}>
            Task Created!
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
            Create New Task
          </Button>
        </Actions>
      )}
    </Message>
  );
}
