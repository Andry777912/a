import prisma from '../../../lib/prisma'
import cookie from 'cookie'
import { verifyToken } from '../../../lib/auth'

export default async function handler(req,res){
  // only GET allowed
  if(req.method !== 'GET'){
    res.setHeader('Allow','GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const token = cookies.token
  const payload = verifyToken(token)
  if(!payload) return res.status(401).json({ error: 'Unauthorized' })
  try{
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json({ ok: true, messages: msgs })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'DB hata' })
  }
}
