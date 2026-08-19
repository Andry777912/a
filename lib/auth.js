import jwt from 'jsonwebtoken'

const SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASS || 'dev_secret'

export function signToken(payload){
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyToken(token){
  try{
    return jwt.verify(token, SECRET)
  }catch(e){
    return null
  }
}
