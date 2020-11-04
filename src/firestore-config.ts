import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "octavia-bot-test",
    clientEmail: "octavia-bot-test@octavia-bot-test.iam.gserviceaccount.com",
    privateKey: process.env.PRIVATE_KEY_GCP.replace(/\\n/g, "\n"),
  }),
  databaseURL: "https://test-firestore-b9cbd.firebaseio.com",
});

const db = admin.firestore();
export default db;
