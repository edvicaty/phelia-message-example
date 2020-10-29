// //-------------------------------- PENDING USER INTERFACE TO LIST AND MODIFY ALL CURRENT ADMINS ------------------------------

// import React from "react";
// import User from "./models/User";
// import axios from "axios";

// import {
//   Button,
//   Divider,
//   Input,
//   Message,
//   Modal,
//   MultiSelectMenu,
//   PheliaMessageProps,
//   Section,
//   Text,
//   DatePicker,
//   Actions,
// } from "phelia";

// //-------------------------------- Modal ------------------------------

// export function setAdminModal() {
//   return (
//     <Modal title="Users multi select menu" submit="Submit">
//       <Input label="Select menu">
//         <MultiSelectMenu
//           type="users"
//           action="selection"
//           placeholder="A placeholder"
//         />
//       </Input>
//     </Modal>
//   );
// }

// //-------------------------------- Message API fetch----------------------

// export function setAdmin({ useModal, useState }: PheliaMessageProps) {
//   const [tasks, setTasks] = useState<Array<string>>("tasks");
//   const [showForm, setShowForm] = useState("showForm", false);

//   let form = null;
//   let user: any = null;
//   let userToken: string = null;

//   const openModal = useModal("modal", setAdminModal, async (event) => {
//     user = event.user;
//     form = event.form;
//     const slackID = user.id;
//     const currentUser = await User.findOne({ slackID });
//     userToken = currentUser.clickUpToken;

//     const query = form.selection.map((id: any) => {
//       return { slackID: id };
//     });

//     const usersArr = await User.find({ $or: query });
//     const usersString = usersArr.map((user) => user.clickUpID).toString();

//     const fetchedTasks = await getFilteredTasks(usersString);
//     setShowForm(true);
//     setTasks(fetchedTasks.tasks);
//   });

//   //retrieving modal data functions
//   async function getFilteredTasks(users: string) {
//     const teamID = 8509000; //worskpace ID
//     const page = 0;
//     const oneDay = 86400000;
//     const utcToCentral = 21600000;
//     const dateLt = utcToCentral + oneDay;

//     const url = `https://api.clickup.com/api/v2/team/${teamID}/task?page=${page}&date_updated_gt=${utcToCentral}&date_updated_lt=${dateLt}&assignees[]=${users}`;

//     // console.log(`url -------------`, url);

//     const tasks = await axios.get(`${url}`, {
//       headers: { Authorization: `${userToken}` },
//     });
//     return tasks.data;
//   }

//   return (
//     <Message text="Get tasks">
//       <Section
//         accessory={
//           <Button
//             action="open-modal"
//             onClick={() => {
//               openModal();
//             }}>
//             Get tasks
//           </Button>
//         }>
//         <Text>Get tasks</Text>
//       </Section>

//       {showForm && tasks && (
//         <Section
//           accessory={
//             <Button
//               action="tasks"
//               onClick={() => {
//                 console.log(tasks);
//               }}>
//               log tasks
//             </Button>
//           }>
//           {tasks.map((task: any) => (
//             <Text type="mrkdwn">
//               * *Task:* {task.name}
//               {`\n`} {``}* *Description:* {``}
//               {task.description}
//               {`\n`} {``}* *Assignees:* {``}
//               {task.assignees.map((assignee: any) => `${assignee.username}, `)}
//               {`\n`}* *Status:* {``}```
//               {task.status.type}``` ----------
//             </Text>
//           ))}
//         </Section>
//       )}
//     </Message>
//   );
// }
