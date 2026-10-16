# KEYWORD-MAP.md — RMS Rulmak Anahtar Kelime Haritası

Tüm kümeler veritabanında doğrulanmış ürün/marka/sektör verisine dayanır. Uydurma distribütörlük ilişkisi yoktur.

## 1. Çekirdek (marka + ürün niyeti)

| Anahtar Kelime Kümesi | Arama Niyeti | Hedef Sayfa |
|---|---|---|
| rulman, rulman fiyat, rulman tedarikçisi | Ticari | /urunler, /iletisim |
| endüstriyel rulman, rulman çeşitleri | Bilgilendirme | /urunler, /kategoriler |
| bilyalı rulman, konik rulman, masuralı rulman | Ticari/Ürün | /kategoriler → ürün detayları |
| güç aktarım ürünleri, kayış kasnak | Ürün | /kategoriler, /urunler |
| V-kayış, endüstriyel kayış | Ürün | /urunler (Gates ürünleri) |
| rulman toptan, rulman bayi | Ticari | /iletisim, /kurumsal |

## 2. Marka kümesi (doğrulanmış distribütörlük — brands tablosu, 9 kayıt)

IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler, Koyo, RBC Bearings.
Her marka için: `"{marka} rulman"`, `"{marka} yetkili bayii"`, `"{marka} kayış"` → /markalar#slug + marka filtreli ürün listeleri.

## 3. Sektör kümesi (sectors tablosu, 8 kayıt)

Demir-çelik, madencilik, kâğıt, çimento, enerji, gıda, tekstil, otomotiv:
`"{sektör} rulman çözümleri"`, `"{sektör}" güç aktarım` → /sektorler#slug.

## 4. Teknik/intent kümesi (technicalTopics — 8 konu)

| İfade | Hedef URL |
|---|---|
| rulman ömrü hesabı | /teknik/rulman-omur-hesabi |
| rulman iç boşluğu, rulman gresleri | /teknik/rulmanlarin-ic-boslugu, /teknik/rulman-gresleri-ve-ozellikleri |
| rulman arızası teşhisi, kestirimci bakım | /teknik/tipik-rulman-arizalari, /teknik/kestirimci-bakim |
| kayış-kasnak hesabı, toleranslar, mühendislik formülleri | /teknik/kayis-kasnak-hesabi, /teknik/toleranslar, /teknik/muhendislikte-onemli-formuller |

## 5. Ürün kodu aramaları (yüksek niyet, B2B)

DB'deki ürün kodları (örn. 6203-2RS) marka + kategori filtreleriyle /urunler?q= üzerinden yakalanır. SEO donanımı: her ürün sayfasında `Product` şeması + kod başlığı.

## Kanibalizasyon önlemi

- Aynı niyette birden fazla sayfa yarıştırılmaz: /urunler (liste) ↔ /urunler/:slug (detay) ayrıştırıldı.
- /kataloglar ve /e-katalog aynı bileşeni gösterir; canonical /kataloglar'ı işaret eder (sitemap'te her ikisi de var ama canonical tekil).
- Blog ve /bizden-haberler aynı bileşen; sitemap'te ikisi de liste. Blog yazılarının tamamı gönderildiğinde kanonik teke indirilmelidir.

## İçerik önerileri (içerik ekleme yetkisi gerektirir)

- FAQ blokları (gerçek ve sayfada görünen): rulman ömrü, yağlama sıklığı, iç boşluk seçimi, Gates kayış ölçümü.
- Sektör sayfalarında gerçek uygulama notları (DB'deki sektör açıklamalarından).
