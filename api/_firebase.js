import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getDatabase() {
  let serviceAccount = {};
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch {
      throw new Error("INVALID_SERVICE_ACCOUNT_JSON");
    }
  }

  const projectId = serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = serviceAccount.client_email || process.env.FIREBASE_CLIENT_EMAIL;
  const suppliedKey = serviceAccount.private_key || process.env.FIREBASE_PRIVATE_KEY;
  const rawPrivateKey = suppliedKey?.trim() || "";
  const normalizedKey = rawPrivateKey.replace(/\\n/g, "\n");
  const privateKey = normalizedKey.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/)?.[0] || "";
  if (!projectId || !clientEmail || !privateKey) throw new Error("DATABASE_NOT_CONFIGURED");

  const app = getApps()[0] || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return getFirestore(app);
}
