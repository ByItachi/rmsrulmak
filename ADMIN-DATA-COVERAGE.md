# ADMIN-DATA-COVERAGE — Hangi veri nerede yönetiliyor?

Amaç: "Sitede görünen hiçbir veri admin dışında kalmasın" hedefinin kapsam haritası.
Ölçüm: 2026-10-16, /admin rotaları canlı taranarak doğrulandı.

## Modül kapsamı (17 admin bölümü)

| Admin rotası | Yönettiği veri | CRUD | Canlı test |
|---|---|---|---|
| /admin | Genel bakış: 8 KPI + mesaj grafiği + gelen kutusu | Salt okunur + hızlı erişim | ✅ |
| /admin/sliders | Ana sayfa hero slider (görsel/başlık/CTA/sıra/yayın) | ✅ | ✅ |
| /admin/posts | Blog yazıları (slug, markdown, kapak, tarih) | ✅ | ✅ |
| /admin/brands | 9 marka (logo, sıra, yayın) | ✅ | ✅ |
| /admin/categories | Ürün kategorileri | ✅ | ✅ |
| /admin/products | Ürünler (kod, marka, kategori ilişkisi) | ✅ | ✅ |
| /admin/sectors | Sektörler (ikon, açıklama) | ✅ | ✅ |
| /admin/sections | Ana sayfa istatistik/hero/kurumsal metin bölümleri | ✅ | ✅ |
| /admin/media | Medya kütüphanesi: yükle, başlık/alt, klasör, sil | ✅ | ✅ (upload 201) |
| /admin/pages | Statik sayfalar: markdown + SEO meta + yayın | ✅ | ✅ (200) |
| /admin/inquiries | İletişim mesajları + ürün talepleri (durum akışı) | ✅ | ✅ |
| /admin/redirects | 301/302 yönlendirme kuralları | ✅ | ✅ (301 canlı) |
| /admin/users | OIDC kullanıcıları: rol + aktif/pasif | ✅ (rol/güncelleme) | ✅ |
| /admin/menus | Header/footer menü oluşturucu (2 seviye) | ✅ | UI eklendi, API ✅ |
| /admin/settings | Genel/SMTP/SEO/GSC/Analytics/Pixel/Tema/Çerez ayarları (32 anahtar) | ✅ | ✅ (MailHog testi) |
| /admin/audit | Güvenlik & denetim logları | Salt okunur | API ✅ |
| /yonetim/kataloglar | PDF katalog arşivi (ayrı sayfa, admin korumalı) | ✅ | ✅ |

## Yetki ve güvenlik

- Tüm `/api/admin/*` uçları `catalogAdmin` middleware ile korunur (401 doğrulandı).
- Kullanıcı rolleri: super_admin/admin/editor/media_manager/viewer (users.role).
- Her admin mutasyonu audit_logs'a yazılır; oturumlar OIDC (Replit) üzerinden.

## Kod içinde sabit kalan teknik değerler (bilinçli)

- Route tablosu, breadcrumb etiketleri, fiyat/teknik tablo başlıkları: UI iskeleti, içerik değil.
- Fallback listeleri (menü/slider): API erişilemezse dayanıklılık için; DB veri günceldir.
- Kurumsal sayfa misyon/vizyon blokları: sonraki iş — site_sections'a taşınabilir.
