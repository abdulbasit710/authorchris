import crypto from "node:crypto";

const COOKIE_NAME = "admin_session";

export function createSession(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isAdmin(request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const cookies = Object.fromEntries((request.headers.cookie || "").split(";").map((part) => part.trim().split("=")));
  const [payload, signature] = (cookies[COOKIE_NAME] || "").split(".");
  if (!payload || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}

export const sessionCookie = (token) => `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`;
export const clearSessionCookie = `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
