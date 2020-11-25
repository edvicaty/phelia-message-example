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
  //   let user: any = null
  //   const [user, setUser] = useState("user")

  //   const user = JSON.parse(JSON.stringify(props["user"]))

  //   async function setUser(slackId: string) {
  //     user = await findUserBySlackId(slackId)
  //   }

  //   const [startDate, setStartDate] = useState<string>("startDate", getDefaultDate())
  //   const [users, setUsers] = useState<string[]>("users", [user?.services?.slack?.id])
  //   const [isAdmin] = useState<Boolean>("isAdmin", user?.services?.clickUp?.isAdmin)
  //   const [timeEntries, setTimeEntries] = useState<Array<any>>("timeEntries", null)
  //   const searchTasks = async () => {
  //     const clickUpToken = user.services.clickUp.token
  //     const assignees = await Promise.all(
  //       users.map(async (slackId: any) => {
  //         const assignee = await findUserBySlackId(slackId)
  //         return assignee.services.clickUp.id
  //       })
  //     )
  //     const timeEntries = await getClickUpTimeEntries(
  //       assignees.join(),
  //       startDate,
  //       clickUpToken
  //     )

  //     setTimeEntries(timeEntries?.length > 0 ? timeEntries : [])
  //   }

  //   let assigned: any = null
  //   let assignedMarkup: any = null
  return (
    <Home>
      <Message text="Search Time Entries">
        <Section>
          <Text type="mrkdwn">Hello</Text>
        </Section>
        {/* <>
            <Section
              text={`Select a day`}
              accessory={
                <DatePicker
                  action='date'
                  onSelect={(event) => {
                    setStartDate(event.date)
                  }}
                  initialDate={startDate}
                />
              }
            />
            {isAdmin && (
              <Section
                text='Select Users'
                accessory={
                  <MultiSelectMenu
                    type='users'
                    action='select'
                    placeholder='Select users'
                    initialUsers={users}
                    onSelect={(event) => setUsers(event.selected)}
                  />
                }
              />
            )}
          </>
          {users && startDate && (
            <Actions>
              <Button
                style='danger'
                action='openModal'
                onClick={async () => searchTasks()}
              >
                Search Tasks
              </Button>
            </Actions>
          )} */}
      </Message>

      {/* {timeEntries && (
          <Message text='List Time Entries'>
            {timeEntries.map((timeEntry: any) => {
              assignedMarkup = null
              if (assigned != timeEntry.user.id) {
                assigned = timeEntry.user.id
                assignedMarkup = (
                  <>
                    <Divider />
                    <Section>
                      <Text type='mrkdwn'>*{timeEntry.user.username}*</Text>
                    </Section>
                  </>
                )
              }
              let description = null
              if (timeEntry?.description) {
                description = (
                  <Section>
                    <Text type='mrkdwn'>{`> ${timeEntry.description} `}</Text>
                  </Section>
                )
              }

              return (
                <>
                  {assignedMarkup}
                  <Divider />
                  <Section>
                    <Text type='mrkdwn'>
                      *Task:* ({timeEntry.task.id}) {timeEntry.task.name}
                    </Text>
                  </Section>
                  {description}
                  <Section>
                    <Text type='mrkdwn'>
                      *Duration:* {timeEntry.duration / 60000} minutes.
                    </Text>
                    <Text type='mrkdwn'>
                      *Status:* `{timeEntry.task.status.type}`
                    </Text>
                  </Section>
                </>
              )
            })} */}
      {/* </Message> */}
      {/* )} */}
    </Home>
  );
}
