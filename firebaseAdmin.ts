import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

const serviceAccount = require("./serviceAccountKey.json");

// const serviceAccount = JSON.parse(
//   process.env.FIREBASE_SERVICE_ACCOUNT as string
// );

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };