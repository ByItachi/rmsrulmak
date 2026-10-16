# ADMIN-CMS-MODULES.md — RMS Rulmak Admin/CMS Modül Kılavuzu

Tarih: 16 Ekim 2026
Kapsam: `/admin` altındaki tüm yönetim modülleri — erişim, veri kaynağı ve kullanım.

## Erişim

- Herkes `/admin`'e erişebilir; **içerik yalnızca oturum açmış yöneticilere açılır**.
- Yönetici tespiti: `CATALOG_ADMIN_EMAILS` (virgülle ayrılmış) + `users.role`.
- Giriş: OIDC SSO (`/api/login` → Replit OIDC → callback).

## Modüller

### 1. Genel Bakış (`/admin`)
- **8 KPI kartı**: Ürünler, Markalar, Sektörler, Blog, Sliderlar, Yeni mesajlar (vurgulu), Ürün talepleri, Kategoriler
- **Bar grafiği**: Son 6 ay iletişim mesajları (canlı `summary` API'si)
- **Gelen kutusu**: Son 5 mesaj + durum rozetleri
- Kullanıcı header: avatar (OIDC profili), isim, e-posta, çıkış

### 2. Hero Sliderlar (`/admin/sliders` PİLOT)
- Yeni slider: görsel URL, başlık, alt başlık, link, sıra, yayın durumu
- Önizleme: seçili slider'ın marka sayfasına yönlendirir

### 3. Blog Yazıları (`/admin/posts`)
- Liste + oluştur/düzenle/sil; başlık, slug, içerik, kapak, kategori, yayın durumu

### 4. Markalar (`/admin/brands`)
- Logo yükleme (URL veya `/api/media`), slug, açıklama, web sitesi

### 5. Kategoriler (`/admin/categories`)
- Adı, slug, açıklama, sıra

### 6. Ürünler (`/admin/products`)
- Ad, slug, açıklama, marka FK, kategori FK, görsel URL, öne çıkan durumu

### 7. Sektörler (`/admin/sectors`)
- Ad, slug, açıklama, görsel, ikon

### 8. Site Bölümleri (`/admin/sections`)
- `page`, `key`, `label`, `value` (JSON) — istatistikler, hero metinleri, misyon/vizyon

### 9. Medya Kütüphanesi (`/admin/media`) — YENİ
- Çoklu dosya yükleme (PNG/JPG/WebP/SVG/GIF/PDF)
- Klasör filtreleri, başlık/ALT/düzenleme, `/api/media/<path>` URL'leri
- Tüm içerik tarafından kullanılabilir

### 10. Sayfalar (`/admin/pages`) — YENİ
- Slug + şablon (statik/tam genişlik/landing) + markdown içerik + SEO meta
- `/sayfa/:slug` adresinde yayınlanır; 409 çakışma koruması

### 11. İletişim Mesajları (`/admin/inquiries`)
- Yeni/Okundu/Yanıtlandı filtreleri; durum değiştirme; `mailto:` yanıt

### 12. Yönlendirmeler (`/admin/redirects`) — YENİ
- 301/302 kural oluşturma, aç/kapat, sil; 60 sn önbellek

### 13. Kullanıcılar (`/admin/users`) — YENİ
- Rol atama (super_admin/admin/editor/media_manager/viewer), pasifleştirme, son giriş

### 14. Site Ayarları (`/admin/settings`)
- **Genel**: site adı, slogan, telefon, e-posta, adres
- **SMTP**: sunucu, port, kullanıcı, şifre, gönderen
- **SEO & GSC**: doğrulama kodu, meta başlık/açıklama
- **Entegrasyonlar**: GA4 ID, GTM ID, Meta Pixel ID
- **Tema**: primary/foreground/background/accent renkleri → anında CSS uygulanır

### 15. Güvenlik & Audit (`/admin/audit`)
- Admin işlem kayıtları (kim, ne zaman, hangi uç)

## API Uçları Özeti

| Grup | Uç |
|---|---|
| Public içerik | GET `/sectors`, `/posts`, `/posts/:slug`, `/sliders`, `/site-sections`, `/pages/:slug` |
| Admin CRUD | `/admin/{brands,categories,products,sectors,posts,sliders,site-sections,media,pages,redirects,users,inquiries,settings}` |
| Özet | GET `/admin/summary` (KPI + grafik + son mesajlar) |
| Audit | `/admin/audit-logs` |
