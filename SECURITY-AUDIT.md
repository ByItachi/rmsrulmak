# SECURITY-AUDIT.md — Güvenlik Bulguları, Riskler ve Düzeltmeler

Tarih: 16 Ekim 2026. Kapsam: api-server (Express), frontend (Vite SPA), Postgres (Docker).
Testler yalnızca yerel geliştirme ortamında yapıldı; production'da yıkıcı/işlem testi çalıştırılmadı.

## Düzeltilen bulgular

| # | Bulgu | Önem | Etkilenen | Düzeltme | Doğrulama |
|---|---|---|---|---|---|
| 1 | CORS `origin:true` (her origin yansıtılıyor) | Yüksek | src/app.ts | `CORS_ORIGINS` env allowlist; listede olmayan origin hata alır | curl: evil.example.com → 500/engel; localhost:5173 → 200 |
| 2 | Güvenlik başlıkları yok | Yüksek | api-server | `middlewares/securityHeaders.ts` | curl -I: X-Content-Type-Options, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy, COOP (same-origin-allow-popups) görüldü |
| 3 | Global rate limit yok (form spam/brute force) | Orta | api-server | `middlewares/rateLimit.ts`: genel 60sn/180; form yazma uçları 10dk/10 | 429 + Retry-After mantığı kodda; davranış test edildi (limit altı 200) |
| 4 | JSON/URL body boyut sınırı yok | Düşük | src/app.ts | `express.json/urlencoded` limit 256kb | - |
| 5 | Admin/b2b panelleri robots'a açıktı | Orta | public/robots.txt | /admin, /b2b/, /yonetim/, /api/ Disallow | robots.txt içeriği doğrulandı |
| 6 | Session cookie güvenli değildi mi? | - | routes/auth.ts | İnceleme: zaten `httpOnly, secure, sameSite:lax, maxAge` **doğru** | Değişiklik gerekmedi |

## İncelenip doğru bulunanlar (değişiklik yok)

- **Auth:** OIDC PKCE + state/nonce; `catalogAdmin` email allowlist (CATALOG_ADMIN_EMAILS); admin uçları `requireCatalogAdmin` — 401/403 ayrımı.
- **SQL:** Tüm erişim Drizzle ORM parametreli (`eq`, `asc`, `count`) — dinamik SQL yok.
- **XSS:** React default escape; kullanıcı içeriği (`dangerouslySetInnerHTML`) sitede kullanılmıyor (grep ile doğrulandı).
- **CSRF:** Form uçları POST + SameSite=Lax; stateful oturum çerez + origin kontrolü CORS ile.
- **Hata sayfaları:** Express dev dışında stack trace dönmez (prod binary); /api/healthz 404 → `{"status":"ok"}`.

## Production'a geçişte zorunlu (DEPLOYMENT-CHECKLIST.md ile senkron)

- **HSTS:** HTTPS doğrulandıktan SONRA `Strict-Transport-Security: max-age=31536000; includeSubDomains` (varsayılan olmadan açılmaz).
- **CSP:** Yalnızca ölçüm ID'leri (GA4/GTM/Pixel) netleşince `frame-ancestors 'none'` dahil bir CSP şeması test edilir; önce mevcut konsol hataları ve font/CDN source-listesi derlenir.
- **Secret yönetimi:** DB parolası, CATALOG_ADMIN_EMAILS, OIDC sırları environment'tan gelir (ENV-EXAMPLE'da placeholder). Kaynak kodda sır yok (denetlendi).
- **Bağımlılık taraması:** `pnpm audit` CI'ye eklenmeli; bu turda çalıştırılmadı.
- **Yedekleme:** Docker volume (novapanel dahil ayrı container) için pg_dump cron önerilir.

## Risk/kabul

- Rate limit store bellek içi: çoklu replika deployment'da Redis'e taşınmalı (düşük öncelik).
- Dosya yükleme: yönetim panelinde dosya yükleme akışı yoktur (yoksa risk yok).
