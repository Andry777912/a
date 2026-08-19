import cookie from 'cookie'

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  // clear cookie
  const cookieStr = cookie.serialize('token', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax' })
  res.setHeader('Set-Cookie', cookieStr)
  return res.json({ ok: true })
}
