# BACKUP-AND-RESTORE.md — RMS Rulmak Yedekleme ve Geri Yükleme

Tarih: 16 Ekim 2026
Hedef: PostgreSQL veritabanı ve medya dosyalarının güvenli yedeklenmesi ve geri yüklenmesi.

## Veritabanı Yedekleme

PostgreSQL 16 Docker container (ad: `rms-rulmak-postgres`, port 15433).

### Anlık yedek (pg_dump — SQL formatında)

```bash
docker exec -u postgres rms-rulmak-postgres pg_dump -U rulmak -d rms_rulmak \
  --no-owner --clean --if-exists > rms_rulmak_$(date +%Y%m%d).sql
```

### Anlık yedek (custom/compressed — geri yükleme için daha hızlı)

```bash
docker exec -u postgres rms-rulmak-postgres pg_dump -U rulmak -d rms_rulmak -Fc > rms_rulmak_$(date +%Y%m%d).dump
```

### Zamanlanmış yedek (örnek cron — her gün 03:00)

```
0 3 * * * docker exec -u postgres rms-rulmak-postgres pg_dump -U rulmak -d rms_rulmak -Fc > /backups/rms_$(date +\%Y\%m\%d).dump && find /backups -name 'rms_*.dump' -mtime +30 -delete
```

## Geri Yükleme

### SQL dump'tan

```bash
docker exec -i rms-rulmak-postgres psql -U rulmak -d rms_rulmak < rms_rulmak_YYYYMMDD.sql
```

### Custom dump'tan

```bash
docker exec -i rms-rulmak-postgres pg_restore -U rulmak -d rms_rulmak --clean --if-exists rms_rulmak_YYYYMMDD.dump
```

## Medya Dosyaları Yedekleme

- Klasör: `artifacts/uploads/` (runtime medyası) — `/api/media/*` altında servis edilir
- Statik medya: `artifacts/rms-rulmak-platform/public/` (logo, marka, kapaklar, PDF'ler)
- Yedekleme: klasörü tüm yedekleme dizinine kopyala veya nesne depolamaya senkronize et

```bash
# Örnek
rsync -av artifacts/uploads/ /backups/media/uploads/
rsync -av artifacts/rms-rulmak-platform/public/ /backups/media/public/
```

## Ortam Değişkenleri (yeniden kurulumda gerekli)

| Anahtar | Değer | Not |
|---|---|---|
| `DATABASE_URL` | `postgresql://rulmak:rulmak_dev@localhost:15433/rms_rulmak` | Dev; üretimde farklı |
| `CATALOG_ADMIN_EMAILS` | `mylife12.gra@gmail.com` | Admin erişimi |
| `ISSUER_URL` / `REPL_ID` | Replit OIDC | Giriş sistemi |
| `PORT` | `3000` (API) / `5173` (Vite) | |

## Restore Sonrası Kontrol Listesi

1. `pnpm run push` (şema senkronizasyonu — tablolar dump'ta mevcut olduğundan gerekmez ama güvenli)
2. API'yi başlat → `/api/healthz` = `{"status":"ok"}`
3. `curl /api/settings/public` → site adı/meta döndüğünü doğrula
4. `/admin`'e giriş yap, dashboard KPI'ların yüklendiğini doğrula
5. Medya: `/api/media/<örnek-dosya>` 200 döndürüyor mu test et

## Yedekleme Sıklığı Önerisi

| Veri | Sıklık | Saklama |
|---|---|---|
| Postgres dump | Günde 1 (03:00) | 30 gün |
| Medya klasörü | Haftada 1 | 90 gün |
| Schema migration'lar | Her `push` | kalıcı (git'te) |
