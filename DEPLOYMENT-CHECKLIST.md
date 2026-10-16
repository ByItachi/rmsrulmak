# DEPLOYMENT-CHECKLIST.md — Production'a Güvenli Geçiş

## 1. Ön koşullar (doğrulanmış yerel durum)

- [x] `pnpm exec tsc --noEmit` her iki pakette 0 hata (son koşu).
- [x] API güvenlik katmanı aktif (headers, rate limit, CORS allowlist).
- [x] SEO katmanı aktif (canonical, noindex panellerde, sitemap, robots, JSON-LD).
- [x] Analitik + çerez izni kodda; kimlikler env'den gelir.
- [x] 12 rota × 320-1280px yatay taşma 0.

## 2. Ortam değişkenleri

`.env` dosyasını ENV-EXAMPLE'dan oluştur (sır içermez; placeholder alanlar doldurulur):
- `VITE_SITE_URL` (production domain), `VITE_GA4_ID`, `VITE_GTM_ID`, `VITE_META_PIXEL_ID`
- `DATABASE_URL`, `CORS_ORIGINS`, `CATALOG_ADMIN_EMAILS`, OIDC (`ISSUER_URL` vb.), `SESSION_TTL`
- Sırlar asla frontend bundle'a girmez; gauge anahtarları sunucu tarafında.

## 3. Build ve test

```bash
# api-server
cd artifacts/api-server && pnpm run build        # dist/index.mjs
# frontend
cd artifacts/rms-rulmak-platform && pnpm run build  # dist/
```
- Build sonrası `dist/` içindeki tüm critical rotalara HEAD/GET: 200, 404 sadece gerçek 404.
- `robots.txt`, `sitemap.xml` dist'e kopyalandığını doğrula (Vite public klasöründen kopyalar).

## 4. Sunucu / proxy

- HTTP→HTTPS 301; `www` ve `non-www` tek domain'e (canonical ile aynı).
- nginx/Vercel'de: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options DENY`, `Permissions-Policy`, COOP (api-server'da zaten var; proxy önünde tekrarlama ikilemi olmasın — biri yeterli).
- Brotli/gzip: assets + api JSON.
- Cache-Control: `dist/assets/*` bozulmaz hash → uzun ömürlü; `public/brand`, `public/hero`, `public/catalog` → 1 gün; `/api/*` → no-store.
- SPA fallback: tüm rotalar index.html'e (wouter istemci yönlendirmesi); `/api/*` proxy → 3000.

## 5. Postgres

- `docker run --name rms-rulmak-postgres -e POSTGRES_USER=rulmak -e POSTGRES_PASSWORD=... -e POSTGRES_DB=rms_rulmak -p 15433:5432 -v rms-rulmak-data:/var/lib/postgresql/data postgres:16-alpine`
- `DATABASE_URL=... pnpm -w run push --force` (schema).
- **Yedekleme:** `pg_dump` cron (Docker volume üzerinden). Geri dönüş: volume snapshot.

## 6. Production sonrası (erişim gerektirir)

- Search Console doğrulama + sitemap gönderimi (SEARCH-CONSOLE-SETUP.md).
- GA4/GTM/Pixel ID'leri doldur; GTM Preview + GA4 DebugView + Meta Test Events ile olay doğrulaması.
- HSTS header'ı HTTPS kesintisiz çalıştıktan sonra aktifleştir (önce sunucu tarafı, web'de "Secure" örneği test edilir).
- CSP şeması: gerçek script source-listesi (GA4/GTM/Pixel domains + kendi bundle) ile test edilir; `frame-ancestors 'none'`.
- PageSpeed Insights koşusu → PERFORMANCE-REPORT.md'ye ekle ve kalanlar için iyileştirme.

## 7. Geri dönüş planı

- Kod: önceki release commit'ine `git revert`/checkout; frontend statik olduğundan anında.
- DB: `pg_dump` snapshot geri yükle (push --force geri alınmaz — şema değişiklikleri commit + migration olarak saklanmalı; mevcut tablolar idempotent).
- API: yeni binary eski portla yazılamazsa port değiştirilip proxy güncellenir.

## 8. Son kontrol listesi

- [ ] `pnpm run build` ×2 (api + frontend)
- [ ] prod domain'de robots/sitemap 200
- [ ] tüm named rotalar insan tarafından tıklanabilir (menu, footer, floating)
- [ ] cookie banner ilk ziyarette görünür; Tümünü Kabul Et / Reddet / Tercihler çalışır
- [ ] GA4 DebugView'da page_view; Meta Test Events'te PageView
- [ ] HSTS + CSP (test edildikten sonra)
