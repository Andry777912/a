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
