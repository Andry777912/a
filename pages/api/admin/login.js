import { signToken } from '../../../lib/auth'
import cookie from 'cookie'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { user, pass } = req.body || {}
  if(!user || !pass) return res.status(400).json({ error: 'Missing credentials' })
  if(user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS){
    const token = signToken({ user })
    const cookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax'
    }
    // add secure flag in production
    const cookieStr = cookie.serialize('token', token, Object.assign({}, cookieOptions, process.env.NODE_ENV === 'production' ? { secure: true } : {}))
    res.setHeader('Set-Cookie', cookieStr)
    return res.json({ ok: true })
  }
  return res.status(401).json({ error: 'Unauthorized' })
}
