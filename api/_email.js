const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
})[character]);

const FORM_LABELS = { contact: "Contact inquiry", book: "Book inquiry", "early-access": "Early-access signup" };

export async function sendSubmissionEmail(submission, submissionId) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Email notification skipped: RESEND_API_KEY is missing.");
    return false;
  }

  const recipient = process.env.ADMIN_EMAIL || "ceo@loormax.com";
  const sender = process.env.FROM_EMAIL || "Website Notifications <onboarding@resend.dev>";
  const fields = [
    ["Name", submission.name], ["Email", submission.email], ["Phone", submission.phone],
    ["Organization", submission.organization], ["Interest", submission.interest],
    ["Book", submission.bookTitle], ["Message", submission.message],
  ].filter(([, value]) => value);
  const formLabel = FORM_LABELS[submission.form_type] || "Website submission";
  const html = `<div style="max-width:680px;margin:auto;font-family:Arial,sans-serif;color:#17130d"><div style="padding:26px;background:#171109;color:#fff"><div style="color:#deb45f;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Christopher DiCristo Website</div><h1 style="margin:8px 0 0;font-size:25px">${escapeHtml(formLabel)}</h1></div><table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th style="width:140px;padding:14px;text-align:left;vertical-align:top;border-bottom:1px solid #eee;color:#7d6842">${label}</th><td style="padding:14px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table><p style="font-size:12px;color:#888">Submission ID: ${escapeHtml(submissionId)}</p></div>`;

  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `submission-${submissionId}` },
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: submission.email, subject: `${formLabel} — ${submission.name}`, html }),
  });
  if (!delivery.ok) {
    console.error("Email notification failed:", delivery.status, await delivery.text());
    return false;
  }
  return true;
}
