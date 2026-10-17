-- 1. SLIDERS: subtitle ve href
UPDATE sliders SET subtitle='Dayanıklılık ve hassasiyet bir arada', href='/kataloglar/teknik/koyo' WHERE id=1;
UPDATE sliders SET subtitle='Endüstriyel performansın Japon imzası', href='/kataloglar/teknik/nsk' WHERE id=2;
UPDATE sliders SET subtitle='FAG ve INA ile güç aktarımında güvenilirlik', href='/kataloglar/teknik/schaeffler' WHERE id=3;
UPDATE sliders SET subtitle='Kayış ve kasnak sistemlerinde global lider', href='/kataloglar/teknik/gates' WHERE id=4;
UPDATE sliders SET subtitle='Her koşulda güvenilir, her sektörde verimli', href='/kataloglar/teknik/ntn' WHERE id=5;
UPDATE sliders SET subtitle='Ağır yük uygulamalarında tartışmasız referans', href='/kataloglar/teknik/timken' WHERE id=6;

-- 2. POSTS: blog yazı içerikleri
UPDATE posts SET
  excerpt='Rulman seçiminde yük kapasitesi tek başına yeterli mi? Hız, sıcaklık ve ortam koşulları da hesaba katılmalı.',
  body='<h2>Yük Kapasitesi Neden Tek Başına Yetmez?</h2><p>Rulman seçiminde en sık yapılan hata, yalnızca dinamik ve statik yük kapasitelerine bakılmasıdır. Ancak gerçek uygulama koşullarında hız faktörü, çalışma sıcaklığı, yağlama yöntemi ve ortam kirliliği de rulman ömrünü doğrudan etkiler.</p><h3>ISO 281 Standart Ömür Hesabı</h3><p>ISO 281 standardına göre temel ömür hesabı, dinamik yük kapasitesi (C) ile eşdeğer dinamik yük (P) oranına dayanır. Ancak bu formül, ideal koşulları varsayar. Gerçek uygulamalarda düzeltilmiş ömür hesabı kullanılmalıdır.</p><h3>Sıcaklık ve Hız Etkisi</h3><p>Rulman çalışma sıcaklığı 70°C üzerine çıktığında malzeme sertliği düşer, bu da dinamik yük kapasitesini azaltır. Aynı şekilde referans hızın üzerindeki çalışma koşulları, yağ filminin incelmesine ve metal-metal temasına neden olabilir.</p><h3>Uygulama Önerisi</h3><p>Doğru rulman seçimi için yük kapasitesinin yanı sıra mutlaka referans hız, sınır hız, minimum yük gereksinimleri ve yağlama periyotlarını da değerlendirin. RMS Rulmak teknik ekibi bu konuda destek sunmaktadır.</p>',
  read_time=6
WHERE slug='rulman-yagama-periyotlari';

UPDATE posts SET
  excerpt='Konveyör hatlarında plansız duruşu azaltmak için rulman kontrolünde 4 kritik uygulama notu.',
  body='<h2>Konveyör Hatlarında Rulman Kontrolü</h2><p>Konveyör sistemleri, birçok endüstriyel tesiste üretim sürekliliğinin bel kemiğidir. Taşıyıcı rulmanlardan herhangi birinin arızası, tüm hattın durmasına ve yüksek maliyetli kesintilere yol açabilir.</p><h3>1. Titreşim Analizi</h3><p>Periyodik titreşim ölçümü, rulman arızasını 2-3 ay öncesinden tespit etmenin en güvenilir yoludur. ISO 10816 sınıflandırmasına göre ölçülen RMS hız değerleri, rulmanın sağlık durumunu ortaya koyar.</p><h3>2. Sıcaklık İzleme</h3><p>Kızılötesi termometre veya termal kamera ile yapılan düzenli kontroller, aşırı ısınan noktaları tespit eder. Normal çalışma koşullarında rulman sıcaklığı ortam sıcaklığından 40°C fazla olmamalıdır.</p><h3>3. Gres Durumu Kontrolü</h3><p>Gresin renk değişimi, sertleşmesi veya su girişi belirtileri, rulmanın yeniden yağlanması ya da değiştirilmesi gerektiğini gösterir.</p><h3>4. Ses Dinleme</h3><p>Ultrasonik dinleme cihazları, insan kulağının algılayamadığı yüksek frekanslı sesleri tespit ederek erken uyarı sağlar.</p>',
  read_time=8
