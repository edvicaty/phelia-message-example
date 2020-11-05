import Phelia from "phelia";
import { CreateTask, CreateTaskModal } from "./create-task-modal";
import { GetTasks, GetTasksByTimeModal } from "./get-tasks-modal";
import {
  GetTasksCurrentUser,
  GetTasksCurrentUserModal,
} from "./get-tasks-current-user-modal";
import { AdminPanel, AdminPanelModal } from "./admin-panel-modal";
import { TextMessage } from "./text-message";
import { RegistrationModal } from "./registration-modal";

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
