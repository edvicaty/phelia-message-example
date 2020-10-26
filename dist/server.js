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
const example_messages_1 = require("./example-messages");
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT || 80;
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
app.use("/events", slackEvents.requestListener());
//post HomeApp component when app is opened
// slackEvents.on("app_home_opened", client.appHomeHandler(HomeApp));
//Here are the documentation's base components to be implemented. For some of them to work, user data will be required (pass user data as props)
// client.postMessage(RandomImage, "U01CMED2XF1"); //main account user ID for edvicaty. User ID or @edvicaty will work. ID recommended
// client.postMessage(RandomImage, "C01D8BH4L2G"); //using channel's ID get from slack API https://api.slack.com/methods/conversations.list/test token is bot oauth token.
// client.postMessage(BirthdayPicker, "#general"); //using channel's name with # prefix will work too
// client.postMessage(RandomImage, "general"); //using channel's name without prefix will work. Not recommended
// client.postMessage(BirthdayPicker, "U01CMED2XF1");
// client.postMessage(ChannelsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ChannelsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(ConversationsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ConversationsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(Counter, "U01CMED2XF1");
// client.postMessage(ExternalSelectMenuExample, "U01CMED2XF1");
// client.postMessage(ExternalSelectMenuModal, "U01CMED2XF1");
// client.postMessage(Greeter, "U01CMED2XF1");
// client.postMessage(ModalExample, "U01CMED2XF1");
// client.postMessage(MultiChannelsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiChannelsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiConversationsSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiConversationsSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiExternalSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiExternalSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiStaticSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiStaticSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MultiUsersSelectMenuExample, "U01CMED2XF1");
// client.postMessage(MultiUsersSelectMenuModal, "U01CMED2XF1");
// client.postMessage(MyModal, "U01CMED2XF1");
// client.postMessage(OverflowMenuExample, "U01CMED2XF1");
// client.postMessage(RadioButtonExample, "U01CMED2XF1");
// client.postMessage(RadioButtonModal, "U01CMED2XF1");
// client.postMessage(RandomImage, "U01CMED2XF1");
// client.postMessage(StaticSelectMenuExample, "U01CMED2XF1");
// client.postMessage(StaticSelectMenuModal, "U01CMED2XF1");
// client.postMessage(UsersSelectMenuExample, "U01CMED2XF1");
// client.postMessage(UsersSelectMenuModal, "U01CMED2XF1");
// client.postMessage(HomeApp, "U01CMED2XF1");
//loading body parser before phelia components will crash the app
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//--------------------------------------------------------- config & imports END ----------------------------------------------------------------------------------
//--------------------------------------------------------- routes START ----------------------------------------------------------------------------------
//On slack app you will define post routes for slash commands, here is te POST route corresponding to /randomImg
app.post("/test", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //A response with status 200 is needed to prevent slack's incomplete message feedback
        yield res.sendStatus(200);
        //The body of the request will contain the following data:
        const { token, team_id, team_domain, user_id, user_name, api_app_id, trigger_id, } = yield req.body;
        // You can post a message to a certain user or channel, te first parameter of the following function is the component to be loaded, the second parameter corresponds to
        // the user or channel in which the message will be posted. You can use ID's (recommended for users) or #channel for channel (e.g. #general)
        // client.postMessage(HomeApp, "U01CMED2XF1");
        //You can also set a modal to be oppened. It's recommended to pass as props the data needed to that modal to load (e.g. here we are passing the user_name as the prop 'name')
        yield client.openModal(example_messages_1.MyModal, trigger_id, { name: user_name });
    });
});
//--------------------------------------------------------- routes END ----------------------------------------------------------------------------------
//--------------------------------------------------------- AUTH START ----------------------------------------------------------------------------------
//slash command POST route => set from slack web app /register command
app.post("/redirect", function (req, res) {
    const client_id = "RDX22JJQSQWL2RMFXCTLGDOQ39XSN04V"; //from the slack web app
    const redirect_uri = "https://phelia-test-slack.herokuapp.com/auth";
    res.redirect(`https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`);
});
//auth to bind ClickUp's API token to DB. The DB will relate slack's user ID to clickUP access token for future post request to ClickUp API
app.get("/auth", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO make DB and bind clickUp's access token to slack's user ID
    });
});
//feedback route
app.get("/registration", function (req, res) {
    res.send("Registration completed");
});
//--------------------------------------------------------- AUTH END ----------------------------------------------------------------------------------
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map