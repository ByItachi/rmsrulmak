# SEARCH-CONSOLE-SETUP.md — Google Search Console Kurulum ve İzleme

Site kodu tarafı hazırlandı; hesap işlemleri erişim gerektirir ve bugün tamamlanmamıştır (iddia edilmez).

## Kod tarafında hazır olanlar

- `public/sitemap.xml` — 30 URL (hepsi test edilmiş, 200 dönen; admin/panel dahil değil).
- `public/robots.txt` — sitemap referansı + hassas alanlar kapalı.
- Per-page canonical (Seo bileşeni).
- Gigabayt üzeri: `VITE_SITE_URL` env ile production domain (varsayılan https://www.rmsrulmak.com).

## Kurulum adımları (kullanıcı/hesap gerektirir)

1. **Etki alanı doğrulama:** search.google.com/search-console → "searchconsole.google.com" → Alan adı: `rmsrulmak.com` (DNS TXT) veya URL öneki `https://www.rmsrulmak.com/` (HTML dosyası/meta).
   - HTML dosyası yöntemi: doğrulama dosyasını `public/` içine koy; Vite statik servis eder.
   - Meta yöntemi: `<meta name="google-site-verification" content="...">` → `index.html` head'e ekle.
2. **Sitemap gönderimi:** /sitemap.xml adresini Search Console → Sitemaps'e ekle.
3. **İzleme rutini:**
   - "Sayfa dizine eklenmedi" — canonical/robots kontrolü; admin altı sayfaların noindex olduğunu teyit et.
   - "Mobil kullanılabilirlik" yerine Core Web Vitals raporu (küçük ekran/ortalama olarak izlenir).
   - 404, yönlendirme zincirleri, sunucu hataları (5xx) her hafta taranır.
   - Manuel işlemler ve güvenlik sorunları → Security & Manual Actions'e bak.

## İndeksleme kontrol listesi (canlıda doğrulandı)

- [x] robots.txt: admin/b2b/yonetim/api kapalı; CSS/JS açık.
- [x] Sitemap: yalnızca indekslenebilir URL'ler (30 URL, 200 yanıt).
- [x] Canonical: her rota için tekil, domain mutlak.
- [x] `noindex` panellerde (admin/b2b/yonetim) — tarayıcıda doğrulandı.
- [ ] hreflang — çok dilli sürüm olmadığı için geçerli değil.
- [x] JSON-LD geçerli JSON (parse edildi; tipler doğrulandı).

## Sık yapılan hatalar

- oğul domain `www`/non-www karışıklığı: canonical her zaman `https://www.rmsrulmak.com` bazlı; HTTP→HTTPS ve www yönlendirmesi deployment tarafında (nginx/Vercel) tanımlanmalı.
- SPA'da eski hash yönlendirmeleri: sunucuda 301 birebir kuralları DEPLOYMENT-CHECKLIST.md'de.
