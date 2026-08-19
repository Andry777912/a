import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Admin(){
  const { data: session, status } = useSession()
  const [msgs, setMsgs] = useState(null)
  const [err, setErr] = useState('')

  useEffect(()=>{
    if(session && session.user && session.user.role === 'admin'){
      loadMessages()
    }
  },[session])

  async function loadMessages(){
    setErr('')
    try{
      const res = await fetch('/api/admin/messages')
      if(!res.ok){ if(res.status === 401) setErr('Yetkisiz. Lütfen giriş yapın.'); else setErr('Hata'); return }
      const j = await res.json()
      setMsgs(j.messages)
    }catch(e){ setErr('Sunucu hatası') }
  }

  if(status === 'loading') return <div>Loading...</div>

  if(!session){
    return (
      <div>
        <header className="site-header"><div className="container"><h1 className="logo">Storm League — Admin</h1></div></header>
        <main className="container" style={{padding:'2rem 0'}}>
          <h2>Giriş</h2>
          <p>Admin olarak giriş yapmak için aşağıyı kullanın.</p>
          <button className="btn" onClick={()=>signIn()}>Giriş yap</button>
        </main>
      </div>
    )
  }

  if(session.user.role !== 'admin'){
    return <div style={{padding:'2rem'}}>Yetkisiz: admin olun.</div>
  }

  return (
    <div>
      <header className="site-header"><div className="container"><h1 className="logo">Storm League — Admin</h1></div></header>
      <main className="container" style={{padding:'2rem 0'}}>
        <h2>Mesajlar</h2>
        <button className="btn" onClick={()=>{ signOut(); setMsgs(null); }}>Çıkış</button>
        {err && <p style={{color:'#fda4af'}}>{err}</p>}
        {msgs && (
          <ul style={{marginTop:'1rem'}}>
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
