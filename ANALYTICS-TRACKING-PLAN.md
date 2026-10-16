# ANALYTICS-TRACKING-PLAN.md — GA4, GTM, Google Ads ve Meta Event Planı

Kod entegrasyonu tamamlandı: `src/lib/analytics.ts` (frontend), env tabanlı kimlikler. Hesap erişimi olmadığından gerçek ID'lerle doğrulama YAPILMAMIŞTIR; aşağıdaki "Erişim gerektiren" bölümler ayrıca listelenir.

## Mimarı

- **Tek veri katmanı:** `window.dataLayer` (GTM uyumlu).
- **GA4:** `gtag.js` doğrudan + `VITE_GA4_ID`; `send_page_view:false` + manuel page_view (SPA tekrarı önlenir; ilk config'de `send_page_view:true` ile tek sefer).
- **Google Ads:** gtag üzerinden dönüşüm etiketleri GTM'de tanımlanır; gtag aynı ölçüm parçasını kullanır.
- **Meta Pixel:** `fbevents.js` + `VITE_META_PIXEL_ID`; `fbq('consent', grant|revoke)` ile izne tabi.
- **GTM:** `VITE_GTM_ID` tanımlıysa container yüklenir; yinelenen etiket yok.

## Olay Sözlüğü (kodda uygulanmış)

| Olay | Koşul | Parametreler | İzin |
|---|---|---|---|
| `page_view` | Her rota değişimi (Router useLocation) — yalnızca GA4/GTM/Pixel ID'lerinden biri tanımlıysa dataLayer'a gider (ID'siz ortamda no-op) | page_path, page_title | analytics |
| `consent_init` | Sayfa yüklenince dataLayer'a | tüm consent_mode bayrakları | - |
| `view_item` | Ürün detayı yüklendiğinde | items[{item_id, item_name, item_brand, item_category}] | analytics |
| `generate_lead` | İletişim formu BAŞARILI submit | form:'iletisim', subject | her zaman (izi geç) |
| `generate_lead` | Ürün talebi BAŞARILI submit | form:'urun_talebi', product_code | her zaman |
| `click_to_call` | `a[href^=tel:]` tıklama (delegated) | phone | analytics |
| `click_whatsapp` | `wa.me` tıklama | - | analytics |
| `click_email` | `mailto:` tıklama | - | analytics |
| `file_download` | `.pdf` tıklama | file_name | analytics |
| `view_item_list`, `select_item`, `search`, `form_start` | Henüz bağlanmadı | - | - |

Not: `generate_lead` yalnızca sunucu onayından sonra (mutation.onSuccess) tetiklenir; butona basılması dönüşüm sayılmaz.

## Event öncelikleri (GTM'de tanımlanacak)

1. dataLayer'da `event==='generate_lead'` → GA4 "teklif_talebi" + Google Ads dönüşümü + Meta `Lead` (Custom).
2. `click_to_call` → GA4 özel olay; telefonun doğrulanmış satış olmadığı, yalnızca "tıklama" olduğu GA4'te işaretlenir.
3. `view_item` → GA4 Enhanced Ecommerce; Meta `ViewContent`.
4. `file_download` → GA4; broşür indirmeleri kampanya yardımcı sinyali.

## GTM kurulum notları (container erişimi gerekli)

- 1 GTM container; GA4, Google Ads dönüşümleri, Meta Pixel tek çatıda.
- Consent Initialization trigger'ı: `Consent Init - All Pages` (default `denied`'ler gtag ile kodda verildi).
- Sunulan `default` (denied) + `update` akışı Google önerisiyle birebir uyumludur.

## URL/parametre hijyeni

- Gerekli değil: `gclid`/`gbraid`/`wbraid` SPA'da korunur (sayfa yenilenmez).
- PII yasak: dataLayer'a kullanıcı adı/e-posta/telefon/şifre girilmez (yalnızca ürün kodu, kategori, sayfa yolu).
- IP anonimleştirme: `anonymize_ip: true`.

## Erişim gerektiren adımlar (kod dışı)

1. GA4 property oluştur → `VITE_GA4_ID`.
2. GTM container → `VITE_GTM_ID`; yukarıdaki tetikleyicileri tanımla.
3. Meta Business: Pixel oluştur → `VITE_META_PIXEL_ID`.
4. GA4 DebugView / Meta Test Events ile doğrula. Bu ortamda hesap erişimi yok, olayların Meta/GA'ya ulaştığı iddia edilmemektedir.