WHERE slug='kontrol-uygulama-notu';

UPDATE posts SET
  excerpt='Bilyalı rulman, makaralı rulman, radyal boşluk, hassasiyet sınıfı gibi en çok karıştırılan 10 kavramın net açıklaması.',
  body='<h2>Rulman Terminolojisi: 10 Temel Kavram</h2><h3>1. Dinamik Yük Kapasitesi (C)</h3><p>Rulmanın 1 milyon devir ömür için taşıyabileceği sabit yönlü ve büyüklükteki yük değeridir.</p><h3>2. Statik Yük Kapasitesi (C0)</h3><p>Rulman duruyor veya çok yavaş dönerken kalıcı deformasyona yol açmayan maksimum yüktür.</p><h3>3. Radyal İç Boşluk</h3><p>İç bilezik sabitken dış bileziğin radyal yönde hareket edebileceği mesafedir. C2, CN, C3, C4, C5 sınıflarında tanımlanır.</p><h3>4. Hassasiyet Sınıfı</h3><p>ISO 492 standardına göre P0 (normal), P6, P5, P4, P2 olarak sınıflandırılır.</p><h3>5. Referans Hız</h3><p>Standart yağlama ve yük koşullarında rulmanın güvenle çalışabileceği devir sayısıdır.</p><h3>6. Sınır Hız</h3><p>Mekanik olarak ulaşılabilecek maksimum hızdır; bu değerin aşılması kafes hasarına yol açabilir.</p><h3>7. ABEC / ISO Sınıfı</h3><p>ABEC 1 = P0, ABEC 3 = P6, ABEC 5 = P5 karşılıkları kullanılır.</p><h3>8. Conta ve Kalkan</h3><p>RS/2RS: lastik conta, Z/2Z: metal kalkan. Conta daha iyi sızdırmazlık sağlar ancak sürtünme kayıpları artar.</p><h3>9. Yağ Filmi Kalınlığı</h3><p>Rulman yuvarlanma yüzeyleri arasındaki yağ tabakasının kalınlığıdır. Lambda oranı 3 üzerinde olmalıdır.</p><h3>10. Eşdeğer Dinamik Yük (P)</h3><p>Radyal ve eksenel yüklerin birleşik etkisini tek bir değere indirgeyen hesaplanmış yüktür.</p>',
  read_time=5
WHERE slug='rulman-terminolojisi';

-- 3. PAGES: zengin içerikler
UPDATE pages SET content='<h2>Gizlilik Politikası</h2><p>RMS Rulmak olarak kişisel verilerinizin gizliliğine büyük önem veriyoruz. Bu politika, web sitemiz üzerinden topladığımız bilgilerin nasıl kullanıldığını ve korunduğunu açıklar.</p><h3>Toplanan Bilgiler</h3><p>İletişim formları aracılığıyla ad-soyad, e-posta adresi, telefon numarası ve firma bilgileriniz toplanmaktadır. Bu bilgiler yalnızca talebinize geri dönüş yapmak ve hizmet kalitemizi artırmak amacıyla kullanılır.</p><h3>Çerezler</h3><p>Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerez tercihlerinizi tarayıcı ayarlarınızdan değiştirebilirsiniz.</p><h3>Üçüncü Taraflarla Paylaşım</h3><p>Kişisel verileriniz, yasal zorunluluklar dışında izniniz olmadan üçüncü taraflarla paylaşılmaz. Verileriniz Türkiye sınırları içindeki sunucularda saklanır.</p><h3>İletişim</h3><p>Gizlilik politikamız hakkında sorularınız için info@rmsrulmak.com adresine başvurabilirsiniz.</p>' WHERE slug='gizlilik-politikasi';

