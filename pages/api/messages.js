import prisma from '../../lib/prisma'
import nodemailer from 'nodemailer'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'Method Not Allowed'})
  }
  const { name, email, message } = req.body || {}
  if(!name || !email || !message) return res.status(400).json({error:'Eksik alan'})

  try{
    const rec = await prisma.message.create({ data: { name, email, message } })

    // Send email notification if SMTP is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT,10) : undefined
    const emailTo = process.env.EMAIL_TO

    if(smtpHost && smtpUser && smtpPass && emailTo){
      try{
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort || 587,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        })

        const subject = `Yeni iletişim mesajı — ${name}`
        const text = `İsim: ${name}\nE-posta: ${email}\n\n${message}`
        const html = `<p><strong>İsim:</strong> ${name}</p><p><strong>E-posta:</strong> ${email}</p><hr/><p>${message}</p>`

        await transporter.sendMail({ from: smtpUser, to: emailTo, subject, text, html })
      }catch(emailErr){
        console.error('Email send error', emailErr)
        // Do not fail the whole request — we already saved to DB
        return res.status(201).json({ ok: true, id: rec.id, email: false, message: 'Saved but email failed' })
      }
    }

    return res.status(201).json({ ok: true, id: rec.id, email: !!(smtpHost && smtpUser && smtpPass && emailTo) })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'DB hata' })
  }
}
