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

export function CreateTaskFormModal({ useState, props }: PheliaModalProps) {
  const [showForm, setShowForm] = useState("showForm", false);
  return (
    <Modal title={`test modal for creating tasks`} submit="submit">
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
            {`show form ${props?.name}`}
          </Button>
        </Actions>
      )}

      {showForm && (
        <>
          <Input label="Expiration date">
            <DatePicker action="date" />
          </Input>
          <Input label="Little bit">
            <TextField action="little-bit" placeholder="just a little bit" />
          </Input>
          <Input label="Some checkboxes">
            <Checkboxes action="checkboxes">
              <Option value="option-a">option a</Option>

              <Option value="option-b" selected>
                option b
              </Option>

              <Option value="option-c">option c</Option>
            </Checkboxes>
          </Input>
          <Input label="Summary">
            <TextField
              action="summary"
              placeholder="type something here"
              multiline
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

export function CreateFileModal({
  useModal,
  useState,
  props,
}: PheliaMessageProps<Props>) {
  const [state, setState] = useState<State>("state", "init");
  const [form, setForm] = useState("form", "");

  const openModal = useModal(
    "modal",
    CreateTaskFormModal,
    (form) => {
      console.log(`form ------------------`, form);
      setState("submitted");
      setForm(JSON.stringify(form, null, 2));
    },
    () => setState("canceled")
  );

  return (
    <Modal title={`A fancy pants modal`} submit="cancel">
      <Section>
        <Text type="mrkdwn">hey {props?.name}!</Text>
      </Section>

      {state === "canceled" && (
        <Section>
          <Text emoji>:no_good: why'd you have to do that</Text>
        </Section>
      )}

      {state === "submitted" && (
        <Section>
          <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
        </Section>
      )}

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
            onClick={() => openModal()}>
            Open the modal
          </Button>
        </Actions>
      )}
    </Modal>
  );
}
