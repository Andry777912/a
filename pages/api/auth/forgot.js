import prisma from '../../../lib/prisma'
import { randomBytes } from 'crypto'
import { sendMail } from '../../../lib/email'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { email } = req.body || {}
  if(!email) return res.status(400).json({ error: 'Missing email' })

  try{
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) return res.status(200).json({ ok: true, message: 'If that email exists you will receive reset instructions.' })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordReset.create({ data: { token, userId: user.id, expiresAt } })

    const base = process.env.NEXTAUTH_URL || `http://localhost:3000`
    const resetUrl = `${base}/reset?token=${token}`

    const subject = 'Password reset instructions'
    const text = `You requested a password reset. Click or open the link to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`
    const html = `<p>You requested a password reset. Click the link below to reset your password (expires in 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`

    await sendMail({ to: user.email, subject, text, html })
    return res.json({ ok: true, message: 'If that email exists you will receive reset instructions.' })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}
