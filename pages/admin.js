import { useState } from 'react'

export default function Admin(){
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [msgs, setMsgs] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(){
    setErr('')
    setLoading(true)
    try{
      const res = await fetch('/api/admin/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ user, pass }), credentials: 'same-origin' })
      if(!res.ok){ const j = await res.json(); setErr(j.error || 'Giriş başarısız'); setLoading(false); return }
      // fetch messages after login (cookie will be set by server)
      await loadMessages()
    }catch(e){ setErr('Sunucu hatası') }
    setLoading(false)
  }

  async function loadMessages(){
    setErr('')
    try{
      const res = await fetch('/api/admin/messages', { credentials: 'same-origin' })
      if(!res.ok){ if(res.status === 401) setErr('Yetkisiz. Lütfen giriş yapın.'); else setErr('Hata'); return }
      const j = await res.json()
      setMsgs(j.messages)
    }catch(e){ setErr('Sunucu hatası') }
  }

  async function logout(){
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' })
    setMsgs(null)
    setUser('')
    setPass('')
  }

  return (
    <div>
      <header className="site-header"><div className="container"><h1 className="logo">Storm League — Admin</h1></div></header>
      <main className="container" style={{padding:'2rem 0'}}>
        <h2>Mesajlar</h2>
        {!msgs && (
          <div>
            <p>Admin kullanıcı bilgileri ile giriş yapın.</p>
            <label>Kullanıcı <input value={user} onChange={e=>setUser(e.target.value)} type="text" /></label>
            <label>Parola <input value={pass} onChange={e=>setPass(e.target.value)} type="password" /></label>
            <div style={{marginTop:'.5rem'}}>
              <button className="btn" onClick={login} disabled={loading}>{loading ? 'Giriş yapılıyor...' : 'Giriş'}</button>
            </div>
            {err && <p style={{color:'#fda4af'}}>{err}</p>}
          </div>
        )}

        {msgs && (
          <div>
            <button className="btn" onClick={logout}>Çıkış</button>
            <ul style={{marginTop:'1rem'}}>
              {msgs.map(m => (
                <li key={m.id} style={{margin:'1rem 0',padding:'1rem',background:'rgba(255,255,255,0.02)',borderRadius:8}}>
                  <div style={{fontWeight:700}}>{m.name} — <span style={{color:'#94a3b8'}}>{new Date(m.createdAt).toLocaleString()}</span></div>
                  <div style={{color:'#94a3b8'}}>{m.email}</div>
                  <p style={{marginTop:'.5rem'}}>{m.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </main>
    </div>
  )
}
