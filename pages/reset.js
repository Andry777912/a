import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Reset(){
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    setLoading(true); setStatus('')
    try{
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ token, password }) })
      if(res.ok){ setStatus('Parola sıfırlandı. Giriş yapabilirsiniz.'); setPassword('') }
      else { const j = await res.json(); setStatus(j.error || 'Hata') }
    }catch(e){ setStatus('Sunucu hatası') }
    setLoading(false)
  }

  return (
    <div className="container" style={{padding:'2rem'}}>
      <h2>Parola sıfırlama</h2>
      {!token && <p>Geçerli bir sıfırlama bağlantısı yok.</p>}
      {token && (
        <form onSubmit={submit}>
          <label>Yeni parola
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </label>
          <div style={{marginTop:'.5rem'}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Bekleyin...' : 'Sıfırla'}</button>
          </div>
          {status && <p style={{marginTop:'.5rem'}}>{status}</p>}
        </form>
      )}
    </div>
  )
}
