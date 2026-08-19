import { useState } from 'react'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [msgs, setMsgs] = useState(null)
  const [err, setErr] = useState('')

  async function load(){
    setErr('')
    try{
      const res = await fetch('/api/admin/messages', { headers: { 'x-admin-pass': pass } })
      if(!res.ok){ setErr('Yetkisiz veya hata'); return }
      const j = await res.json()
      setMsgs(j.messages)
    }catch(e){ setErr('Sunucu hatası') }
  }

  return (
    <div>
      <header className="site-header"><div className="container"><h1 className="logo">Storm League — Admin</h1></div></header>
      <main className="container" style={{padding:'2rem 0'}}>
        <h2>Mesajlar</h2>
        <p>Admin parolası girin (env var ADMIN_PASS).</p>
        <label>Parola <input value={pass} onChange={e=>setPass(e.target.value)} type="password" /></label>
        <button className="btn" onClick={load}>Yükle</button>
        {err && <p style={{color:'#fda4af'}}>{err}</p>}
        {msgs && (
          <ul>
            {msgs.map(m => (
              <li key={m.id} style={{margin:'1rem 0',padding:'1rem',background:'rgba(255,255,255,0.02)',borderRadius:8}}>
                <div style={{fontWeight:700}}>{m.name} — <span style={{color:'#94a3b8'}}>{new Date(m.createdAt).toLocaleString()}</span></div>
                <div style={{color:'#94a3b8'}}>{m.email}</div>
                <p style={{marginTop:'.5rem'}}>{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
