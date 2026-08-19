import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req,res){
  const session = await getSession({ req })
  if(!session || session.user.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' })
  if(req.method === 'GET'){
    try{
      const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
      return res.json({ ok: true, messages: msgs })
    }catch(e){
      console.error(e)
      return res.status(500).json({ error: 'DB hata' })
    }
  }
  res.setHeader('Allow','GET')
  res.status(405).end('Method Not Allowed')
}