UPDATE pages SET content='<h2>Kullanım Koşulları</h2><p>Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p><h3>Fikri Mülkiyet</h3><p>Sitedeki tüm içerik, görsel, metin, logo ve tasarımlar RMS Rulmak''a aittir. İzinsiz kopyalanması veya çoğaltılması yasaktır.</p><h3>Ürün Bilgileri</h3><p>Web sitemizdeki teknik veriler ve ürün bilgileri genel bilgilendirme amaçlıdır. Kesin teknik gereksinimler için satış ekibimize danışmanızı öneririz.</p><h3>Sorumluluk Sınırı</h3><p>Sitedeki bilgilerin doğruluğu konusunda azami özen gösterilmekle birlikte, olası hatalardan kaynaklanan zararlardan RMS Rulmak sorumlu tutulamaz.</p><h3>Değişiklikler</h3><p>RMS Rulmak, kullanım koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar.</p>' WHERE slug='kullanim-kosullari';

UPDATE pages SET content='<h2>KVKK Aydınlatma Metni</h2><p>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, kişisel verilerinizin işlenmesine ilişkin aşağıdaki bilgilendirmeyi sunarız.</p><h3>Veri Sorumlusu</h3><p>RMS Rulmak Endüstriyel Ürünler San. ve Tic. Ltd. Şti. - Şifa Mah. Şekerpınar Cad. No: 114/B, Tuzla / İstanbul</p><h3>İşlenen Kişisel Veriler</h3><p>Ad-soyad, e-posta, telefon numarası, firma adı ve iletişim formu aracılığıyla ilettiğiniz mesaj içeriği.</p><h3>İşleme Amacı</h3><p>Taleplerinize yanıt vermek, hizmet kalitesini artırmak ve yasal yükümlülüklerimizi yerine getirmek.</p><h3>Hukuki Dayanak</h3><p>Açık rıza, sözleşmenin ifası ve meşru menfaat.</p><h3>Haklarınız</h3><p>Kişisel verileriniz hakkında bilgi talep etme, düzeltme, silme ve işlemeye itiraz etme haklarına sahipsiniz. Bu haklarınızı kullanmak için info@rmsrulmak.com adresine başvurabilirsiniz.</p>' WHERE slug='kvkk';

UPDATE pages SET content='<h2>Çerez Politikası</h2><p>RMS Rulmak web sitesi, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır.</p><h3>Çerez Nedir?</h3><p>Çerezler, web tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. Siteye tekrar ziyaretinizde tercihlerinizi hatırlamak ve analiz verileri toplamak için kullanılır.</p><h3>Kullandığımız Çerez Türleri</h3><p><strong>Zorunlu çerezler:</strong> Sitenin düzgün çalışması için gereklidir. <strong>Analiz çerezleri:</strong> Ziyaretçi istatistiklerini toplamak ve siteyi geliştirmek için kullanılır. <strong>Tercih çerezleri:</strong> Dil ve bölge tercihlerinizi hatırlamak için kullanılır.</p><h3>Çerez Yönetimi</h3><p>Tarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Ancak bazı çerezlerin engellenmesi, sitenin işlevselliğini etkileyebilir.</p>' WHERE slug='cerez-politikasi';

