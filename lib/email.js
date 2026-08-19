import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

export async function sendMail({ to, subject, text, html }){
  const emailTo = to
  // Prefer SendGrid Web API
  if(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM){
    try{
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      await sgMail.send({
        to: emailTo,
        from: process.env.SENDGRID_FROM,
        subject,
        text,
        html
      })
      return true
    }catch(e){
      console.error('SendGrid error', e)
      // fallthrough to SMTP attempt
    }
  }

  // Fallback to SMTP
  if(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS){
    try{
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT,10) : 587,
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      })
      await transporter.sendMail({ from: process.env.SMTP_USER, to: emailTo, subject, text, html })
      return true
    }catch(e){
      console.error('SMTP error', e)
      return false
    }
  }

  console.warn('No email provider configured. Skipping sendMail.')
  return false
}
