import Head from 'next/head'
import { useState } from 'react'

export default function Home(){
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name')?.trim(),
      email: fd.get('email')?.trim(),
      message: fd.get('message')?.trim()
    }
    if(!payload.name || !payload.email || !payload.message){
      setStatus('Lütfen tüm alanları doldurun.');
      return;
    }
    setSending(true); setStatus('Gönderiliyor...')
    try{
      const res = await fetch('/api/messages', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      })
      if(res.ok){ setStatus('Mesaj kaydedildi. Teşekkürler!'); e.target.reset(); }
      else { const j = await res.json(); setStatus(j.error || 'Hata oluştu'); }
    }catch(err){ setStatus('Sunucu hatası'); }
    setSending(false)
  }

  return (
    <>
      <Head>
        <title>Storm League — Uygulama</title>
      </Head>
      <header className="site-header">
        <div className="container">
          <h1 className="logo">Storm League</h1>
          <nav className="nav">
            <a href="#features">Özellikler</a>
            <a href="#about">Hakkında</a>
            <a href="#contact">İletişim</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h2>Hoş geldiniz</h2>
            <p>Storm League temalı demo uygulama — full‑stack Next.js + SQLite</p>
            <a className="btn" href="#contact">İletişime Geç</a>
          </div>
        </section>

        <section id="features" className="features container">
          <h3>Özellikler</h3>
          <ul>
            <li>Next.js + API routes</li>
            <li>SQLite (Prisma) ile mesaj kaydı</li>
            <li>Basit admin sayfası (parola ile korunur)</li>
          </ul>
        </section>

        <section id="about" className="about container">
          <h3>Hakkında</h3>
          <p>Bu uygulama, statik demo yerine tam bir uygulama gereksinimini karşılamak üzere oluşturuldu.</p>
        </section>

        <section id="contact" className="contact container">
          <h3>İletişim</h3>
          <form id="contactForm" onSubmit={handleSubmit}>
            <label>İsim
              <input name="name" type="text" required />
            </label>
            <label>E-posta
              <input name="email" type="email" required />
            </label>
            <label>Mesaj
              <textarea name="message" required></textarea>
            </label>
            <button type="submit" className="btn" disabled={sending}>{sending ? 'Gönderiliyor...' : 'Gönder'}</button>
            <p id="formStatus" className="status" aria-live="polite">{status}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">© 2026 Storm League Demo — Andry777912</div>
      </footer>
    </>
  )
}
