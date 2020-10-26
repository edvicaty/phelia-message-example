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

export function CreateFileModal({ useState, props }: PheliaModalProps) {
  const [showForm, setShowForm] = useState("showForm", false);
  return (
    <Modal title={`Register a new Component`} submit="submit">
      {!showForm && (
        <Actions>
          <Button
            action="showForm"
            onClick={(e) => {
              console.log(`event from click ------`, e);
              setShowForm(true);
            }}>
            {`Bind ClickUp account  ${props.name}`}
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
