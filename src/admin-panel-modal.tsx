import React from "react";
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
  Checkboxes,
  Option,
  TextField,
} from "phelia";
import db from "./firestore-config";

let submitted = false;

//-------------------------------- Modal ------------------------------
export function AdminPanelModal({ useState }: PheliaMessageProps) {
  const [showData, setShowData] = useState("showData", false);
  const [users, setUsers] = useState<Array<string>>("setUsers");

  //fetch Users from DB
  const fetchUsers = async () => {
    const userRef = await db.collection(`users`);
    const usersArr: any = await userRef.get();

    let users: any = [];
    usersArr.forEach((doc: any) => {
      users.push(doc.data());
    });

    console.log(`usersArr-----`, usersArr, `users`, users);

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
  const [cancelled, setCancelled] = useState<boolean>("cancelled", false);
  const [notAdmin, setNotAdmin] = useState<boolean>("notAdmin", false);

  let form = null;
  let user: any = null;
  // let userToken: string = null;
  let admins: any = null;

  const openModal = useModal("modal", AdminPanelModal, async (event) => {
    if (submitted) {
      user = event.user;
      form = event.form;
      admins = event.form.checkboxes; //array with IDs of all admins

      // 1. set all users to non-admin status
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

      // 2. set users on admins as admins
      const usersRef = await db.collection(`users`);

      // console.log(`usersRef --------`, usersRef);

      const usersArr = await usersRef
        .where(`slackID`, "in", admins)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc: any) => {
            doc.ref.update({
              isAdmin: true,
            });
          });
        });

      // console.log(`usersArr --------`, usersArr);

      submitted = false;
    } else {
      setCancelled(true);
    }
  });

  //retrieving modal data functions

  return (
    <Message text="Get tasks">
      <Section
        accessory={
          <Button
            action="open-modal"
            onClick={async (e) => {
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
            Open Panel
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
            {`\n`} {``} Then, reload this component {``}
          </Text>
        </Section>
      )}
    </Message>
  );
}
