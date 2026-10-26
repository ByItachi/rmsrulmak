UPDATE brands SET logo_url = '/brand/reference/iko-logo.jpg' WHERE slug = 'iko';
UPDATE brands SET logo_url = '/brand/reference/jns-logo.jpg' WHERE slug = 'jns';
UPDATE brands SET logo_url = '/brand/reference/bower-logo.jpg' WHERE slug = 'bower';
UPDATE brands SET logo_url = '/brand/reference/linmax-logo.jpg' WHERE slug = 'linmax';

UPDATE media_assets SET
  storage_path = replace(storage_path, '.png', '.jpg'),
  file_name = replace(file_name, '.png', '.jpg'),
  mime_type = 'image/jpeg',
  size = CASE
    WHEN storage_path LIKE '%iko%' THEN 19616
    WHEN storage_path LIKE '%jns%' THEN 36358
    WHEN storage_path LIKE '%linmax%' THEN 29949
    ELSE size END
WHERE storage_path IN ('/brand/reference/iko-logo.png', '/brand/reference/jns-logo.png', '/brand/reference/linmax-logo.png');

UPDATE media_assets SET
  storage_path = '/brand/reference/bower-logo.jpg',
  file_name = 'bower-logo.jpg',
  mime_type = 'image/jpeg',
  size = 25961
WHERE storage_path = '/brand/reference/bower-logo.gif';
