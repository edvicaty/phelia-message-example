import React from "react";

import { Actions, Button, Modal, PheliaModalProps } from "phelia";

export function RegistrationModal({ props }: PheliaModalProps) {
  return (
    <Modal title={`Register ClickUp account`} submit="cancel">
      <Actions>
        <Button
          url="https://app.clickup.com/api?client_id=RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V&redirect_uri=https://phelia-test-slack.herokuapp.com/auth"
          action="openURLAuth"
          onClick={() => {}}>
          {`Bind ClickUp account ${props.name}`}
        </Button>
      </Actions>
    </Modal>
  );
}
