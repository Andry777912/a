# Storm League — Demo Uygulama

Bu depo, https://stormleague.gt.tc/ adresine benzeyen basit bir ön yüz demo uygulamasıdır. Hedef: hızlıca çalışır bir statik site sağlamak ve GitHub Pages ile yayınlamak.

İçerikler
- `index.html` — Ana sayfa (hero, özellikler, iletişim formu)
- `styles.css` — Tasarım stilleri
- `script.js` — İletişim formu doğrulama + localStorage demo

Nasıl çalıştırılır (yerel)
1. Depoyu klonlayın: `git clone https://github.com/Andry777912/a.git`
2. Dizine girin: `cd a`
3. Basit bir statik sunucu ile çalıştırın:
   - Python 3: `python -m http.server 8000`
   - Node: `npx serve .`
4. Tarayıcıda `http://localhost:8000` açın.

GitHub Pages ile yayınlama
1. Repoda `main` dalında `index.html` olduğu için GitHub Pages kullanımına uygundur.
2. GitHub'da repoya gidin: Settings → Pages → Source bölümünden "Branch: main / / (root)" seçin ve Save yapın.
3. Yayın URL'si genelde: `https://Andry777912.github.io/a/` olacaktır. (Yayınlama sırasında birkaç dakika sürebilir.)

Özel alan adı (isteğe bağlı)
- Özel alan adı (örneğin `stormleague.gt.tc`) kullanmak isterseniz, DNS'de `CNAME` kaydı ile `Andry777912.github.io`'ya yönlendirme yapın; ardından repo köküne `CNAME` dosyası ekleyin veya Pages ayarlarında alan adını girin.

Form davranışı ve gizlilik
- Şu an iletişim formu sadece tarayıcı `localStorage`'a kaydeder; veriler sunucuya gönderilmez.
- Gerçek e-posta bildirimleri veya veritabanı isterseniz Formspree/Netlify/Vercel serverless veya bir backend ekleyebilirim.

Gelecek adımlar (ben yapabilirim)
- GitHub Pages yayını otomatik olarak kontrol edip size canlı URL gönderebilirim.
- Formu Formspree veya serverless ile gerçek e-posta alacak şekilde entegre edebilirim.
- İsterseniz stormleague.gt.tc için `CNAME` dosyasını ekleyip DNS yapılandırma adımlarını yönlendirebilirim.

İletişim
- Bu depoyu ben (Copilot) sizin için hazırladım. Daha fazla değişiklik isterseniz kısa komutlarla söyleyin (ör. "Formu e-posta ile bağla", "Dark temayı değiştir", "Admin panel ekle").
