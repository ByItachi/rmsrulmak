# SEO-AUDIT.md — RMS Rulmak Teknik SEO Denetimi ve Uygulanan Düzeltmeler

Tarih: 16 Ekim 2026
Kapsam: `artifacts/rms-rulmak-platform` (Vite + React + wouter SPA), `artifacts/api-server` (Express + Drizzle), PostgreSQL (Docker, port 15433).

## Denetim Özeti (uygulananlar)

| Bulgu | Önem | Durum | Değişiklik |
|---|---|---|---|
| Sayfa başına özgün meta yok (yalnızca index.html'de tek set) | Yüksek | ✅ Düzeltildi | `src/lib/seo.tsx` (Seo bileşeni) + `src/lib/seo-routes.tsx` (20+ rota eşlemesi, başlık/açıklama) |
| Canonical yok | Yüksek | ✅ Düzeltildi | `Seo` her rotada `link[rel=canonical]` üretir; index.html'de home canonical |
| Admin/B2B panelleri indekslenebilirdi | Kritik | ✅ Düzeltildi | `/admin`, `/b2b/*`, `/yonetim/*` için `noindex, nofollow` (canlıda doğrulandı) |
| robots.txt yalnız `Allow:` içeriyordu | Yüksek | ✅ Düzeltildi | /admin, /b2b/, /yonetim/, /api/ kapalı; Sitemap satırı eklendi |
| Sitemap yok | Yüksek | ✅ Düzeltildi | `public/sitemap.xml` — 30 URL (yalnızca indekslenebilir, 200 dönen sayfalar) |
| Structured data yok | Yüksek | ✅ Düzeltildi | `src/lib/seo-schema.ts`: home→Organization+WebSite+LocalBusiness; ürün→Product; alt sayfalar→BreadcrumbList (JSON-LD, `data-seo-jsonld`) |
| Open Graph / Twitter eksikti | Orta | ✅ Düzeltildi | index.html + Seo bileşeni (og:*, twitter:*) |
| `lang="tr"` yoktu | Düşük | ✅ Düzeltildi | `<html lang="tr">` (varlığı doğrulandı) |
| Ürün görselleri boyutsuzdu (CLS riski) | Orta | ✅ Düzeltildi | Hero görsellerine `width=2560 height=853` |
| Görsel alt metinleri | Orta | ✅ Mevcut | Hero + ürün + marka görsellerinde anlamlı `alt` |
| Görsel breadcrumb (kullanıcıya görünür) | Orta | ⏳ Yapılmadı | JSON-LD Breadcrumb var; görsel breadcrumb henüz eklenmedi (Faz 8 sonrası önerilir) |
| hreflang (çok dilli) | Düşük | ⏳ Yok | Site yalnızca tr; dil sürümü eklenirse hreflang önerilir |

## Doğrulamalar (canlı, localhost:5173)

- Ana sayfa: title/description/canonical/og:url/og:image + JSON-LD tipleri `[Organization, WebSite, LocalBusiness]`.
- Ürün `/urunler/6203-2rs`: canonical `https://www.rmsrulmak.com/urunler/6203-2rs`, JSON-LD `[BreadcrumbList, Product]`, title "6203 2RS Bilyalı Rulman | 6203-2RS — RMS Rulmak".
- `/admin`: robots `noindex, nofollow`, title "RMS Rulmak — Yönetim Paneli".
- robots.txt 3 alt bölüm + sitemap satırı; /sitemap.xml HTTP 200.

## Yapılacaklar (erişim gerektirenler)

- Google Search Console: site doğrulaması + sitemap gönderimi (bkz. SEARCH-CONSOLE-SETUP.md).
- Görsel breadcrumb bileşeninin ürün/kategori sayfalarına eklenmesi.
