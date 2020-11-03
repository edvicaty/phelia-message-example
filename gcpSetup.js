import fs from "fs";

fs.writeFile("./gcpconfig.json", process.env.GCP_CRED, (err) => {});
