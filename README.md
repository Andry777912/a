# Storm League — Fullstack Demo (Next.js + Prisma + SQLite)

Bu repo, statik demo yerine tam bir uygulama istenince hızlıca deploy edilebilecek bir başlangıç uygulamasıdır.

Özellikler
- Next.js (pages router) + API routes
- SQLite + Prisma ORM (mesaj kaydı)
- Basit admin sayfası: /admin (parola ile erişip mesajları görebilirsiniz)

Hızlı başlatma (yerel)
1. Node.js (16/18) yüklü olsun.
2. Depoyu klonlayın: git clone https://github.com/Andry777912/a.git
3. Dizine girin: cd a
4. Paketleri yükleyin: npm install
5. Prisma Client oluşturun: npx prisma generate
6. Veritabanını oluşturun: npx prisma db push
7. Ortam değişkeni ayarlayın: kopyalayın .env.example -> .env ve ADMIN_PASS değerini değiştirin.
8. Geliştirme sunucusunu başlatın: npm run dev
9. Tarayıcıda http://localhost:3000 açın.

Deployment
- Vercel ile kolayca deploy edebilirsiniz (GitHub bağlantısı). Vercel'de Environment Variable olarak ADMIN_PASS ekleyin.
- Özel alan adı bağlamak isterseniz DNS'de yönlendirme yapıp Vercel ayarlarından domain ekleyin.

Notlar
- Bu demo üretim güvenliği ve ölçeklenebilirlik için ek konfigürasyon gerektirir. SQLite küçük projeler/PoC için uygundur.