UPDATE pages SET content='<h2>Hakkımızda</h2><p>1999 yılından bu yana rulman ve güç aktarım ekipmanları alanında faaliyet gösteren RMS Rulmak; IDC, Gates, Dunlop, NTN, NSK, Timken, Schaeffler (FAG / INA), Koyo ve RBC Bearings gibi global markaların Türkiye''deki yetkili distribütörlüğünü ve bayiliğini yürütür.</p><p>Teknik ürün bilgisi ile insan ilişkisini aynı masada buluşturuyoruz. Amacımız, müşterilerimizin üretim sürekliliğini korumak ve doğru ürünü, doğru zamanda, doğru fiyatla ulaştırmaktır.</p><h3>Misyonumuz</h3><ul><li>Doğru ürünü, doğru zamanda, doğru fiyatla ulaştırmak</li><li>Müşterilerimizin üretim sürekliliğini korumak</li><li>Teknik bilgiyi şeffaf biçimde paylaşmak</li></ul><h3>Vizyonumuz</h3><ul><li>Türkiye''nin güvenilir endüstriyel çözüm ortağı olmak</li><li>Dijital katalog ve teknik destekte sektör standardı belirlemek</li><li>Uzun vadeli iş ortaklıkları kurmak</li></ul>' WHERE slug='hakkimizda';

-- 4. SITE SECTIONS: eksik bölümler
INSERT INTO site_sections (key, page, label, content) VALUES
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

-- 5. FOOTER MENÜ ÖĞELERİ
INSERT INTO menu_items (menu_id, label, href, position, open_in_new_tab) VALUES
(2, 'Ürünler', '/urunler', 0, false),
(2, 'Markalar', '/markalar', 1, false),
(2, 'Kategoriler', '/kategoriler', 2, false),
(2, 'Sektörler', '/sektorler', 3, false),
(3, 'Hakkımızda', '/kurumsal', 0, false),
(3, 'Distribütörlüklerimiz', '/distributorler', 1, false),
(3, 'Bizden Haberler', '/bizden-haberler', 2, false),
(3, 'E-Katalog', '/kataloglar', 3, false),
(3, 'PDF Arşivi', '/teknik-dokumanlar', 4, false),
(3, 'Teknik Destek', '/iletisim', 5, false);

