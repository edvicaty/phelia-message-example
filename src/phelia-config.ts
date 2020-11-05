import Phelia from "phelia";
import { CreateTask, CreateTaskModal } from "./components/create-task-modal";
import { GetTasks, GetTasksByTimeModal } from "./components/get-tasks-modal";
import {
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
} from "./components/get-tasks-current-user-modal";
import { AdminPanel, AdminPanelModal } from "./components/admin-panel-modal";
import { TextMessage } from "./components/text-message";
import { RegistrationModal } from "./components/registration-modal";

const client = new Phelia(process.env.SLACK_TOKEN);

client.registerComponents([
  TextMessage,
  AdminPanel,
  AdminPanelModal,
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
  GetTasksByTimeModal,
  GetTasks,
  CreateTaskModal,
  CreateTask,
  RegistrationModal,
]);

export default client;
