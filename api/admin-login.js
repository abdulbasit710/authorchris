import crypto from "node:crypto";
import { clearSessionCookie, createSession, sessionCookie } from "./_auth.js";

const same = (left, right) => {
  const a = Buffer.from(left || "");
  const b = Buffer.from(right || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export default function handler(request, response) {
  if (request.method === "DELETE") {
    response.setHeader("Set-Cookie", clearSessionCookie);
    return response.status(200).json({ ok: true });
  }
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return response.status(503).json({ error: "Admin access is not configured." });
  }
  if (!same(request.body?.password, process.env.ADMIN_PASSWORD)) {
    return response.status(401).json({ error: "Incorrect password." });
  }
  response.setHeader("Set-Cookie", sessionCookie(createSession(process.env.ADMIN_SESSION_SECRET)));
  return response.status(200).json({ ok: true });
}
