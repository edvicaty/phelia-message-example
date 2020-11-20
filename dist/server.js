"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const events_api_1 = require("@slack/events-api");
const body_parser_1 = __importDefault(require("body-parser"));
const phelia_1 = __importDefault(require("phelia"));
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const example_messages_1 = require("./example-messages");
const registration_modal_1 = require("./registration-modal");
const create_task_modal_1 = require("./create-task-modal");
const get_tasks_modal_1 = require("./get-tasks-modal");
const text_message_1 = require("./text-message");
const get_tasks_current_user_modal_1 = require("./get-tasks-current-user-modal");
const admin_panel_modal_1 = require("./admin-panel-modal");
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT || 80;
const client = new phelia_1.default(process.env.SLACK_TOKEN);
client.registerComponents([
    text_message_1.TextMessage,
    admin_panel_modal_1.AdminPanel,
    admin_panel_modal_1.AdminPanelModal,
    get_tasks_current_user_modal_1.GetTasksCurrentUser,
    get_tasks_current_user_modal_1.GetTasksCurrentUserModal,
    get_tasks_modal_1.GetTasksByTimeModal,
    get_tasks_modal_1.GetTasks,
    create_task_modal_1.CreateTaskModal,
    create_task_modal_1.CreateTask,
    registration_modal_1.RegistrationModal,
    example_messages_1.BirthdayPicker,
    example_messages_1.Counter,
    example_messages_1.Greeter,
    example_messages_1.ModalExample,
    example_messages_1.MyModal,
    example_messages_1.RandomImage,
    example_messages_1.OverflowMenuExample,
    example_messages_1.RadioButtonModal,
    example_messages_1.RadioButtonExample,
    example_messages_1.StaticSelectMenuExample,
    example_messages_1.StaticSelectMenuModal,
    example_messages_1.UsersSelectMenuExample,
    example_messages_1.UsersSelectMenuModal,
    example_messages_1.ConversationsSelectMenuExample,
    example_messages_1.ConversationsSelectMenuModal,
    example_messages_1.ChannelsSelectMenuModal,
    example_messages_1.ChannelsSelectMenuExample,
    example_messages_1.ExternalSelectMenuExample,
    example_messages_1.ExternalSelectMenuModal,
    example_messages_1.MultiStaticSelectMenuExample,
    example_messages_1.MultiStaticSelectMenuModal,
    example_messages_1.MultiExternalSelectMenuExample,
    example_messages_1.MultiExternalSelectMenuModal,
    example_messages_1.MultiUsersSelectMenuExample,
    example_messages_1.MultiUsersSelectMenuModal,
    example_messages_1.MultiChannelsSelectMenuExample,
    example_messages_1.MultiChannelsSelectMenuModal,
    example_messages_1.MultiConversationsSelectMenuExample,
    example_messages_1.MultiConversationsSelectMenuModal,
]);
// Register the interaction webhook
app.post("/interactions", client.messageHandler(process.env.SLACK_SIGNING_SECRET));
// Register your Home App
const slackEvents = events_api_1.createEventAdapter(process.env.SLACK_SIGNING_SECRET);
app.use("/events", slackEvents.requestListener());
//loading body parser before phelia components will crash the app
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//--------------------------------------------------------- config & imports END ----------------------------------------------------------------------------------
//----------------------------------------------                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ----------- mongoDB START ----------------------------------------------------------------------------------
mongoose_1.default
    .connect(process.env.DB, { useNewUrlParser: true })
    .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
})
    .catch((err) => {
    console.error("Error connecting to mongo", err);
});
//--------------------------------------------------------- mongoDB END ------------------------------------------------------------------------------------
//--------------------------------------------------------- routes START ----------------------------------------------------------------------------------
//get tasks admin
app.post("/get-tasks-admin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.sendStatus(200);
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, } = yield req.body;
        const user = yield User_1.default.findOne({ slackID: user_id });
        if (user.isAdmin) {
            client.postMessage(get_tasks_modal_1.GetTasks, `${user_id}`);
        }
        else {
            const message = `You need to have ADMIN status to be able to check the tasks of all users. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
            client.postMessage(text_message_1.TextMessage, `${user_id}`, { message });
        }
    });
});
//get tasks current user
app.post("/get-tasks-user", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.sendStatus(200);
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, } = yield req.body;
        client.postMessage(get_tasks_current_user_modal_1.GetTasksCurrentUser, `${user_id}`);
    });
});
//--------------------------------------------------------- routes END ----------------------------------------------------------------------------------
//--------------------------------------------------------- AUTH START ----------------------------------------------------------------------------------
//AUTH functions START ------------------------------------
const baseURL = "https://phelia-test-slack.herokuapp.com/";
const userService = axios_1.default.create({
    baseURL,
    withCredentials: false,
});
function auth(clientID, clientSecret, authCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield userService.post(`https://api.clickup.com/api/v2/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authCode}`);
        return accessToken;
    });
}
function getUser(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userService.get(`https://api.clickup.com/api/v2/user`, {
            headers: { Authorization: `${token}` },
        });
        return user;
    });
}
//AUTH functions END --------------------------------------
let slackUserIDToRegister = null;
//slash command POST route => set from slack web app /register command
app.post("/redirect", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.sendStatus(200);
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, } = yield req.body;
        slackUserIDToRegister = user_id;
        const user = yield User_1.default.findOne({ slackID: user_id });
        if (!user) {
            User_1.default.create({
                username: user_name,
                slackID: user_id,
                clickUpToken: "",
                clickUpID: "",
                isAdmin: false,
            });
        }
        yield client.openModal(registration_modal_1.RegistrationModal, trigger_id, { name: user_name });
    });
});
//auth to bind ClickUp's API token to DB.
app.get("/auth", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authCode = yield req.query.code;
        const accessToken = yield auth(process.env.CLICKUP_ID, process.env.CLICKUP_SECRET, authCode);
        const user = yield getUser(accessToken.data.access_token);
        yield User_1.default.findOneAndUpdate({ slackID: slackUserIDToRegister }, {
            clickUpToken: accessToken.data.access_token,
            clickUpID: user.data.user.id,
        });
        slackUserIDToRegister = null;
        res.redirect("/registration");
    });
});
//feedback route
app.get("/registration", function (req, res) {
    res.send("Registration completed");
});
//set current slack user as admin route (/setAdmin)
app.post("/setadmin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.sendStatus(200);
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, text, } = yield req.body;
        let message = null;
        if (text === process.env.SLACK_ADMIN_TOKEN) {
            yield User_1.default.findOneAndUpdate({ slackID: user_id }, { isAdmin: true });
            message = `${user_name} is now admin`;
            client.postMessage(text_message_1.TextMessage, `${user_id}`, { message });
        }
        else {
            message = "Wrong token";
            client.postMessage(text_message_1.TextMessage, `${user_id}`, { message });
        }
    });
});
//admin panel to list and modify slack admins (/admin-panel)
app.post("/admin-panel", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.sendStatus(200);
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, text, } = yield req.body;
        const user = yield User_1.default.findOne({ slackID: user_id });
        if (user.isAdmin) {
            client.postMessage(admin_panel_modal_1.AdminPanel, `${user_id}`);
        }
        else {
            const message = `You need to have ADMIN status to be able to use this command. Try /setAdmin [token] to set yourself as an ADMIN. \n If you want to check your own tasks try /get-my-tasks command`;
            client.postMessage(text_message_1.TextMessage, `${user_id}`, { message });
        }
    });
});
//--------------------------------------------------------- AUTH END ----------------------------------------------------------------------------------
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map