-- 6. MEDIA ASSETS
DELETE FROM media_assets WHERE id=1;
INSERT INTO media_assets (storage_path, file_name, title, description, alt_text, mime_type, size, folder) VALUES
('/brand/rulmak-red.png', 'rulmak-red.png', 'RMS Rulmak Logo (Kırmızı)', 'Ana site logosu, kırmızı versiyon', 'RMS Rulmak logo', 'image/png', 24576, 'logo'),
('/brand/rulmak-white.png', 'rulmak-white.png', 'RMS Rulmak Logo (Beyaz)', 'Footer ve koyu zemin logosu', 'RMS Rulmak beyaz logo', 'image/png', 22528, 'logo'),
('/brand/rulmak-icon-red.png', 'rulmak-icon-red.png', 'RMS Rulmak İkon', 'Kare ikon, ürün kartlarında kullanılır', 'RMS Rulmak ikon', 'image/png', 8192, 'logo'),
('/hero/slide-koyo.jpg', 'slide-koyo.jpg', 'Koyo Slider Görseli', 'Ana sayfa hero slider - Koyo markası', 'Koyo Japon teknolojisi rulmanları', 'image/jpeg', 245760, 'hero'),
('/hero/slide-nsk.jpg', 'slide-nsk.jpg', 'NSK Slider Görseli', 'Ana sayfa hero slider - NSK markası', 'NSK mükemmeliyeti', 'image/jpeg', 230400, 'hero'),
('/hero/slide-schaeffler.jpg', 'slide-schaeffler.jpg', 'Schaeffler Slider Görseli', 'Ana sayfa hero slider - Schaeffler markası', 'Alman mühendisliğinde mükemmellik', 'image/jpeg', 256000, 'hero'),
('/hero/slide-gates.jpg', 'slide-gates.jpg', 'Gates Slider Görseli', 'Ana sayfa hero slider - Gates markası', 'Gates endüstriyel güç aktarımı', 'image/jpeg', 220160, 'hero'),
('/hero/slide-ntn.jpg', 'slide-ntn.jpg', 'NTN Slider Görseli', 'Ana sayfa hero slider - NTN markası', 'NTN güven ve verimlilik', 'image/jpeg', 235520, 'hero'),
('/hero/slide-timken.jpg', 'slide-timken.jpg', 'Timken Slider Görseli', 'Ana sayfa hero slider - Timken markası', 'Timken konik rulmanlar', 'image/jpeg', 241664, 'hero'),
('/video/rulmak-loop.mov', 'rulmak-loop.mov', 'RMS Rulmak Tanıtım Videosu', 'Ana sayfa video bölümü tanıtım videosu', 'RMS Rulmak tanıtım videosu', 'video/quicktime', 15728640, 'video'),
('/brand/reference/idc-logo.jpg', 'idc-logo.jpg', 'IDC Marka Logosu', 'IDC distribütörlük markası logosu', 'IDC logo', 'image/jpeg', 12288, 'marka-logo'),
('/brand/reference/gates-logo.jpg', 'gates-logo.jpg', 'Gates Marka Logosu', 'Gates distribütörlük markası logosu', 'Gates logo', 'image/jpeg', 14336, 'marka-logo'),
('/brand/reference/dunlop-logo.jpg', 'dunlop-logo.jpg', 'Dunlop Marka Logosu', 'Dunlop distribütörlük markası logosu', 'Dunlop logo', 'image/jpeg', 10240, 'marka-logo'),
('/brand/reference/ntn-logo.jpg', 'ntn-logo.jpg', 'NTN Marka Logosu', 'NTN distribütörlük markası logosu', 'NTN logo', 'image/jpeg', 11264, 'marka-logo'),
('/brand/reference/nsk-logo.jpg', 'nsk-logo.jpg', 'NSK Marka Logosu', 'NSK distribütörlük markası logosu', 'NSK logo', 'image/jpeg', 13312, 'marka-logo'),
('/brand/reference/timken-logo.jpg', 'timken-logo.jpg', 'Timken Marka Logosu', 'Timken distribütörlük markası logosu', 'Timken logo', 'image/jpeg', 15360, 'marka-logo'),
('/brand/reference/schaeffler-logo.jpg', 'schaeffler-logo.jpg', 'Schaeffler Marka Logosu', 'Schaeffler (FAG/INA) distribütörlük markası logosu', 'Schaeffler logo', 'image/jpeg', 16384, 'marka-logo'),
('/brand/reference/koyo-logo.jpg', 'koyo-logo.jpg', 'Koyo Marka Logosu', 'Koyo distribütörlük markası logosu', 'Koyo logo', 'image/jpeg', 9216, 'marka-logo'),
('/brand/reference/rbc-logo.jpg', 'rbc-logo.jpg', 'RBC Bearings Marka Logosu', 'RBC Bearings distribütörlük markası logosu', 'RBC Bearings logo', 'image/jpeg', 11776, 'marka-logo');

-- 7. REDIRECT RULES
INSERT INTO redirect_rules (from_path, to_path, status_code, enabled, position) VALUES
('/e-katalog', '/kataloglar', 301, true, 1),
('/bizden-haberler', '/blog', 301, true, 2),
('/distributorler', '/markalar', 301, true, 3),
('/teknik-dokumanlar', '/kataloglar', 301, true, 4),
('/hakkimizda', '/kurumsal', 301, true, 5)
ON CONFLICT (from_path) DO NOTHING;

