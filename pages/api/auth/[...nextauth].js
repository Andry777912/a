import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcrypt'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials){
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if(!user || !user.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if(!ok) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }){
      if(user){ token.role = user.role }
      return token
    },
    async session({ session, token }){
      session.user = session.user || {}
      session.user.role = token.role
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.ADMIN_SECRET || 'dev_nextauth_secret'
})
