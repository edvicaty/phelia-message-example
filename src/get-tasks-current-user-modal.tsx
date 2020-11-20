import React from "react";
import User from "./models/User";
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
  OptionGroup,
  Option,
  Context,
  ImageBlock,
  Image,
  RadioButtons,
  OverflowMenu,
} from "phelia";

let updatedDate: any = null;

export function GetTasksCurrentUserModal({
  useModal,
  useState,
}: PheliaMessageProps) {
  const [tasks, setTasks] = useState<Array<string>>("tasks");
  const [showForm, setShowForm] = useState("showForm", false);

  let user: any = null;
  let userToken: string = null;

  async function getFilteredTasks(users: string) {
    const teamID = 8509000; //worskpace ID
    const page = 0;
    const oneDay = 86400000;
    const utcToCentral = updatedDate + 21600000;
    const dateLt = utcToCentral + oneDay;

    const url = `https://api.clickup.com/api/v2/team/${teamID}/task?page=${page}&date_updated_gt=${utcToCentral}&date_updated_lt=${dateLt}&assignees[]=${users}`;

    // console.log(`url -------------`, url);

    const tasks = await axios.get(`${url}`, {
      headers: { Authorization: `${userToken}` },
    });
    return tasks.data;
  }

  // const openModal = useModal("modal2", testModal);
  return (
    <Modal title="Users multi select menu" submit="Submit">
      <Section
        text={`Select a day`}
        accessory={
          <DatePicker
            onSelect={async ({ user, date }) => {
              console.log(`date from select--------`, date);
              updatedDate = await Number(new Date(date).getTime());

              // const chooseDate = event.form.date;
              // console.log(
              //   `datebef
              // ------`,
              //   date
              // );

              // await setStateFunction(chooseDate);

              // console.log(`date------`, date);
              const slackID = user.id;
              const currentUser = await User.findOne({ slackID });
              userToken = currentUser.clickUpToken;

              const fetchedTasks = await getFilteredTasks(
                currentUser.clickUpID
              );
              // console.log(`tasks---`, JSON.stringify(fetchedTasks, null, 2));
              setShowForm(true);
              setTasks(fetchedTasks.tasks);
            }}
            action="date"
          />
        }
      />
      <Section
        text={`Open itself`}
        accessory={
          <Button
            action="open-modal2"
            onClick={async () => {
              // openModal();
            }}>
            Misc button
          </Button>
        }
      />
      {showForm && tasks && (
        <>
          {tasks.map((task: any) => (
            <>
              <Divider />
              <Section
                accessory={
                  // <Button
                  //   url={`${task.url}`}
                  //   action="openURL"
                  //   onClick={() => {}}>
                  //   {`See task on ClickUp`}
                  // </Button>
                  // <RadioButtons
                  //   action="radio-buttons"
                  //   onSelect={(event: any) => {
                  //     console.log(event);
                  //     console.log(event.selected);
                  //     // setSelected(event.selected);
                  //   }}>
                  //   <Option value="option-a">option a</Option>
                  //   <Option value="option-b" selected>
                  //     option b
                  //   </Option>
                  //   <Option value="option-c">option c</Option>
                  // </RadioButtons>
                  <OverflowMenu
                    action="overflow"
                    onSelect={(event) => {
                      console.log(event);
                    }}>
                    <Option value="dogs">Dogs</Option>
                    <Option value="cats">Cats</Option>
                    <Option
                      url="https://pixabay.com/images/search/dog/"
                      value="a-link">
                      Dog images
                    </Option>
                  </OverflowMenu>
                }>
                <Text type="mrkdwn">
                  -{`  `} *Task:* {`\n`} {task.name}
                  {`\n`} -{`  `} *Description:* {``}
                  {`\n`}
                  {task.description}
                  {`\n`} -{`  `}*Assignee:* {``}
                  {`\n`}
                  {task.assignees.map(
                    (assignee: any) => `${assignee.username}, `
                  )}
                  {`\n`}- *Status:* {``}```
                  {task.status.type}```
                  {`\n`} -{`  `} *URL:* {``}
                  {task.url}
                </Text>
              </Section>
            </>
          ))}
        </>
      )}
    </Modal>
  );
}

