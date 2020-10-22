"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const phelia_1 = __importDefault(require("phelia"));
const random_image_1 = require("./random-image");
dotenv_1.default.config();
const app = express_1.default();
const port = 2000;
const client = new phelia_1.default(process.env.SLACK_TOKEN);
client.registerComponents([random_image_1.RandomImage]);
// Register the interaction webhook
app.post("/interactions", client.messageHandler(process.env.SLACK_SIGNING_SECRET));
// This is how you post a message....
client.postMessage(random_image_1.RandomImage, "U01CMED2XF1");
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map