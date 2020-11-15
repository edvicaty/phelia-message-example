import Axios from "axios"
import express from "express"
import { TextMessage } from "../components/TextMessage"
import { RegistrationModal } from "../components/Registration"
import client from "../config/phelia"
import getData from "../graphQL/fetchData"
const router = express.Router()

//AUTH functions START ------------------------------------

async function auth(clientID: any, clientSecret: any, authCode: any) {
  const accessToken = await Axios.post(
    `https://api.clickup.com/api/v2/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authCode}`
  )
  return accessToken
}

async function getUser(token: any) {
  const user = await Axios.get(`https://api.clickup.com/api/v2/user`, {
    headers: { Authorization: `${token}` },
  })
  return user
}
//AUTH functions END --------------------------------------

let idToRegister: string = null

//slash command POST route => set from slack web app : /register command
router.post("/redirect", async function (req, res) {
  await res.sendStatus(200)

  const { user_id, user_name, trigger_id } = await req.body

  const userVariables = {
    slackId: user_id,
  }
  const userQuery = `
  query($slackId: String!) {
    filtered: users(
      options: {
        filter: [{ field: "services.slack.id", operator: "==", value: $slackId }]
        limit: 1
      }
    ) {
      id
      createdAt
      updatedAt
      services {
        clickUp {
          id
          token
          workspace
          isAdmin
        }
        slack {
          id
          username
        }
      }
    }
  }
  `

  const userAddMutation = `
  mutation {
    filtered: userAdd(
      user: {
        services: {
          slack: { id: "${user_id}", username: "${user_name}" }
        }
      }
    ) {
      id
      createdAt
      updatedAt
      services {
        clickUp {
          id
          token
          workspace
          isAdmin
        }
        slack {
          id
          username
        }
      }
    }
  }
  `

  const existingUser = await getData(userQuery, userVariables)

  // client.postMessage(TextMessage, `U01CMED2XF1`, {
  //   message: JSON.stringify(existingUser.filtered, null, 2),
  // })

  if (existingUser.filtered[0].id) {
    idToRegister = await existingUser.filtered[0].id
    client.openModal(RegistrationModal, trigger_id, {
      name: user_name,
    })
  }

  if (!existingUser.filtered[0].id) {
    const newUser = await getData(userAddMutation, null)
    idToRegister = await newUser.filtered.id
    client.openModal(RegistrationModal, trigger_id, {
      name: user_name,
    })
  }
})

//auth to bind ClickUp's API token to DB
router.get("/auth", async function (req, res) {
  const authCode = await req.query.code

  const accessToken = await auth(
    process.env.CLICKUP_ID,
    process.env.CLICKUP_SECRET,
    authCode
  )

  const user = await getUser(accessToken.data.access_token)

  const userUpdateQuery = `
  mutation {
  filtered: userUpdate(
    id: "${idToRegister}"
    user: {
      services: { clickUp: { token: "${
        accessToken.data.access_token
      }", workspace: "${JSON.stringify(user, null, 2)}", id : "${
    user.data.user.id
  }" } }
    }
  ) {
    id
    createdAt
    updatedAt
    services {
      clickUp {
        id
        token
        workspace
        isAdmin
      }
      slack {
        id
        username
      }
    }
  }
}
`
  await getData(userUpdateQuery, null)

  idToRegister = null

  res.redirect("/registration")
})

//feedback route
router.get("/registration", function (req, res) {
  res.send("Registration completed")
})

export default router
