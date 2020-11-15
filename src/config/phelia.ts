import Phelia from "phelia"

import { GetTasks, GetTasksByTimeModal } from "../components/GetTasks"
import {
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
} from "../components/GetTasksCurrentUser"
import { TextMessage } from "../components/TextMessage"
import { RegistrationModal } from "../components/Registration"

const client = new Phelia(process.env.SLACK_TOKEN)

client.registerComponents([
  TextMessage,
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
  GetTasksByTimeModal,
  GetTasks,
  RegistrationModal,
])

export default client
