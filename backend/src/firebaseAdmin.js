import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let credential

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // Prod
  credential = admin.credential.cert(
    JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  )
} else {
  // Local
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "serviceAccountKey.json"), "utf8"
    )
  )
  credential = admin.credential.cert(serviceAccount)
}

admin.initializeApp({ credential});

export default admin;
