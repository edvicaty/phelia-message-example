// import { Actions, Button, Home, PheliaHomeProps, Section, Text } from "phelia";
// import React from "react";
// import { MyModal } from "./modal-example";
// export function HomeApp({ useState, useModal }: PheliaHomeProps) {
//   const [counter, setCounter] = useState("counter", 0);
//   const [notifications, setNotifications] = useState("notifications", []);
//   const [form, setForm] = useState("form");
//   const [user, setUser] = useState("user");
//   const openModal = useModal("modal", MyModal, (event) =>
//     setForm(JSON.stringify(event.form, null, 2))
//   );

//   return (
//     <Home
//       onLoad={async (event) => {
//         // const notifications = await fetchNotifications(event.user);
//         // setNotifications(notifications);
//         await setUser(event.user);
//       }}>
//       <Section>
//         <Text emoji>Hey there {user?.username} :wave:</Text>
//         <Text type="mrkdwn">*Counter:* {counter}</Text>
//         <Text type="mrkdwn">*Notifications:* {notifications.length}</Text>
//       </Section>

//       <Actions>
//         <Button
//           action="counter"
//           onClick={async (e) => {
//             console.log(`event from -------------`, e);
//             await setUser(e.user);
//             setCounter(counter + 1);
//           }}>
//           Click me
//         </Button>

//         <Button action="modal" onClick={() => openModal()}>
//           Open a Modal
//         </Button>
//       </Actions>

//       {form && (
//         <Section>
//           <Text type="mrkdwn">{"```\n" + form + "\n```"}</Text>
//         </Section>
//       )}
//     </Home>
//   );
// }

import React from "react";
import {
  Actions,
  Button,
  Message,
  MultiSelectMenu,
  PheliaMessageProps,
  Section,
  Text,
  DatePicker,
  Divider,
  Home,
  PheliaHomeProps,
} from "phelia";

// import { findUserBySlackId } from "../utils/fetch"
// import { getClickUpTimeEntries } from "../utils/clickUp"

// function getDefaultDate() {
//   const date = new Date(new Date().setDate(new Date().getDate() - 1))
//   const d = new Date(date)
//   return new Date(d.getTime() - 480 * 60 * 1000).toISOString().split("T")[0]
// }

export function HomeApp({ useState, useModal, user }: PheliaHomeProps) {
  console.log(`useeeeer`, user);
  return (
    <Home
      onLoad={(e) => {
        console.log(`eveeent`, e);
      }}>
      <Section>
        <Text type="mrkdwn">Hello</Text>
      </Section>
    </Home>
  );
}
