export async function submitInquiry(form, formType, extra = {}) {
  const fields = Object.fromEntries(new FormData(form).entries());
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, ...fields, ...extra }),
  });
  let result = {};
  try { result = await response.json(); } catch { /* Use the fallback error below. */ }
  if (!response.ok) throw new Error(result.error || "We couldn't send your message. Please try again.");
  return result;
}
