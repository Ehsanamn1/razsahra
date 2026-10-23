-- Optional seed data for a brand-new empty Raz Sahra installation only.
-- Do not run before importing existing CMS data: these rows would intentionally block the guarded empty-target importer.
SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT IGNORE INTO site_pages (slug, language, title, description, content_json, status) VALUES
('home','fa','صفحه اصلی','معرفی راز صحرا، زنجیره ارزش و مسیرهای همکاری.','{}','published'),
('about','fa','درباره ما','هویت و رویکرد راهبران زنجیره ارزش صحرا.','{}','published'),
('business','fa','حوزه‌های فعالیت','حوزه‌های فعالیت راز صحرا.','{}','published'),
('supply','fa','زنجیره تأمین','چارچوب هماهنگی تولید تا بازار.','{}','published'),
('partnerships','fa','همکاری با ما','فرم‌ها و فرصت‌های همکاری.','{}','published'),
('contact','fa','ارتباط با ما','دریافت و پیگیری پیام‌ها.','{}','published'),
('insights','fa','مجله تخصصی','مقاله‌های آموزشی و تخصصی صنعت طیور.','{}','published'),
('privacy','fa','حریم خصوصی','سیاست حریم خصوصی سایت.','{}','published'),
('home','en','Home','Raz Sahra company introduction and value-chain overview.','{}','published'),
('about','en','About us','Company identity and operating approach.','{}','published'),
('business','en','Business areas','Raz Sahra business areas.','{}','published'),
('supply','en','Supply chain','Production-to-market coordination.','{}','published'),
('partnerships','en','Partnerships','Partnership opportunities.','{}','published'),
('contact','en','Contact','Contact and inquiry information.','{}','published'),
('insights','en','Insights','Industry articles and guides.','{}','published'),
('privacy','en','Privacy','Website privacy policy.','{}','published');

INSERT IGNORE INTO site_settings (`key`, value_json) VALUES
('site.identity', JSON_OBJECT('brand','راز صحرا','brand_en','RAZ SAHRA','slogan','از تأمین تا ارزش‌آفرینی')),
('site.features', JSON_OBJECT('accounts',true,'editorial_cms',true,'madar_mount_ready',true));

INSERT IGNORE INTO app_catalog
(slug,name,description,app_url,download_url,icon_url,active,sort_order,metadata)
VALUES ('madar','مدار','سامانه مدیریت عملیات، شبکه تأمین و مزرعه؛ نسخه وب یکپارچه با راز صحرا در مسیر اختصاصی همین دامنه ارائه می‌شود.','/madar/','','',TRUE,10,JSON_OBJECT('integration_status','same_origin_web_route','path','/madar/','native_binary','not_published'));
