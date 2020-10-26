import React from "react";

import { Actions, Button, Modal, PheliaModalProps } from "phelia";

export function RegistrationModal({ useState, props }: PheliaModalProps) {
  //   const [showForm, setShowForm] = useState("showForm", false);
  return (
    <Modal title={`A fancy pants modal`} submit="cancel">
      <Actions>
        <Button
          url="https://app.clickup.com/api?client_id=RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V&redirect_uri=https://phelia-test-slack.herokuapp.com/auth"
          action="showForm"
          onClick={() => {}}>
          {`Bind ClickUp account ${props.name}`}
        </Button>
      </Actions>
    </Modal>
  );
}
