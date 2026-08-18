const RESEND_API_URL = "https://api.resend.com/emails";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function clean(value) {
  return String(value ?? "").trim().slice(0, 5000);
}

function requiredBody(body, required) {
  return required.every((field) => clean(body[field]));
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailRows(data) {
  return Object.entries(data)
    .filter(([, value]) => clean(value))
    .map(([key, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:700">${escapeHtml(key)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`)
    .join("");
}

async function sendEmail(data, subject) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return json({ message: "The form is not configured yet. Set RESEND_API_KEY, CONTACT_TO_EMAIL and EMAIL_FROM in Vercel." }, 503);
  }

  const customerEmail = clean(data.email);
  const payload = {
    from,
    to: [to],
    subject,
    ...(customerEmail ? { reply_to: customerEmail } : {}),
    html: `<div style="font-family:Arial,sans-serif;max-width:720px"><h2>${escapeHtml(subject)}</h2><table style="width:100%;border-collapse:collapse">${emailRows(data)}</table></div>`,
  };

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Resend error", details);
    return json({ message: "We could not send your request right now. Please try again later." }, 502);
  }

  return json({ message: "Thank you. Your request has been sent successfully." });
}

module.exports = { clean, requiredBody, sendEmail, json };
