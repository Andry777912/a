import prisma from '../../lib/prisma'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'Method Not Allowed'})
  }
  const { name, email, message } = req.body
  if(!name || !email || !message) return res.status(400).json({error:'Eksik alan'})
  try{
    const rec = await prisma.message.create({ data: { name, email, message } })
    return res.status(201).json({ ok: true, id: rec.id })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'DB hata' })
  }
}
