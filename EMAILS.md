### Email notifications

This project can send email notifications when a new contact form is submitted. To enable email sending, set the following environment variables (do not commit real credentials to the repository):

- SMTP_HOST - your SMTP server host (e.g. smtp.sendgrid.net)
- SMTP_PORT - SMTP port (e.g. 587)
- SMTP_USER - SMTP username (email or user)
- SMTP_PASS - SMTP password
- EMAIL_TO - recipient address that should receive the contact messages

Example (in Vercel or .env locally):

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=supersecret
EMAIL_TO=your@inbox.example.com

When SMTP settings are present, the API route /api/messages will attempt to send an email after saving the message to the database. If the email fails, the message remains stored and the API returns a success code but indicates the email failed.

---

SendGrid-specific guidance

SendGrid is a reliable provider for transactional emails. You can use SendGrid in two ways with this project:

1) SMTP relay (recommended for minimal changes)
- Set SMTP_HOST to `smtp.sendgrid.net`
- Set SMTP_PORT to `587`
- Set SMTP_USER to `apikey` (literally the string `apikey`)
- Set SMTP_PASS to your SendGrid API key
- Set EMAIL_TO to the address that should receive notifications

Example .env entries for SendGrid (do NOT commit real API keys):

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxx-xxxxxxxxxx
EMAIL_TO=your@inbox.example.com

2) SendGrid Web API (optional, more control)
- If you prefer calling SendGrid's Web API, install `@sendgrid/mail` and replace the nodemailer transport logic with a direct API call. This removes the need to expose SMTP credentials and can be more reliable.

Quick example (server-side):

```js
// Example using @sendgrid/mail in Next.js API route
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: process.env.EMAIL_TO,
  from: process.env.SENDGRID_FROM, // must be a verified sender
  subject: `Yeni iletişim mesajı — ${name}`,
  text: `İsim: ${name}\nE-posta: ${email}\n\n${message}`,
  html: `<p><strong>İsim:</strong> ${name}</p><p><strong>E-posta:</strong> ${email}</p><hr/><p>${message}</p>`
})
```

Environment variables for Web API option:
- SENDGRID_API_KEY (your API key)
- SENDGRID_FROM (a verified sender email configured in SendGrid)
- EMAIL_TO (recipient)

Notes and recommendations
- Use SendGrid SMTP for quick setup (works with current nodemailer implementation). Use the Web API for better deliverability and template support.
- Add environment variables in your deployment platform (e.g., Vercel > Project > Settings > Environment Variables). Never commit credentials to the repo.
- On Vercel, set the variables for the Production environment to enable email sending after deploy.

If you want, I can:
- Add an optional SendGrid Web API implementation and the `@sendgrid/mail` dependency and switch the API to use it (requires SENDGRID_API_KEY and SENDGRID_FROM). If you want that, reply "Add SendGrid API" and I'll push the changes.
- Or I can keep the current SMTP-based nodemailer approach and provide a short Vercel deployment guide and checklist.
