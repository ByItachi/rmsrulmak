# DATABASE-AUDIT.md — RMS Rulmak Veritabanı Denetimi

Tarih: 16 Ekim 2026
Veritabanı: PostgreSQL 16 (Docker, port 15433), ad: `rms_rulmak`, kullanıcı: `rulmak`

## Tablo Envanteri (18 tablo)

| Tablo | Kayıt | Açıklama |
|---|---|---|
| `brands` | 9 | IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler, Koyo, RBC |
| `categories` | 4 | Ürün kategorileri |
| `products` | 6 | Ürünler (FK: brand, category) |
| `product_documents` | 0 | Ürün belgeleri |
| `product_specs` | 0 | Ürün teknik özellikleri |
| `product_requests` | 0 | B2B ürün talepleri |
| `sectors` | 8 | Sektör çözümleri |
| `posts` | 3 | Blog yazıları |
| `sliders` | 6 | Hero slider kayıtları (Koyo, NSK, Schaeffler, Gates, NTN, Timken) |
| `site_sections` | 9 | Sayfa bölümleri (istatistikler, misyon/vizyon vb.) |
| `settings` | 22 | Site ayarları: genel, SMTP, SEO, entegrasyonlar (GA4/GTM/Pixel), tema (5 renk anahtarı) |
| `pages` | 1 | Admin tarafından oluşturulan statik sayfalar (test: `hakkimizda`) |
| `media_assets` | 1 | Medya kütüphanesi kayıtları (test yüklemesi: `test-medya.png`) |
| `redirect_rules` | 1 | 301/302 yönlendirme kuralları (`/eski-kategoriler` → `/kategoriler`) |
| `users` | 1 | Kullanıcılar (rol: super_admin/admin/editor/media_manager/viewer) |
| `sessions` | 2 | OIDC oturumları (1 test oturumu) |
| `contact_messages` | 0 | İletişim formu mesajları |
| `audit_logs` | 0 | Admin işlem kayıtları |
| `catalogs` | 0 | (Gelecekte: e-katalog yönetimi) |

## Şema Notları

- **users tablosu**: Rol alanı eklendi (default `viewer`); `is_active`, `last_login_at` alanları mevcut. OIDC girişinde `upsertUsersExisting` ile senkronize edilir.
- **pages**: `slug` unique; çakışmada API 409 + Türkçe mesaj döner (doğrulandı).
- **redirect_rules**: `from_path` unique; middleware 60 sn önbellekle çalışır (canlı test: 301 + Location header ✅).
- **settings**: `key` unique; `group` sütunu API'de `group` olarak adlandırılır; 5 tema anahtarı + 17 yapılandırma anahtarı.

## İlişkiler

```
products.category_id → categories
products.brand_id    → brands
posts.category_id    → categories (kategorize edilebilir)
site_sections.page   → benzersiz bölüm anahtarı (ör. stats, hero, mission)
```

## Veri Bütünlüğü

- Tüm sayısal kimlikler auto-increment (seri).
- `settings` ve `redirect_rules` için ON CONFLICT seed kullanımı idempotent.
- Test verileri: `pages.hakkimizda`, `media_assets.test-medya.png` — üretim öncesi temizlenmeli.

## Öneriler

1. Üretim öncesi `hakkimizda` test sayfası ve `test-medya.png` kaydı silinmeli.
2. `contact_messages` için zamanlanmış temizlik/yedekleme stratejisi kurulmalı.
3. `audit_logs` için saklama süresi (ör. 90 gün) ve arşiv işi tanımlanmalı.
