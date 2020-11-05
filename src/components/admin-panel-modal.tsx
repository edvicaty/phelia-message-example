import React from "react";

import {
  Button,
  Input,
  Message,
  Modal,
  PheliaMessageProps,
  Section,
  Text,
  Actions,
  Checkboxes,
  Option,
} from "phelia";
import db from "../firestore-config";

let submitted = false;

//-------------------------------- Modal ------------------------------
export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showData, setShowData] = useState("showData", false);
  const [users, setUsers] = useState<Array<string>>("setUsers");

  const fetchUsers = async () => {
    const userRef = await db.collection(`users`);
    const usersArr: any = await userRef.get();

    let users: any = [];
    usersArr.forEach((doc: any) => {
      users.push(doc.data());
    });

    setUsers(users);
  };

  return (
    <Modal title={`Admin Panel`} submit="Update Admin permissions">
      {!showData && (
        <Actions>
          <Button
            action="showData"
            onClick={async () => {
              await fetchUsers();
              await setShowData(true);
              submitted = true;
            }}>
            Show current ADMINS
          </Button>
        </Actions>
      )}

      {showData && users && (
        <>
          <Input label="Current Admins (checkbox enabled):">
            <Checkboxes action="checkboxes">
              {users.map((user: any) => {
                return (
                  <Option
                    value={`${user.slackID}`}
                    selected={user.isAdmin ? true : false}>
                    {user.username}
                  </Option>
                );
              })}
            </Checkboxes>
          </Input>
        </>
      )}
    </Modal>
  );
}

//-------------------------------- Message API fetch----------------------

export function AdminPanel({ useModal, useState }: PheliaMessageProps) {
  const [notAdmin, setNotAdmin] = useState<boolean>("notAdmin", false);

  let form = null;
  let user: any = null;
  let admins: any = null;

  const openModal = useModal("modal", AdminPanelModal, async (event) => {
    if (submitted) {
      user = event.user;
      form = event.form;
      admins = event.form.checkboxes;

      await db
        .collection(`users`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc: any) => {
            doc.ref.update({
              isAdmin: false,
            });
          });
        });

      const usersRef = await db.collection(`users`);

      await usersRef
        .where(`slackID`, "in", admins)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc: any) => {
            doc.ref.update({
              isAdmin: true,
            });
          });
        });

      submitted = false;
    }
  });

  return (
    <Message text="Get tasks">
      <Section
        accessory={
          <Button
            action="open-modal"
            onClick={async (e) => {
              submitted = false;
              const user = await db
                .collection(`users`)
                .doc(`${e.user.id}`)
                .get();

              if (user.exists && user.data().isAdmin) {
                setNotAdmin(false);
                openModal();
              } else {
                setNotAdmin(true);
              }
            }}>
            Open Admin Panel
          </Button>
        }>
        <Text>Opens the ADMIN panel. Click the button to begin</Text>
      </Section>

      {notAdmin && (
        <Section>
          <Text type="mrkdwn">
            ```NOT ADMIN```
            {`\n`} {``} *use ```/setAdmin {` [token] `}``` to set yourself as an
            ADMIN. {``}
          </Text>
        </Section>
      )}
    </Message>
  );
}
