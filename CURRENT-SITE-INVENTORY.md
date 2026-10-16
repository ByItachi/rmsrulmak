# CURRENT-SITE-INVENTORY.md — RMS Rulmak Güncel Site Envanteri

Tarih: 16 Ekim 2026
Kapsam: Tüm sitenin güncel durumu — sayfalar, menüler, veri kaynakları ve üçüncü taraf servisler.

## Public Sayfalar (17 canlı rota)

| Rota | İçerik kaynağı | Durum |
|---|---|---|
| `/` (Anasayfa) | Hero slider (DB `sliders`), marka şeridi (DB `brands`), istatistikler (DB `site_sections`), öne çıkan ürünler (DB `products`), blog teaser (DB `posts`), video | ✅ Canlı |
| `/urunler` | DB `products` + `categories` | ✅ Canlı |
| `/urunler/:slug` | DB `products` (detay) | ✅ Canlı |
| `/markalar`, `/distributorler` | DB `brands` (directory) | ✅ Canlı |
| `/kategoriler` | DB `categories` (directory) | ✅ Canlı |
| `/kataloglar` + `/e-katalog` | Hardcoded katalog verisi + marka kapakları | ✅ Canlı |
| `/kataloglar/teknik/:brand` | Sabit marka katalog verisi (IDC/Gates/Dunlop/NTN/NSK/Timken/Schaeffler/Koyo/RBC) | ✅ Canlı |
| `/kataloglar/katalog/:slug` | Sabit katalog + PDF flipbook (IDC gerçek PDF'ler) | ✅ Canlı |
| `/sektorler` | DB `sectors` | ✅ Canlı |
| `/kurumsal` | Hardcoded + `site_sections` (misyon/vizyon), tarihçe yol haritası | ✅ Canlı |
| `/teknik` + `/teknik/:slug` | Hardcoded teknik konular (9 hesap aracı) | ✅ Canlı |
| `/blog`, `/bizden-haberler` | DB `posts` | ✅ Canlı |
| `/galeri` | DB `sliders` (görseller) | ✅ Canlı |
| `/iletisim` | Form → DB `contact_messages`; harita embed | ✅ Canlı |
| `/sayfa/:slug` | DB `pages` (admin oluşturulan statik sayfalar) | ✅ Canlı |
| `/gizlilik-politikasi`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` | Sabit metin | ✅ Canlı |
| 404 | Site stilli, "Ana sayfaya dön" CTA | ✅ Canlı |

## Admin Paneli (14 modül)

Genel bakış (dashboard + grafik + gelen kutusu), Hero sliderlar, Blog, Markalar, Kategoriler, Ürünler, Sektörler, Site bölümleri, Medya kütüphanesi, Sayfalar, İletişim mesajları, Yönlendirmeler, Kullanıcılar, Site ayarları (Genel/SMTP/SEO/Entegrasyonlar/Tema), Güvenlik & Audit.

## B2B Paneli

`/b2b/giris`, `/b2b/kayit`, `/b2b/panel` (dashboard + ürün kataloğu + teknik destek bağlantısı).

## Üçüncü Taraf Servisleri

| Servis | Yapılandırma | Kaynak |
|---|---|---|
| Google Analytics 4 (GA4) | `ga4_id` | DB `settings` (admin paneli) |
| Google Tag Manager | `gtm_id` | DB `settings` (admin paneli) |
| Meta Pixel | `meta_pixel_id` | DB `settings` (admin paneli) |
| Google Search Console | `gsc_verification` meta | DB `settings` (admin paneli) |
| Google Maps embed | `/iletisim` | Sabit embed URL |
| WhatsApp / Instagram / Telefon | Sabit yüzen butonlar | App.tsx |
| SMTP | `smtp_*` anahtarları | DB `settings` (admin paneli) |

## Statik Varlıklar

- Marka logoları: `/brand/reference/{slug}-logo.jpg` (9 marka, 1000×300)
- Hero slider görselleri: `/hero/slide-*.jpg|png` (6 marka banner'ı, 2560×760)
- Katalog kapakları: `/brand/reference/*.jpg` + `/catalog/**/covers/*.png`
- Katalog PDF'leri: `/catalog/idc/pdf/*.pdf` (12 gerçek IDC kataloğu), kısmen diğer markalar
- Site logosu: `/brand/rulmak-red.png`, `/brand/rulmak-white.png`, `/brand/rulmak-icon-red.png`
