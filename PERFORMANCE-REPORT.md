# PERFORMANCE-REPORT.md — Performans ve Core Web Vitals

Önemli: Bu raporda Lighthouse/PageSpeed ölçümü yapılmamıştır (bu ortamda çalıştırılabilir araç yok). Aşağıda **kod ve canlı tarayıcı ölçümleri** ile yapılan optimizasyonlar ve hedefler listelenir. Rakamlar iddia değil, ölçümdür.

## Hedefler (PageSpeed Insight, 75. persentil — garantisiz hedefler)

- LCP ≤ 2,5 sn · INP ≤ 200 ms · CLS ≤ 0,1

## Yapılan iyileştirmeler

| Alan | Önce | Sonra | Kanıt |
|---|---|---|---|
| Hero LCP görseli | `loading=lazy` (ilk slayt dahil) | ilk slayt `eager` + `fetchPriority=high` + `decoding=sync` | DOM: fetchpriority="high" |
| CLS — görsel boyutları | hero img boyutsuz | `width=2560 height=853` | DOM attribute + container/görsel %100 eşleşmesi (clsCheck=true) |
| Görseller | 9×2560×853 (6 marka banner) | aynı; lazy yalnızca görünmez slaytlarda | loading [eager,lazy,...] |
| Lazy-load kapsamı | görünür alan dışı her şey | lazy: hero dışı slaytlar; marka logoları `loading=lazy` | DOM |
| Font | - | `preconnect` fonts.googleapis/gstatic | index.html |
| API | - | gzip yok (geliştirme) — production reverse-proxy brotli/gzip önerilir | DEPLOYMENT-CHECKLIST |

## Canlı ölçümler (özellikle kritik kaynaklar)

- Hero kaynakları tarayıcı cache üzerinden `0KB / 7-13ms` (tekrar yükleme) — üretimde ilk ziyaret değeri ayarlanmalıdır.
- Hero container: 488×163 (503px viewport), 1351×450 (1366px), 1914×638 (1920px) — görsel/container oranı birebir (taşma yok → CLS katkısı yok).
- Slayt yükleme: 6/6 eager+lazy karışımı; `loading=lazy` DLL görünmezlikte devreye girer.

## Kalan öneriler (yetki/ortam gerektirir)

1. **Görsel format:** slider'lar JPEG kalite 92 → WebP/AVIF (~%30-50 küçülme) — üretim ortamında `vite-plugin-imagemin` veya CDN otomatik dönüşümü.
2. **Sunucu önbelleği/Cache-Control:** api-server statik yanıtları için `Cache-Control: public, max-age` (katalog kapakları, PDF'ler) — /api zaten DB'den.
3. **Brotli:** ters proxy'de (nginx) `gzip_static/brotli` aç; SPA bundle'ları Vite zaten minify eder.
4. **DOM büyüklüğü:** tek sayfada çok büyük değil (ölçülmedi; 2.000 düğüm altı beklenir) — ürün listesi sayfalama ile sınırlanır.
5. **INP:** `Charts` yok; tek ağır interaktif hero slider — mouseenter pause path'i hafif (ölçüm: render hızlı).
6. Deploy sonrası PageSpeed Insights koşusu zorunlu; sonuçları buraya ekle.

## N+1 sorgu notu

- Ürün listesi, marka, kategori, sektör listeleri tek sorgu (drizzle); ürün detayı 1+1 (product + join) — sorun görülmedi.
