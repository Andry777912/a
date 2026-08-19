import prisma from '../../../lib/prisma'

export default async function handler(req,res){
  const pass = req.headers['x-admin-pass'] || ''
  if(pass !== process.env.ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' })
  if(req.method === 'GET'){
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
    return res.json({ ok: true, messages: msgs })
  }
  res.setHeader('Allow','GET')
  res.status(405).end('Method Not Allowed')
}
