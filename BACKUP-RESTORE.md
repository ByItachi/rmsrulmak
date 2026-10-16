# BACKUP-RESTORE — Yedekleme ve geri dönüş planı

## Yedek stratejisi

| Varlık | Yöntem | Konum | Sıklık |
|---|---|---|---|
| PostgreSQL (18 tablo) | `pg_dump -Fc` (custom format) | `.backups/rms_yedek_YYYYMMDD_HHMM.dump` | Her büyük içerik değişikliği öncesi + haftalık |
| Medya dosyaları | Dosya sistemi kopyası | `artifacts/uploads/` + `artifacts/rms-rulmak-platform/public/` | Yedekle aynı anda |
| Kod + şema | Git (GitHub `ByItachi/rmsrulmak`) | `main` dalı | Her değişiklikte |

`.backups/` ve `artifacts/uploads/` `.gitignore`'dadır (ikili dosyalar repoya girmez).

## Yedek alma (doğrulanmış komutlar)

```sh
# Veritabanı yedeği (52KB örnek: rms_test_20261016.dump, PGDMP imzalı, 18 tablo)
docker exec rms-rulmak-postgres pg_dump -U rulmak -d rms_rulmak -Fc -f /tmp/dump.dump
docker cp rms-rulmak-postgres:/tmp/dump.dump ./.backups/rms_yedek_$(date +%Y%m%d_%H%M).dump

# Medya yedeği
tar -czf .backups/media_$(date +%Y%m%d).tar.gz artifacts/uploads artifacts/rms-rulmak-platform/public/brand artifacts/rms-rulmak-platform/public/catalog
```

## Geri yükleme

```sh
# 1) Şema + veriyi geri yükle
docker cp .backups/rms_yedek_YYYYMMDD_HHMM.dump rms-rulmak-postgres:/tmp/dump.dump
docker exec rms-rulmak-postgres pg_restore -U rulmak -d rms_rulmak --clean --if-exists /tmp/dump.dump

# 2) Şema sürümünü yeniden hizala (gerekirse)
cd lib/db && DATABASE_URL="postgresql://rulmak:rulmak_dev@localhost:15433/rms_rulmak" pnpm -w run push --force

# 3) API'yi yeniden başlat (oturum tablosu tazelenir)
cd artifacts/api-server && pnpm run build && node dist/index.mjs
```

## Veri kaybı önleme kuralları (uygulanan)

- Taşıma öncesi/sonrası kayıt sayıları karşılaştırılır (DATABASE-MIGRATION-REPORT.md'de kanıtlı).
- `--clean --if-exists` ile geri yükleme idempotenttir.
- Silme işlemleri admin UI'da onay diyaloğu ister; FK ilişkileri Drizzle şemasında korunur.
- URL'ler korunur: marka logo yolları (`/brand/reference/*-logo.jpg`) ve PDF yolları değiştirilmedi; yönlendirme kuralları (`redirect_rules`) eski URL'leri korur.

## Doğrulama

- Test yedeği alındı ve PGDMP başlığıyla doğrulandı (18 tablo içerikli).
- Geri yükleme provası: test dump'ı `--clean` ile ikinci kez yüklendi, sayaçlar birebir aynı kaldı.
