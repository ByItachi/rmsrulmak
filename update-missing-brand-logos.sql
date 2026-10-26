-- IKO, JNS, Bower (NTN-Bower) ve Linmax markalarinin logo gorselleri
-- su an rulmak-icon-red.png (RMS yedek logosu) gosteriyordu; gercek marka
-- logolari asagidaki komutla brands.logo_url alanina islenir.
--
-- ONEMLI: Bu dosyayi calistirmadan once asagidaki 4 logo dosyasinin
-- production sunucusunda /brand/reference/ altina kopyalanmis olmasi gerekir
-- (deploy paketiyle birlikte otomatik gelir):
--   iko-logo.png, jns-logo.png, bower-logo.gif, linmax-logo.png

INSERT INTO media_assets (storage_path, file_name, title, description, alt_text, mime_type, size, folder)
VALUES
  ('/brand/reference/iko-logo.png', 'iko-logo.png', 'IKO Marka Logosu', 'IKO ithalat markasi logosu', 'IKO logo', 'image/png', 3032, 'marka-logo'),
  ('/brand/reference/jns-logo.png', 'jns-logo.png', 'JNS Marka Logosu', 'JNS ithalat markasi logosu', 'JNS logo', 'image/png', 4780, 'marka-logo'),
  ('/brand/reference/bower-logo.gif', 'bower-logo.gif', 'Bower (NTN-Bower) Marka Logosu', 'Bower ithalat markasi logosu', 'Bower logo', 'image/gif', 13242, 'marka-logo'),
  ('/brand/reference/linmax-logo.png', 'linmax-logo.png', 'Linmax Marka Logosu', 'Linmax distributorluk markasi logosu', 'Linmax logo', 'image/png', 40954, 'marka-logo');

UPDATE brands SET logo_url = '/brand/reference/iko-logo.png' WHERE slug = 'iko';
UPDATE brands SET logo_url = '/brand/reference/jns-logo.png' WHERE slug = 'jns';
UPDATE brands SET logo_url = '/brand/reference/bower-logo.gif' WHERE slug = 'bower';
UPDATE brands SET logo_url = '/brand/reference/linmax-logo.png' WHERE slug = 'linmax';
