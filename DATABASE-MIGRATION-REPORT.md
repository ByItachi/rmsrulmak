# DATABASE-MIGRATION-REPORT — Sabit kodlu verilerin DB'ye taşınması

Kapsam: Önceki turlarda kodda sabit duran içeriklerin PostgreSQL'e aktarılması ve frontend'in merkezi kaynağa bağlanması.
Ölçüm: 2026-10-16, canlı API + DB sorgularıyla doğrulandı.

## Aktarılan içerikler (kod → tablo)

| İçerik | Eski konum (hardcoded) | Yeni tablo | Frontend bağlantısı | Durum |
|---|---|---|---|---|
| Ana menü + Kurumsal/Teknik alt menüler | `navItems`, `kurumsalMenu`, `teknikMenu` sabitleri | `menus` + `menu_items` (24 kayıt) | `usePublicMenus()` → Header (fallback korunur) | ✅ canlı |
| Footer Keşfet/Kurumsal sütunları | Footer JSX'i | `menus` (footer-explore, footer-corporate) | `usePublicMenus()` | ✅ |
| İletişim bilgileri (telefon, e-posta, adres, harita) | Footer/Contact JSX | `settings` (contact_*) | `GET /api/settings/public` | ✅ canlı |
| Sosyal medya linkleri (Instagram, Facebook, LinkedIn, YouTube) | Footer JSX | `settings` (social_*) | Footer ikonları DB'den | ✅ canlı |
| B2B linki, WhatsApp mesaj metni, çalışma saatleri | Footer JSX | `settings` | Footer | ✅ canlı |
| Hero slider görselleri + başlıklar | `heroSlides` sabiti | `sliders` (6 kayıt) | `GET /api/sliders` | ✅ canlı |
| İstatistik sayaçları (740+, 1.2M+, 850+, 60+) | Home JSX | `site_sections` (istatistik grubu) | `GET /api/site-sections` | ✅ canlı |
| Yasal metinler (KVKK, gizlilik, çerez, kullanım) | Düz 404/ingilizce kart | `pages` (4 kayıt, markdown) | `DbPolicyPage` + `/api/pages/:slug` (200) | ✅ canlı |
| Hakkımızda sayfası | yok (sabit bölüm) | `pages` (hakkımızda) | `/sayfa/hakkimizda` + StaticPage | ✅ |
| Tema renkleri (5 token) | Tailwind sabitleri | `settings` (theme_*) | `applySiteTheme` → CSS değişkenleri | ✅ canlı |
| SEO meta + GSC doğrulaması | index.html | `settings` (meta_*, gsc_verification) | `document.title`/meta enjeksiyonu | ✅ canlı |
| Analytics kimlikleri (GA4/GTM/Pixel) | yok | `settings` (ga4_id, gtm_id, meta_pixel_id) | `initAnalytics` | ✅ |
| SMTP ayarları | yok (e-posta gönderilemezdi) | `settings` (smtp_*) | nodemailer → form bildirimleri | ✅ MailHog ile test edildi |
| PDF katalog arşivi | dosya sistemi + sabit liste | `catalogs` (53 kayıt) | `/kataloglar/*` sayfaları | ✅ canlı |

## Doğrulama kanıtları

- `GET /api/menus` → 3 menü, 24 öğe; Kurumsal 7, Teknik 9 alt öğe canlı döndü.
- `GET /api/pages/gizlilik-politikasi` → 200; `/cerez-politikasi` vb. rotalar çalışıyor.
- `POST /api/contact-messages` → 201 + nodemailer → MailHog teslimi doğrulandı (subject: "Yeni iletişim mesajı #1 — SMTP Test Kullanıcısı").
- Kayıt sayıları öncesi/sonrası karşılaştırması: mevcut 9 marka/6 ürün/4 kategori/8 sektör/3 yazı korunmuş, üzerine menü+sayfa+ayar katmanı eklendi; hiçbir kayıt silinmedi veya değiştirilmedi.

## Bilinen sınırlar

- Header fallback: API kapalıysa son hardcoded liste devreye girer (kullanıcı talebiyle korunuyor; "kontrolsüz sabit" değil, dayanıklılık yedekleri).
- `site_sections` hero grubu Home'da kullanılıyor; kurumsal sayfanın misyon/vizyon blokları hâlâ JSX içinde (1 bölüm kaldı — SABİT İÇERİK backlog'u).
