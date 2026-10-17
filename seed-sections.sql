INSERT INTO site_sections (key, page, label, body) VALUES
('hero_eyebrow', 'home', 'Hero eyebrow', 'Rulmak Endüstriyel Çözümler'),
('neden_rulmak_title', 'home', 'Neden Rulmak başlık', 'Parçadan fazlası. Sürekliliğin ortağı.'),
('neden_rulmak_1', 'home', 'Neden Rulmak - Kart 1', '{"title":"Güvenilir tedarik","desc":"Sektörünüze uygun markalar ve izlenebilir ürün bilgisi."}'),
('neden_rulmak_2', 'home', 'Neden Rulmak - Kart 2', '{"title":"Teknik netlik","desc":"Karar vermeyi hızlandıran, sade ve doğru teknik içerik."}'),
('neden_rulmak_3', 'home', 'Neden Rulmak - Kart 3', '{"title":"İnsan desteği","desc":"Sorunuz olduğunda ulaşabileceğiniz gerçek bir ekip."}'),
('video_title', 'home', 'Video bölüm başlığı', 'Güvenle Dönen Sistemler'),
('video_desc', 'home', 'Video bölüm açıklaması', 'RMS Rulmak, sanayi makineleri için yüksek kaliteli rulman çözümleri sunar.'),
('video_src', 'home', 'Video kaynağı', '/video/rulmak-loop.mov'),
('destek_eyebrow', 'home', 'Destek CTA eyebrow', 'Yardıma mı ihtiyacınız var?'),
('destek_title', 'home', 'Destek CTA başlık', 'Uygulamanız için doğru çözümü birlikte bulalım.'),
('ilkeler_seffaflik', 'kurumsal', 'İlke - Şeffaflık', '{"title":"Şeffaflık","desc":"Ürün, süre ve süreç hakkında açık konuşuruz."}'),
('ilkeler_sureklilik', 'kurumsal', 'İlke - Süreklilik', '{"title":"Süreklilik","desc":"Bugünü değil, uzun vadeli operasyonu planlarız."}'),
('ilkeler_sorumluluk', 'kurumsal', 'İlke - Sorumluluk', '{"title":"Sorumluluk","desc":"Önerdiğimiz çözümün arkasında dururuz."}'),
('tarihce_1', 'kurumsal', 'Tarihçe - 1999', '{"year":"1999","title":"Kuruluş","desc":"RMS Rulmak, rulman ve güç aktarım ekipmanları ticaretiyle İstanbul''da kuruldu."}'),
('tarihce_2', 'kurumsal', 'Tarihçe - 2005-2015', '{"year":"2005-2015","title":"Distribütörlük ağı","desc":"IDC, Gates, Dunlop, NTN ve NSK gibi markaların yetkili distribütörlüğü kademeli olarak eklendi."}'),
('tarihce_3', 'kurumsal', 'Tarihçe - 2016-2023', '{"year":"2016-2023","title":"Portföy genişlemesi","desc":"Timken, Schaeffler, Koyo ve RBC Bearings markalarıyla ürün yelpazesi genişletildi."}'),
('tarihce_4', 'kurumsal', 'Tarihçe - Bugün', '{"year":"Bugün","title":"Dijital B2B","desc":"Teknik bilgiye ve kataloğa tek noktadan erişim sağlayan dijital B2B platformuyla hizmete devam ediyoruz."}'),
('kurulus_stats', 'kurumsal', 'Kuruluş istatistikleri', '[{"value":"1999","label":"Kuruluş yılı"},{"value":"9","label":"Dünya markası"},{"value":"TR","label":"Yerel uzmanlık"}]')
ON CONFLICT (key) DO NOTHING;

UPDATE site_sections SET body='740223' WHERE key='stats_dunya';
UPDATE site_sections SET body='1200000' WHERE key='stats_rulman';
UPDATE site_sections SET body='850' WHERE key='stats_musteri';
UPDATE site_sections SET body='60' WHERE key='stats_cozum';
UPDATE site_sections SET body='Dönüşün olduğu her yerde güven var.' WHERE key='hero_title';
UPDATE site_sections SET body='Rulman ve güç aktarımında doğru ürünü, doğru teknik bilgiyle buluşturuyoruz. Üretiminiz durmasın diye.' WHERE key='hero_desc';
UPDATE site_sections SET body='Doğru ürünü, doğru zamanda, doğru fiyatla ulaştırmak. Müşterilerimizin üretim sürekliliğini korumak. Teknik bilgiyi şeffaf biçimde paylaşmak.' WHERE key='misyon';
UPDATE site_sections SET body='Türkiye''nin güvenilir endüstriyel çözüm ortağı olmak. Dijital katalog ve teknik destekte sektör standardı belirlemek. Uzun vadeli iş ortaklıkları kurmak.' WHERE key='vizyon';
UPDATE site_sections SET body='Değerlerimiz ve İş İlkelerimiz' WHERE key='ilkeler_baslik';
