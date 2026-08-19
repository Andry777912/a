import bcrypt from 'bcrypt'
import prisma from '../../../lib/prisma'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { name, email, password } = req.body || {}
  if(!email || !password) return res.status(400).json({ error: 'Eksik alan' })
  try{
    const existing = await prisma.user.findUnique({ where: { email } })
    if(existing) return res.status(409).json({ error: 'Kullanıcı zaten var' })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name: name || null, email, passwordHash: hash, role: 'user' } })
    return res.status(201).json({ ok: true, id: user.id })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'DB hata' })
  }
}