-- 8. CONTACT MESSAGES
INSERT INTO contact_messages (full_name, company, phone, email, subject, message, kvkk_accepted, status, created_at) VALUES
('Mehmet Yılmaz', 'Yılmaz Makina San. Ltd.', '+90 532 111 2233', 'mehmet@yilmazmakina.com', 'Rulman fiyat talebi', 'Merhaba, konveyör hattımız için 6205-2Z ve UCP 207 rulmanlardan 50 adet fiyat teklifi alabilir miyiz? Teslimat süresi de önemli.', true, 'answered', NOW() - INTERVAL '12 days'),
('Ayşe Kaya', 'Kaya Çimento A.Ş.', '+90 543 444 5566', 'ayse.kaya@kayacimento.com.tr', 'Teknik danışmanlık', 'Çimento değirmenimizde kullandığımız Timken konik rulmanlarda erken arıza yaşıyoruz. Kestirimci bakım ve doğru ürün seçimi konusunda teknik destek talep ediyoruz.', true, 'read', NOW() - INTERVAL '5 days'),
('Ali Demir', 'Demir Enerji Sistemleri', '+90 555 777 8899', 'ali@demirenerji.com', 'Gates kayış siparişi', 'Gates A47 V-kayıştan 200 adet sipariş vermek istiyoruz. Toplu alım indirimi uyguluyor musunuz? Fatura ve sevk bilgileri için dönüş bekliyoruz.', true, 'new', NOW() - INTERVAL '1 day'),
('Fatma Özkan', 'Özkan Tarım Makineleri', '+90 506 333 4455', 'fatma@ozkantarim.com', 'Keçe ve conta talebi', 'Biçerdöver makinelerimiz için 35x50 keçe ve çeşitli ölçülerde o-ring ihtiyacımız var. Ürün listenizi paylaşabilir misiniz?', true, 'new', NOW() - INTERVAL '8 hours');

-- 9. AUDIT LOGS
INSERT INTO audit_logs (actor_email, module, action, entity_id, status_code, meta, created_at) VALUES
('mylife12.gra@gmail.com', 'settings', 'update', 'contact_phone', 200, '{"key":"contact_phone","old":"+90 216 392 40 40","new":"+90 216 392 41 41"}', NOW() - INTERVAL '3 days'),
('mylife12.gra@gmail.com', 'sliders', 'create', '6', 201, '{"title":"Konik rulmanlarla endüstriyel güç"}', NOW() - INTERVAL '2 days'),
('mylife12.gra@gmail.com', 'products', 'update', '1', 200, '{"field":"description","product":"6203 2RS Bilyalı Rulman"}', NOW() - INTERVAL '1 day'),
('mylife12.gra@gmail.com', 'pages', 'update', '4', 200, '{"slug":"gizlilik-politikasi","action":"content_update"}', NOW() - INTERVAL '12 hours'),
('mylife12.gra@gmail.com', 'menus', 'update', '1', 201, '{"menu":"main","items_count":24}', NOW() - INTERVAL '6 hours');

-- Site sections values doldur
UPDATE site_sections SET content='740223' WHERE key='stats_dunya';
UPDATE site_sections SET content='1200000' WHERE key='stats_rulman';
UPDATE site_sections SET content='850' WHERE key='stats_musteri';
UPDATE site_sections SET content='60' WHERE key='stats_cozum';
UPDATE site_sections SET content='Dönüşün olduğu her yerde güven var.' WHERE key='hero_title';
UPDATE site_sections SET content='Rulman ve güç aktarımında doğru ürünü, doğru teknik bilgiyle buluşturuyoruz. Üretiminiz durmasın diye.' WHERE key='hero_desc';
UPDATE site_sections SET content='Doğru ürünü, doğru zamanda, doğru fiyatla ulaştırmak. Müşterilerimizin üretim sürekliliğini korumak. Teknik bilgiyi şeffaf biçimde paylaşmak.' WHERE key='misyon';
UPDATE site_sections SET content='Türkiye''nin güvenilir endüstriyel çözüm ortağı olmak. Dijital katalog ve teknik destekte sektör standardı belirlemek. Uzun vadeli iş ortaklıkları kurmak.' WHERE key='vizyon';
UPDATE site_sections SET content='İlkeler başlığı' WHERE key='ilkeler_baslik';
