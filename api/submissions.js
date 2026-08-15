import { isAdmin } from "./_auth.js";
import { FieldValue } from "firebase-admin/firestore";
import { getDatabase } from "./_firebase.js";

const FORM_NAMES = { contact: "Contact inquiry", book: "Book inquiry", "early-access": "Early access" };
const LIMITS = { name: 120, email: 254, phone: 50, organization: 160, interest: 180, message: 5000, bookTitle: 200 };
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";

export default async function handler(request, response) {
  try {
    if (request.method === "POST") {
      const body = request.body && typeof request.body === "object" ? request.body : {};
      if (body.website) return response.status(200).json({ ok: true });
      const formType = FORM_NAMES[body.formType] ? body.formType : "contact";
      const values = Object.fromEntries(Object.entries(LIMITS).map(([key, max]) => [key, clean(body[key], max)]));
      if (!values.name || !values.email || (formType !== "early-access" && !values.message)) return response.status(400).json({ error: "Please complete all required fields." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return response.status(400).json({ error: "Please enter a valid email address." });
      await getDatabase().collection("form_submissions").add({ form_type: formType, ...values, is_read: false, created_at: FieldValue.serverTimestamp() });
      return response.status(201).json({ ok: true });
    }

    if (!isAdmin(request)) return response.status(401).json({ error: "Authentication required." });
    if (request.method === "GET") {
      const snapshot = await getDatabase().collection("form_submissions").orderBy("created_at", "desc").limit(500).get();
      const items = snapshot.docs.map((document) => {
        const data = document.data();
        return { id: document.id, ...data, created_at: data.created_at?.toDate().toISOString() || new Date().toISOString() };
      });
      return response.status(200).json(items);
    }
    if (request.method === "PATCH") {
      const id = clean(request.body?.id, 200);
      if (!id) return response.status(400).json({ error: "Invalid submission." });
      await getDatabase().collection("form_submissions").doc(id).update({ is_read: Boolean(request.body?.isRead) });
      return response.status(200).json({ ok: true });
    }
    return response.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Submission API error:", error);
    const messages = {
      DATABASE_NOT_CONFIGURED: "Firebase credentials are incomplete.",
      INVALID_SERVICE_ACCOUNT_JSON: "The Firebase service-account JSON is not valid.",
    };
    const message = messages[error.message] || "The request could not be completed. Please try again.";
    return response.status(503).json({ error: message });
  }
}
