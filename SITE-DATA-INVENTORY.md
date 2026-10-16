# SITE-DATA-INVENTORY — RMS Rulmak Admin Panel Veri Envanteri

_Tarih: 2026-10-16 · İnceleyen: Sistem geneli tarama (kaynak kod + veritabanı + dosya sistemi + canlı API)_

Bu envanter, sitedeki yönetilebilir her veri türünün **kaynak konumunu**, **veritabanı tablosunu**, **admin modülünü** ve **aktarım durumunu** belgeler.

---

## 1. Kimlik ve Tanıtım Verileri

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Site adı | sabit ("RMS Rulmak"), App.tsx Logo alt | `settings.site_name` | Site Ayarları → Genel | ✅ aktarıldı |
| Site sloganı/tagline | App.tsx Footer sabit | `settings.site_tagline`, `settings.footer_tagline` | Site Ayarları → Genel | ✅ aktarıldı |
| Meta başlık/description | App.tsx Router sabit | `settings.meta_title`, `settings.meta_description` | Site Ayarları → SEO | ✅ aktarıldı |
| Logo (kırmızı/beyaz/ikon) | `/brand/rulmak-*.png` statik | — (sabittleştirilmiş varlık) | — | ⚠️ statik dosya, admin'den değiştirilemez |
| Favicon | `/favicon.ico`, `/brand/rulmak-icon-red.png` | — | — | ⚠️ statik dosya |

## 2. İletişim Bilgileri

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Telefon | App.tsx Contact/Footer sabit `+90 216 392 41 41` | `settings.contact_phone` | Site Ayarları → Genel | ✅ aktarıldı |
| E-posta | App.tsx sabit `info@rmsrulmak.com` | `settings.contact_email` | Site Ayarları → Genel | ✅ aktarıldı |
| Adres | App.tsx sabit (Tuzla) | `settings.contact_address` | Site Ayarları → Genel | ✅ aktarıldı |
| WhatsApp | App.tsx FloatingActions sabit `+90 501 062 40 41` | `settings.contact_whatsapp` | Site Ayarları → Genel | ✅ aktarıldı |
| Çalışma saatleri | App.tsx Contact sabit | `settings.contact_working_hours` | Site Ayarları → Genel | ✅ aktarıldı |
| Google Maps adres/embed | App.tsx `contactMap*` sabit | `settings.contact_map_query` | Site Ayarları → Genel | ✅ aktarıldı |

## 3. Navigasyon ve Menüler

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Ana menü öğeleri (6) | App.tsx `navItems` sabit | — (route replikası) | — | ⚠️ kodda, yönetilemez |
| Kurumsal alt menü (7) | App.tsx `kurumsalMenu` sabit | — | — | ⚠️ kodda |
| Teknik alt menü | App.tsx `teknikMenu` sabit | teknik konular kodda | — | ⚠️ kodda |
| B2B butonu/URL/label | App.tsx sabit `b2brulmak.com` | `settings.b2b_url`, `settings.b2b_label` | Site Ayarları → Genel | ✅ aktarıldı |
| Footer link grupları | App.tsx Footer sabit | — | — | ⚠️ kodda |

## 4. Sosyal Medya

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Instagram | App.tsx Footer sabit | `settings.social_instagram` | Site Ayarları → Genel | ✅ aktarıldı |
| Facebook | App.tsx Footer sabit | `settings.social_facebook` | Site Ayarları → Genel | ✅ aktarıldı |
| LinkedIn | App.tsx Footer sabit | `settings.social_linkedin` | Site Ayarları → Genel | ✅ aktarıldı |
| YouTube | App.tsx Footer sabit | `settings.social_youtube` | Site Ayarları → Genel | ✅ aktarıldı |

## 5. Ana Sayfa Bölümleri

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Hero slider slaytları | `referenceSlides` kod + temp klasörden dosyalar | `sliders` (6 kayıt) | Admin → Hero sliderlar | ✅ aktarıldı |
| İstatistik sayıları | App.tsx `stats` sabit | `site_sections` (9 kayıt) | Admin → Site bölümleri | ✅ aktarıldı |
| Marka logosu şeridi | App.tsx + `/brand/reference/*` | `brands` (9 marka, logo_url) | Admin → Markalar | ✅ aktarıldı |
| Öne çıkan ürünler | App.tsx sabit liste | `products` (6 ürün) | Admin → Ürünler | ✅ aktarıldı |
| Blog teaser | App.tsx `posts` sabit (3) | `posts` (3 kayıt) | Admin → Blog yazıları | ✅ aktarıldı |
| Video bölümü | App.tsx sabit (self-host) | `site_sections` | Admin → Site bölümleri | ✅ aktarıldı |
| Destek CTA | App.tsx `SupportCta` sabit | — | — | ⚠️ kodda |

