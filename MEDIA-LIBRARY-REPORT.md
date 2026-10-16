# MEDIA-LIBRARY-REPORT.md — RMS Rulmak Medya Kütüphanesi Raporu

Tarih: 16 Ekim 2026

## Durum: ✅ Aktif (canlı test edildi)

## Altyapı

| Öğe | Açıklama |
|---|---|
| Tablo | `media_assets` (id, file_name, mime_type, size, storage_path, title, alt_text, folder, created_at, updated_at) |
| Depolama | Yerel disk `artifacts/uploads/` |
| Public URL | `/api/media/<storage_path>` (mime tipi doğrulanmış, path traversal korumalı) |
| Yönetim | `/admin/media` (çoklu yükleme, klasör, düzenle, sil) |

## Desteklenen Formatlar

Görsel: PNG, JPG, WebP, SVG, GIF — PDF (kataloglar için)

## Doğrulanmış İş Akışları (canlı test)

1. **POST `/api/admin/media`** → base64 dosya → diske yazıldı → kayıt oluşturuldu (test: 201, `test-medya-*.png`)
2. **GET `/api/media/<path>`** → dosya servis edildi (`imageServed: true`)
3. **GET `/api/admin/media`** → liste döndü (`listCount: 1`)
4. Silme (kod: PATCH/DELETE ile storagePath temizlenir)

## Kullanım Senaryoları

- Slider görselleri, marka logoları, blog kapakları, ürün görselleri, katalog kapakları/PDF'ler — hepsi `/api/media/...` URL'iyle admin içerik formlarına gönderilebilir.

## İstatistik (şu an)

- Kayıt: 1 (test yüklemesi — üretim öncesi silinmeli)
- Klasörler: `test`

## Güvenlik

- MIME allowlist (image/png, image/jpeg, image/webp, image/svg+xml, image/gif, application/pdf)
- Boys limiti: yönetim tarafında doğrulanır
- Path traversal koruması (`..` engelleme)
- Dosyalar yalnızca `/api/media/` altında servis edilir (statik kök değil)

## Öneriler

1. Üretimde medyayı nesne depolama (S3-compatible) ile senkronize etme — `objectStorage.ts` hazır.
2. Yükleme boyut limiti birim testi eklenmeli.
3. Test kaydı temizlenmeli (`test-medya-*`).
