### Email notifications

This project can send email notifications when a new contact form is submitted. To enable email sending, set the following environment variables (do not commit real credentials to the repository):

- SENDGRID_API_KEY - (optional) SendGrid Web API key. If present, SendGrid Web API will be used.
- SENDGRID_FROM - (required if using SendGrid Web API) verified sender email configured in SendGrid.
- SMTP_HOST - (optional fallback) SMTP server host (e.g. smtp.sendgrid.net)
- SMTP_PORT - SMTP port (e.g. 587)
- SMTP_USER - SMTP username (email or user)
- SMTP_PASS - SMTP password
- EMAIL_TO - recipient address that should receive the contact messages

Priority of providers
1) If SENDGRID_API_KEY and SENDGRID_FROM are set, the API will attempt to send via SendGrid Web API.
2) If SendGrid is not configured or sending via the Web API fails, the API will attempt to use the SMTP settings via nodemailer (if SMTP_HOST/SMTP_USER/SMTP_PASS are provided).
3) If no provider is configured the message will still be saved to the database but no email will be sent.

SendGrid Web API example (recommended)

Set these in your deployment environment (Vercel / Cloud provider):

SENDGRID_API_KEY=SG.xxxxxx-xxxxxxxxxx
SENDGRID_FROM=verified-sender@example.com
EMAIL_TO=your@inbox.example.com

SMTP relay example (fallback)

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxx-xxxxxxxxxx
EMAIL_TO=your@inbox.example.com

Notes and recommendations
- Use SendGrid Web API for better deliverability and template support. The project will use SendGrid automatically if SENDGRID_API_KEY and SENDGRID_FROM are present.
- Do NOT commit real API keys or passwords to the repository. Use your deployment provider's Environment Variables feature (e.g., Vercel Project Settings > Environment Variables).
- On Vercel, add environment variables to the Production (and Preview/Development if needed) environment.
- If SendGrid Web API fails, the code tries SMTP if configured; otherwise the DB save still succeeds.
