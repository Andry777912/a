import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { token, password } = req.body || {}
  if(!token || !password) return res.status(400).json({ error: 'Missing token or password' })

  try{
    const pr = await prisma.passwordReset.findUnique({ where: { token } })
    if(!pr || pr.used || pr.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' })

    const hash = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: pr.userId }, data: { passwordHash: hash } })
    await prisma.passwordReset.update({ where: { id: pr.id }, data: { used: true } })

    return res.json({ ok: true })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}
