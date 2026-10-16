# DATABASE-INVENTORY — RMS Rulmak PostgreSQL

Bağlantı: `postgresql://rulmak:***@localhost:15433/rms_rulmak` (Docker konteyneri `rms-rulmak-postgres`, postgres:16-alpine)
Yedek: `pg_dump -Fc` → `.backups/` (bkz. BACKUP-RESTORE.md)
Ölçüm tarihi: 2026-10-16 (canlı sorguyla doğrulandı)

## Tablo envanteri (18 tablo, gerçek kayıt sayıları)

| Tablo | Kayıt | İçerik | Admin modülü |
|---|---|---|---|
| brands | 9 | Markalar (IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler, Koyo, RBC) + logo_url | /admin/brands |
| categories | 4 | Ürün kategorileri (rulman, kayış-kasnak vb.) | /admin/categories |
| products | 6 | Ürünler; code/slug/marka+kategori FK | /admin/products |
| sectors | 8 | Sektörler (ikon+açıklama) | /admin/sectors |
| posts | 3 | Blog yazıları (slug, içerik, yayın durumu) | /admin/posts |
| sliders | 6 | Ana sayfa hero slider'ları (görsel, başlık, CTA, sıra) | /admin/sliders |
| site_sections | 9 | İstatistik + hero + kurumsal metin bölümleri (page/key/label/body) | /admin/sections |
| settings | 32 | Site adı/iletişim/sosyal/B2B/harita/saatler/SEO/GA4/GTM/Meta Pixel/GSC/SMTP/tema/çerez | /admin/settings |
| pages | 5 | Statik sayfalar (markdown gövde + SEO meta): hakkımızda + 4 yasal metin | /admin/pages |
| menus | 3 | main, footer-explore, footer-corporate | /admin/menus |
| menu_items | 24 | Menü öğeleri (2 seviye; Kurumsal 7, Teknik 9 alt öğe) | /admin/menus |
| media_assets | 1 | Yüklenen dosyalar (base64→disk, title/alt/folder) | /admin/media |
| redirect_rules | 1 | 301/302 yönlendirme kuralları | /admin/redirects |
| users | 1 | OIDC girişli kullanıcılar (rol, aktif, son giriş) | /admin/users |
| contact_messages | 1 | İletişim formu kayıtları (durum: new/read/replied) | /admin/inquiries |
| product_requests | 0 | Ürün talep formları (boş — ilk taleple dolacak) | /admin/inquiries |
| catalogs | 53 | PDF katalog arşivi (marka/bölüm/başlık/kapak/pdf_url) | /yonetim/kataloglar |
| audit_logs | 0 | Güvenlik/denetim kayıtları (ilk işlemle dolacak) | /admin/audit |
| sessions | — | OIDC oturumları (sistem yönetir) | — |

## Frontend bağlantı haritası (veri → sayfa)

- **Header menüsü** ← `menus`/`menu_items` (`GET /api/menus`, fallback: kod içi liste)
- **Hero slider** ← `sliders` (`GET /api/sliders`)
- **İstatistik/hero/kurumsal metinler** ← `site_sections` (`GET /api/site-sections`)
- **Footer iletişim/sosyal/B2B/harita/saatler** ← `settings` (`GET /api/settings/public`)
- **Yasal sayfalar** ← `pages` (`GET /api/pages/:slug` → `/gizlilik-politikasi`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi`)
- **Tema renkleri** ← `settings` theme_* → CSS custom properties (`applySiteTheme`)
- **Analytics** ← `settings` ga4_id/gtm_id/meta_pixel_id/gsc_verification (head'e enjekte)
- **Katalog flipbook** ← `catalogs` + `public/catalog/*` PDF dosyaları
- **Marka/kategori/ürün/sektör/blog** ← ilgili tablolardan react-query ile

## Kalıntı / boş alanlar (dürüst liste)

- `product_requests` boş: henüz gerçek ürün talebi gelmedi; form uçtan uca çalışıyor (rate-limit'li).
- `audit_logs` boş: yalnızca admin mutasyonlarında doluyor; ilk admin işlemiyle kayıt oluşur.
- `media_assets` 1 test kaydı: `test-medya-*.png` silinebilir; üretim görselleri `public/brand` ve `public/catalog` altında dosya sistemi kaynaklı (envanteri MEDIA-LIBRARY-REPORT.md'de).
