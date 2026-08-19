### Email notifications (updated)

Password reset flow

This project includes a password reset flow using short-lived tokens. The endpoints:

- POST /api/auth/forgot  { email }
  - Creates a one-time reset token (expires in 1 hour) and sends an email to the user's address with a reset link.
- POST /api/auth/reset   { token, password }
  - Validates the token and updates the user's password (bcrypt hash). The token is marked used and cannot be reused.

Email delivery
- Password reset emails are sent using the same SendGrid or SMTP configuration as other notifications.
- Make sure SENDGRID_API_KEY + SENDGRID_FROM are set for SendGrid Web API or SMTP_* envs for SMTP relay.

Security notes
- Reset tokens expire after 1 hour and are single-use.
- Do not commit secrets to the repo; use deployment environment variables.
