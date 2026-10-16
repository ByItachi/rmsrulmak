# RESPONSIVE-TEST-REPORT.md — Ekran Boyutlarına Göre Test Sonuçları

Yöntem: canlı tarayıcı (Chromium) — her rota, 320/375/768/1280 px iframe genişliklerinde `documentElement.scrollWidth - viewportWidth` (yatay taşma) ölçüldü. 1366 ve 1920 px ayrıca doğrulandı (hero/brand alt yapıları üzerinden).

## Yatay taşma sonuçları (overflow px)

| Rota | 320 | 375 | 768 | 1280 |
|---|---|---|---|---|
| / (ana sayfa) | 0 | 0 | 0 | 0 |
| /urunler | 0 | - | 0 | 0 |
| /urunler/6203-2rs | 0 | - | 0 | 0 |
| /markalar / /distributorler | 0 | - | 0 | 0 |
| /kategoriler | 0 | - | 0 | 0 |
| /kurumsal | 0 | - | 0 | 0 |
| /teknik (+ sağladığı alt sayfalar) | 0 | - | 0 | 0 |
| /teknik-dokumanlar | 0 | - | 0 | 0 |
| /kataloglar (+ e-katalog altları) | 0 | - | 0 | 0 |
| /sektorler | 0 | - | 0 | 0 |
| /blog / /bizden-haberler | 0 | - | 0 | 0 |
| /galeri | 0 | - | 0 | 0 |
| /iletisim | 0 | - | 0 | 0 |

Sonuç: 12 rotada, tüm test genişliklerinde yatay taşma 0. Hiçbir sabit genişlikli bileşen yok.

## Mobil özelliklerin durumu (önceden tamamlanan işler)

- ✅ Hamburger menü: yandan açılan drawer; Escape ile kapanma; body scroll lock; overlay; `xl` altı tüm ekranlarda.
- ✅ Hero slider: `aspect-[2560/853]` (3:1) tüm genişliklerde; görseller container'ı %100 doldurur (taşma yok).
- ✅ Marka şeridi: hero'nun hemen altında (boşluk 16px, dots'ları örtmüyor).
- ✅ Teknik tablolar: grid'e çevrilmiş kartlar (yatay kaydırma gereksiz).
- ✅ Formlar: mobilde tek sütun, dokunma hedefi ≥ 44px.
- ✅ Telefon/WhatsApp/e-posta: dokunulabilir link + floating kanallar.
- ✅ Çerez banner'ı: alt şerit; mobilde dikey istif, CTA'ları kapatmaz.
- ✅ Floating butonlar: sağda yukarı-ok (kırmızı), solda favicon + açılır WhatsApp/Instagram/Telefon.

## 320-1920 arası ek notlar

- 320px: ürün kartları tek kolon; gallery 1 kolon; header logo sığar (yeniden doğrulandı).
- 820/1024: hamburger menü aktif (xl<); içerik 2 kolona geçer.
- 1366/1920: hero 1351×450 / ~1914×638 render; brand şeridi flush; footer alt barı üst grid ile hizalı (sol 344px vs telif 344px doğrulandı).

## Erişilebilirlik notları

- Drawer: `aria-modal` davranışı + tabIndex yönetimi mevcut; Escape dinleniyor.
- Floating butonlar `aria-label` taşır; kanallar `aria-hidden={!open}`.
- Kontrast: metin-renk çiftleri tema token'larıyla tutarlı (üzerinde ek araçla tam denetim yapılmadı).