## 6. Katalog ve Teknik İçerik

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Marka katalogları (IDC 12, RBC 14…) | `e-katalog-data.ts` kod sabit | `catalogs` (0 kayıt) | — | ⚠️ kodda — DB'ye aktarılacak |
| Katalog PDF'leri | `public/catalog/*/pdf` statik | — | Medya Kütüphanesi | ⚠️ statik dosya + kod bağ |
| Teknik konular (8) | `technical.ts` kod sabit | — | — | ⚠️ kodda |

## 7. SEO ve Analitik Entegrasyonları

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| GA4 ID | env / kod sabit | `settings.ga4_id` | Site Ayarları → SEO | ✅ aktarıldı |
| GTM ID | env / kod | `settings.gtm_id` | Site Ayarları → SEO | ✅ aktarıldı |
| Meta Pixel | env / kod | `settings.meta_pixel_id` | Site Ayarları → SEO | ✅ aktarıldı |
| Google Search Console doğrulama | env / index.html | `settings.gsc_verification` + `gsc_sitemap` | Site Ayarları → SEO | ✅ aktarıldı |
| Per-page SEO (title/description) | `seo-routes.ts` kod | `settings` global + `pages.seo_title` | Sayfalar | ✅ kısmen |
| JSON-LD şemaları | `seo-schema.ts` kod | — | — | ⚠️ kodda |

## 8. Tema

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Primary/background/foreground/accent | Tailwind sabit | `settings.theme_*` (5) | Site Ayarları → Tema | ✅ aktarıldı + canlıya uygulanıyor |

## 9. İçerik Modülleri (CRUD)

| Veri | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|
| Ürünler | `products` (6) | Admin → Ürünler | ✅ CRUD |
| Kategoriler | `categories` (4) | Admin → Kategoriler | ✅ CRUD |
| Markalar | `brands` (9) | Admin → Markalar | ✅ CRUD |
| Sektörler | `sectors` (8) | Admin → Sektörler | ✅ CRUD |
| Blog yazıları | `posts` (3) | Admin → Blog yazıları | ✅ CRUD |
| Sliderlar | `sliders` (6) | Admin → Hero sliderlar | ✅ CRUD |
| Site bölümleri | `site_sections` (9) | Admin → Site bölümleri | ✅ CRUD |
| Statik sayfalar | `pages` (1 test) | Admin → Sayfalar | ✅ CRUD |
| Medya dosyaları | `media` (1 test) + disk | Admin → Medya kütüphanesi | ✅ CRUD |
| Yönlendirmeler | `redirect_rules` (1) | Admin → Yönlendirmeler | ✅ CRUD |
| İletişim mesajları | `contact_messages` (0) | Admin → İletişim mesajları | ✅ okuma/durum |
| Kullanıcılar/roller | `users` (1) | Admin → Kullanıcılar | ✅ rol/aktif |
| Audit log | `audit_logs` (0) | Admin → Güvenlik & audit | ✅ okuma |

## 10. Yasal Sayfalar ve Çerez

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Gizlilik/Kullanım/KVKK/Çerez metinleri | App.tsx `PolicyPage` sabit | — | — | ⚠️ kodda — `pages` tablosuna taşınabilir |

## 11. İletişim Formu (çoğu yönetilebilir)

| Veri | Kaynak (eski) | DB Tablosu | Admin Modülü | Durum |
|---|---|---|---|---|
| Form alanları | App.tsx form sabit | — | — | ⚠️ kodda |
| KVKK onay metni | App.tsx sabit | — | — | ⚠️ kodda |

---

## Eksik / Kalanlar

1. **Menü/navigasyon yapılandırması** — menüler kodda sabit; DB `menu_items` tablosu olmadığı için admin'den değiştirilemiyor. (Öneri: ayrı sprint)
2. **Katalog/teknik konu içeriği** — e-katalog katalog önizlemesi `e-katalog-data.ts` kodunda; DB `catalogs` tablosu şema olarak hazır ama doldurulmadı.
3. **Yasal sayfa metinleri** — PolicyPage metinleri kodda; `pages` tablosuna taşınıp `/sayfa/:slug` üzerinden yayınlanabilir.
4. **Logo/favicon değişimi** — statik dosya; medyaya taşınıp `settings.site_logo` olarak bağlanabilir.
5. **SMTP ayarları** — DB'de saklanıyor ancak e-posta gönderim kodu (nodemailer vs.) henüz yok.

## Doğrulanmış Uçtan Uca Akışlar (bu tur)

- ✅ Footer (telefon, e-posta, adres, sosyal, tagline) → admin değişikliği → site yansıması (canlı doğrulandı)
- ✅ Header B2B butonu (URL + label) → admin → site (canlı doğrulandı)
- ✅ İletişim sayfası (adres, telefon, WhatsApp, harita, çalışma saatleri) → admin → site (canlı doğrulandı)
- ✅ Tema renkleri → admin → CSS custom properties (canlı doğrulandı)
- ✅ Public settings API 26 anahtar döndürüyor (canlı doğrulandı)
