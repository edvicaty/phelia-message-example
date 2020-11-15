import dotenv from "dotenv"
import express from "express"
import { createEventAdapter } from "@slack/events-api"
import bodyParser from "body-parser"
dotenv.config()
import client from "./config/phelia"
import authRoutes from "./routes/auth"
import tasksRoutes from "./routes/tasks"

const app = express()
const port = process.env.PORT || 80

// Register your Home App
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
app.use("/events", slackEvents.requestListener())

// Register the interaction webhook
app.post("/interactions", client.messageHandler(process.env.SLACK_SIGNING_SECRET))

//NOTE: loading body parser before phelia config will crash the app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", authRoutes)
app.use("/", tasksRoutes)

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
