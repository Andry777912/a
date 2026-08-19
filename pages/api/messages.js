import prisma from '../../lib/prisma'
import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'Method Not Allowed'})
  }
  const { name, email, message } = req.body || {}
  if(!name || !email || !message) return res.status(400).json({error:'Eksik alan'})

  try{
    const rec = await prisma.message.create({ data: { name, email, message } })

    const emailTo = process.env.EMAIL_TO

    // Prefer SendGrid Web API if configured
    if(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM && emailTo){
      try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: emailTo,
          from: process.env.SENDGRID_FROM,
          subject: `Yeni iletişim mesajı — ${name}`,
          text: `İsim: ${name}\nE-posta: ${email}\n\n${message}`,
          html: `<p><strong>İsim:</strong> ${name}</p><p><strong>E-posta:</strong> ${email}</p><hr/><p>${message}</p>`
        }
        await sgMail.send(msg)
        return res.status(201).json({ ok: true, id: rec.id, email: true, provider: 'sendgrid' })
      }catch(sgErr){
        console.error('SendGrid send error', sgErr)
        // fall through to SMTP attempt if configured
      }
    }

    // Fallback to SMTP via nodemailer if SMTP vars are set
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT,10) : undefined

    if(smtpHost && smtpUser && smtpPass && emailTo){
      try{
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort || 587,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass }
        })

        const subject = `Yeni iletişim mesajı — ${name}`
        const text = `İsim: ${name}\nE-posta: ${email}\n\n${message}`
        const html = `<p><strong>İsim:</strong> ${name}</p><p><strong>E-posta:</strong> ${email}</p><hr/><p>${message}</p>`

        await transporter.sendMail({ from: smtpUser, to: emailTo, subject, text, html })
        return res.status(201).json({ ok: true, id: rec.id, email: true, provider: 'smtp' })
      }catch(emailErr){
        console.error('SMTP send error', emailErr)
        return res.status(201).json({ ok: true, id: rec.id, email: false, message: 'Saved but email failed' })
      }
    }

    // No email provider configured — still saved to DB
    return res.status(201).json({ ok: true, id: rec.id, email: false, message: 'Saved but no email provider configured' })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'DB hata' })
  }
}
