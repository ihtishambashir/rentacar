const { requiredBody, sendEmail, json } = require("../lib/mail.js");

module.exports = async function handler(request) {
  if (request.method !== "POST") return json({ message: "Method not allowed" }, 405);

  let body;
  try { body = await request.json(); }
  catch { return json({ message: "Invalid request." }, 400); }

  if (!requiredBody(body, ["customer-name", "customer-email", "customer-phone", "date-from", "date-to"])) {
    return json({ message: "Please complete all required fields." }, 400);
  }

  return sendEmail(body, "VertexRent – Rental Booking Request");
};
