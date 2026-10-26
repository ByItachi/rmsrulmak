-- Kurumsal sayfa istatistik bandı: eski yanıltıcı/yer tutucu değerler (740223, 1.200.000 vb.)
-- kaldırılıp doğrulanmış, şirketle tutarlı rakamlarla değiştirildi (4.000+ müşteri, 18 marka,
-- 30 yıl Gates temsilciliği, 10 sektör). Admin panelinden (site_sections tablosu) yönetilebilir.
-- Idempotent: tekrar çalıştırılabilir.

DELETE FROM site_sections WHERE key IN ('stats_dunya', 'stats_rulman');

INSERT INTO site_sections (page, key, label, body) VALUES
  ('kurumsal', 'stats_musteri', 'Sanayi müşterisi', '4000'),
  ('kurumsal', 'stats_marka', 'Global marka, tek kaynak', '18'),
  ('kurumsal', 'stats_gates', 'Yıldır Gates''in Türkiye''deki tek temsilcisi', '30'),
  ('kurumsal', 'stats_sektor', 'Sektörde çözüm ortaklığı', '10')
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  body = EXCLUDED.body;
