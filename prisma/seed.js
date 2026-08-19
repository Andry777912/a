import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'

;(async function(){
  const adminEmail = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASS
  if(!adminEmail || !adminPass){
    console.log('Set ADMIN_USER and ADMIN_PASS environment variables to create an initial admin.')
    process.exit(0)
  }
  try{
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
    if(existing){
      console.log('Admin user already exists:', adminEmail)
      process.exit(0)
    }
    const hash = await bcrypt.hash(adminPass, 10)
    await prisma.user.create({ data: { name: 'Admin', email: adminEmail, passwordHash: hash, role: 'admin' } })
    console.log('Admin created:', adminEmail)
    process.exit(0)
  }catch(e){
    console.error(e)
    process.exit(1)
  }
})()
