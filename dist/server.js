"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const events_api_1 = require("@slack/events-api");
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const phelia_config_1 = __importDefault(require("./phelia-config"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const app = express_1.default();
const port = process.env.PORT || 80;
//loading body parser before phelia components will crash the app
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Register your Home App
const slackEvents = events_api_1.createEventAdapter(process.env.SLACK_SIGNING_SECRET);
app.use("/events", slackEvents.requestListener());
// Register the interaction webhook
app.post("/interactions", phelia_config_1.default.messageHandler(process.env.SLACK_SIGNING_SECRET));
app.use("/", auth_1.default);
app.use("/", tasks_1.default);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map