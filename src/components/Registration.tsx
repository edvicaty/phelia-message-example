import React from "react"
import { Actions, Button, Modal, PheliaModalProps } from "phelia"

export function RegistrationModal({ props }: PheliaModalProps) {
  const client_id = process.env.CLICKUP_ID
  return (
    <Modal title={`Register ClickUp account`} submit='cancel'>
      <Actions>
        <Button
          url={`https://app.clickup.com/api?client_id=${client_id}&redirect_uri=https://pr-13---octavia-z7n4q6chgq-uc.a.run.app/auth`}
          action='openURLAuth'
          onClick={() => {}}
        >
          {`Bind ClickUp account ${props.name}`}
        </Button>
      </Actions>
    </Modal>
  )
}
