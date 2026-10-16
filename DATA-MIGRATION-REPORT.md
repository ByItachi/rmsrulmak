# DATA-MIGRATION-REPORT.md — RMS Rulmak Veri Geçiş Raporu

Tarih: 16 Ekim 2026
Amaç: Hardcoded/statik siteden veritabanı destekli CMS yapısına geçişin durum raporu.

## Geçiş Yapılan Veriler (Hardcoded → DB)

| Veri | Kaynak | Hedef | Durum |
|---|---|---|---|
| Brand logoları ve markalar | Kod içi sabit liste (`referenceBrands`) | `brands` tablosu + `/brand/reference/*-logo.jpg` | ✅ Tamam |
| Ürünler | Kod içi örnekler | `products` tablosu (6 ürün) + `categories` (4) | ✅ Tamam |
| Sektörler | Kod içi | `sectors` tablosu (8) | ✅ Tamam |
| Blog yazıları | Kod içi | `posts` tablosu (3) | ✅ Tamam |
| Hero slider görselleri | Kod içi 17 görsel | `sliders` tablosu (6 marka banner'ı) | ✅ Tamam |
| Site istatistikleri (740.223+, 1.200.000+ vb.) | Kod içi | `site_sections` (stats) | ✅ Tamam |
| Misyon/Vizyon metinleri | Kod içi | `site_sections` (mission/vision) | ✅ Tamam |
| Site adı/slogan/meta/iletişim | Kod içi | `settings` (site_name, meta_title, telefon vb.) | ✅ Tamam |
| GA4/GTM/Pixel/GSC | Env değişkenleri | `settings` (admin panelinden yönetilir) | ✅ Tamam |
| Tema renkleri | Tailwind CSS varsayılanları | `settings` (theme_*) → `applySiteTheme()` ile anında uygulanır | ✅ Tamam |
| IDC katalog kapakları | Sahte/placeholder görseller | Gerçek kapaklar (`covers/*.png`) + gerçek PDF'ler (`pdf/*.pdf`) | ✅ Tamam (IDC) |
| Diğer marka katalogları (Gates/Dunlop/NTN/NSK/Timken/Schaeffler/Koyo/RBC) | Sahte kapaklar | Gerçek PDF'ler — **kısmen**; kullanıcı onayı bekliyor | ⏳ Kısmi |

## Kullanıcı Girişi Oturum Yapısı

| Öğe | Durum |
|---|---|
| Replit OIDC SSO | ✅ Mevcut (ISSUER_URL + REPL_ID) |
| Session tablosu | ✅ `sessions` (awaitable 7 gün TTL) |
| Admin yetkisi | `CATALOG_ADMIN_EMAILS` env ile (örn. mylife12.gra@gmail.com) |
| Kullanıcı rolleri | ✅ `users.role` (super_admin → viewer), admin panelinden değiştirilebilir |

## Dosya/Yeşil Alan Geçişi

| Öğe | Durum |
|---|---|
| Medya yükleme → disk (`/api/media/...`) | ✅ `media_assets` + `/api/admin/media` + `mediaStore.ts` |
| Eski uploads klasörü | `/artifacts/uploads/` — git'e dahil edilmemeli (gitignore önerisi) |

## Devam Eden Geçişler

1. **Diğer marka katalog PDF'leri** — Gates/Dunlop/NTN/NSK/Timken/Schaeffler/Koyo/RBC için üretici sitelerinden gerçek PDF indirme (kullanıcı onayı).
2. **Teknik sayfaların DB'ye taşınması** — `technicalTopics` sabit dizisi `pages` veya yeni `technical_docs` tablosuna alınabilir.
3. **Kurumsal sayfa içeriği** — tarihçe yol haritası, distribütörler ve galeri verileri DB'ye taşınabilir.

## Riskler

- E-katalog marka kapakları ve PDF'ler diskte hardcoded path'lerle işaretleniyor; `catalogs` tablosu boş — gelecekte admin panelden katalog CRUD'u için hazır.
- Test verileri (hakkimizda sayfası, test-medya.png) üretim öncesi temizlenmeli.
