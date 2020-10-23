import { Actions, Button, Home, PheliaHomeProps, Section, Text } from "phelia";
import React from "react";
import { MyModal } from "./modal-example";
export function HomeApp({ useState, useModal }: PheliaHomeProps) {
  const [counter, setCounter] = useState("counter", 0);
  const [notifications, setNotifications] = useState("notifications", []);
  const [form, setForm] = useState("form");
  const [user, setUser] = useState("user");

  useModal("modal", MyModal, (event) =>
    setForm(JSON.stringify(event.form, null, 2))
  );

  return <></>;
}

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
