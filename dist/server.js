"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const events_api_1 = require("@slack/events-api");
const phelia_1 = __importDefault(require("phelia"));
const example_messages_1 = require("./example-messages");
dotenv_1.default.config();
const app = express_1.default();
const port = 3000;
const client = new phelia_1.default(process.env.SLACK_TOKEN);
client.registerComponents([
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
slackEvents.on("app_home_opened", client.appHomeHandler(example_messages_1.HomeApp));
app.use("/events", slackEvents.requestListener());
// (async () => {
//   const key = await client.postMessage(ModalExample, "@max", { name: "Max" });
//   await client.updateMessage(key, { name: "me but laters" });
// })();
client.postMessage(example_messages_1.BirthdayPicker, "U01CMED2XF1");
client.postMessage(example_messages_1.ChannelsSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.ChannelsSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.ConversationsSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.ConversationsSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.Counter, "U01CMED2XF1");
client.postMessage(example_messages_1.ExternalSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.ExternalSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.Greeter, "U01CMED2XF1");
client.postMessage(example_messages_1.ModalExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiChannelsSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiChannelsSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiConversationsSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiConversationsSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiExternalSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiExternalSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiStaticSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiStaticSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiUsersSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.MultiUsersSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.MyModal, "U01CMED2XF1");
client.postMessage(example_messages_1.OverflowMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.RadioButtonExample, "U01CMED2XF1");
client.postMessage(example_messages_1.RadioButtonModal, "U01CMED2XF1");
client.postMessage(example_messages_1.RandomImage, "U01CMED2XF1");
client.postMessage(example_messages_1.StaticSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.StaticSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.UsersSelectMenuExample, "U01CMED2XF1");
client.postMessage(example_messages_1.UsersSelectMenuModal, "U01CMED2XF1");
client.postMessage(example_messages_1.HomeApp, "U01CMED2XF1");
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map