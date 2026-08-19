// script.js — form handling for Storm League demo
(function(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  function showStatus(msg, ok = true){
    status.textContent = msg;
    status.style.color = ok ? '' : '#fda4af';
  }

  function validate(formData){
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    if(!name || !email || !message) return false;
    // simple email check
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;
    return true;
  }

  function saveMessage(data){
    try{
      const key = 'stormleague_messages';
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(Object.assign({ts: new Date().toISOString()}, data));
      localStorage.setItem(key, JSON.stringify(arr));
      return true;
    }catch(e){
      console.error('localStorage error', e);
      return false;
    }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fm = new FormData(form);
    if(!validate(fm)){
      showStatus('Lütfen tüm alanları doğru doldurun.', false);
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Gönderiliyor...';
    showStatus('');

    const payload = {
      name: fm.get('name').trim(),
      email: fm.get('email').trim(),
      message: fm.get('message').trim()
    };

    // Simulate a network/send delay then save to localStorage
    setTimeout(() => {
      const ok = saveMessage(payload);
      if(ok){
        showStatus('Mesajınız kaydedildi. Teşekkürler!');
        form.reset();
      }else{
        showStatus('Mesaj kaydedilemedi — tarayıcı izinlerini kontrol edin.', false);
      }
      btn.disabled = false;
      btn.textContent = 'Gönder';
    }, 700);
  });

  // Optional: restore last name/email if present
  (function restore(){
    try{
      const key = 'stormleague_last';
      const raw = localStorage.getItem(key);
      if(!raw) return;
      const last = JSON.parse(raw);
      if(last.name) form.elements['name'].value = last.name;
      if(last.email) form.elements['email'].value = last.email;
    }catch(e){/* ignore */}
  })();

  // Save last used name/email on blur
  ['name','email'].forEach(name => {
    const el = form.elements[name];
    if(!el) return;
    el.addEventListener('blur', () => {
      try{
        const key = 'stormleague_last';
        const raw = localStorage.getItem(key);
        const obj = raw ? JSON.parse(raw) : {};
        obj[name] = el.value;
        localStorage.setItem(key, JSON.stringify(obj));
      }catch(e){}
    });
  });
})();
