import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getDatabase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY?.trim() || "";
  const normalizedKey = rawPrivateKey.replace(/\\n/g, "\n");
  const privateKey = normalizedKey.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/)?.[0] || "";
  if (!projectId || !clientEmail || !privateKey) throw new Error("DATABASE_NOT_CONFIGURED");

  const app = getApps()[0] || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return getFirestore(app);
}