//-------------------------------- Message API fetch----------------------

export function GetTasksCurrentUser({
  useModal,
  useState,
}: PheliaMessageProps) {
  const [tasks, setTasks] = useState<Array<string>>("tasks");
  const [showForm, setShowForm] = useState("showForm", false);
  // const [date, setDate] = useState<string>("setDate", null);

  let form = null;
  let user: any = null;
  let userToken: string = null;

  // async function setStateFunction(chooseDate: any) {
  //   await setDate(String(new Date(chooseDate).getTime()));
  // }
  const openModal = useModal(
    "modal",
    GetTasksCurrentUserModal,
    async (event) => {
      user = event.user;
      form = event.form;
      // const chooseDate = event.form.date;
      // console.log(
      //   `datebef
      // ------`,
      //   date
      // );

      // await setStateFunction(chooseDate);

      // console.log(`date------`, date);
      const slackID = user.id;
      const currentUser = await User.findOne({ slackID });
      userToken = currentUser.clickUpToken;

      const fetchedTasks = await getFilteredTasks(currentUser.clickUpID);
      setShowForm(true);
      setTasks(fetchedTasks.tasks);
    }
  );

  //retrieving modal data functions
  async function getFilteredTasks(users: string) {
    const teamID = 8509000; //worskpace ID
    const page = 0;
    const oneDay = 86400000;
    const utcToCentral = updatedDate + 21600000;
    const dateLt = utcToCentral + oneDay;

    const url = `https://api.clickup.com/api/v2/team/${teamID}/task?page=${page}&date_updated_gt=${utcToCentral}&date_updated_lt=${dateLt}&assignees[]=${users}`;

    // console.log(`url -------------`, url);

    const tasks = await axios.get(`${url}`, {
      headers: { Authorization: `${userToken}` },
    });
    return tasks.data;
  }

  return (
    <Message text="Get tasks">
      <Section
        accessory={
          <Button
            action="open-modal"
            onClick={async () => {
              openModal();
            }}>
            Get tasks
          </Button>
        }>
        <Text>Get tasks from the current user. Click the button to begin</Text>
      </Section>

      {showForm && tasks && (
        <>
          <Section
            accessory={
              <MultiSelectMenu action="selection" placeholder="A placeholder">
                <OptionGroup label="an option group">
                  <Option value="option-a">option a</Option>
                  <Option value="option-b">option b</Option>
                  <Option value="option-c">option c</Option>
                </OptionGroup>

                <OptionGroup label="another option group">
                  <Option value="option-d">option d</Option>
                  <Option value="option-e" selected>
                    option e
                  </Option>
                  <Option value="option-f">option f</Option>
                </OptionGroup>
              </MultiSelectMenu>
            }>
            {tasks.map((task: any) => (
              <Text type="mrkdwn">
                * *Task:* {task.name}
                {`\n`} {``}* *Description:* {``}
                {task.description}
                {`\n`} {``}* *Assignee:* {``}
                {task.assignees.map(
                  (assignee: any) => `${assignee.username}, `
                )}
                {`\n`}* *Status:* {``}```
                {task.status.type}``` ----------
              </Text>
            ))}
          </Section>
          <Context>
            <Image
              imageUrl="https://media-exp1.licdn.com/dms/image/C560BAQF2B0YVN7bLUg/company-logo_200_200/0?e=2159024400&v=beta&t=GZwz-ya2e1Dznp44PmIGZaVjEoWcmXQnecoDhWho8II"
              alt="Octahedroid logo"
            />
          </Context>
        </>
      )}
    </Message>
  );
}
