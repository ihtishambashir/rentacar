# VertexRent – Vercel Forms Setup

The site remains a static HTML/CSS/JS site. Forms now submit to Vercel Functions instead of only showing browser alerts.

## Environment variables

Set these in Vercel Project Settings → Environment Variables:

- `RESEND_API_KEY` – Resend API key with permission to send email.
- `CONTACT_TO_EMAIL` – the client's receiving email address, e.g. `info@vertexrent.de`.
- `EMAIL_FROM` – a verified sender address/domain in Resend, e.g. `Website <no-reply@vertexrent.de>`.

After adding variables, redeploy the project.

## Forms

- `services.html#rental` → rental-only request → `/api/rental`
- `services.html#moving` / `#moving-contact` → moving-only request → `/api/moving`
- Homepage rental booking → `/api/booking`
- Homepage general contact → `/api/contact`

The service forms deliberately do not share Rental/Moving fields, so a Moving customer will never see rental-car fields in the Moving form.
