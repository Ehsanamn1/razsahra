-- Raz Sahra MySQL 8 schema; safe for fresh installs. Existing databases are not dropped.
CREATE TABLE IF NOT EXISTS users (
 id CHAR(36) PRIMARY KEY,
 username VARCHAR(48) NOT NULL UNIQUE,
 email VARCHAR(254) NULL UNIQUE,
 display_name VARCHAR(120) NOT NULL DEFAULT '',
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('user','admin') NOT NULL DEFAULT 'user',
 status ENUM('active','suspended') NOT NULL DEFAULT 'active',
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 last_login_at DATETIME(3) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS sessions (
 token_hash CHAR(43) PRIMARY KEY,
 user_id CHAR(36) NOT NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 expires_at DATETIME(3) NOT NULL,
 ip_hash CHAR(43) NULL,
 user_agent VARCHAR(512) NULL,
 INDEX sessions_user_id_idx(user_id),
 INDEX sessions_expiry_idx(expires_at),
 CONSTRAINT sessions_user_fk FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS auth_attempts (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 bucket_hash CHAR(43) NOT NULL,
 happened_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 INDEX auth_attempts_bucket_time_idx(bucket_hash,happened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS site_pages (
 slug VARCHAR(100) NOT NULL,
 language VARCHAR(8) NOT NULL DEFAULT 'fa',
 title VARCHAR(220) NOT NULL,
 description TEXT NOT NULL,
 content_json JSON NOT NULL,
 status ENUM('draft','published') NOT NULL DEFAULT 'published',
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 updated_by CHAR(36) NULL,
 PRIMARY KEY(slug,language),
 CONSTRAINT site_pages_updated_by_fk FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS articles (
 id CHAR(36) PRIMARY KEY,
 slug VARCHAR(140) NOT NULL,
 language VARCHAR(8) NOT NULL DEFAULT 'fa',
 title VARCHAR(240) NOT NULL,
 excerpt TEXT NOT NULL,
 content MEDIUMTEXT NOT NULL,
 cover_image VARCHAR(1000) NOT NULL DEFAULT '',
 status ENUM('draft','published') NOT NULL DEFAULT 'draft',
 published_at DATETIME(3) NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 updated_by CHAR(36) NULL,
 UNIQUE KEY articles_slug_language_uq(slug,language),
 INDEX articles_status_published_idx(status,published_at),
 CONSTRAINT articles_updated_by_fk FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS site_settings (
 `key` VARCHAR(120) PRIMARY KEY,
 value_json JSON NOT NULL,
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 updated_by CHAR(36) NULL,
 CONSTRAINT settings_updated_by_fk FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS inquiries (
 id CHAR(36) PRIMARY KEY,
 kind VARCHAR(40) NOT NULL DEFAULT 'contact',
 name VARCHAR(160) NOT NULL DEFAULT '',
 email VARCHAR(254) NOT NULL DEFAULT '',
 phone VARCHAR(60) NOT NULL DEFAULT '',
 company VARCHAR(180) NOT NULL DEFAULT '',
 message TEXT NOT NULL,
 payload_json JSON NOT NULL,
 status ENUM('new','reviewing','answered','archived') NOT NULL DEFAULT 'new',
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 INDEX inquiries_status_created_idx(status,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS audit_logs (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 actor_id CHAR(36) NULL,
 action VARCHAR(120) NOT NULL,
 target_type VARCHAR(80) NOT NULL DEFAULT '',
 target_id VARCHAR(180) NOT NULL DEFAULT '',
 metadata JSON NOT NULL,
 ip_hash CHAR(43) NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 INDEX audit_logs_created_idx(created_at),
 CONSTRAINT audit_actor_fk FOREIGN KEY(actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS app_catalog (
 slug VARCHAR(80) PRIMARY KEY,
 name VARCHAR(180) NOT NULL,
 description TEXT NOT NULL,
 app_url VARCHAR(1000) NOT NULL DEFAULT '',
 download_url VARCHAR(1000) NOT NULL DEFAULT '',
 icon_url VARCHAR(1000) NOT NULL DEFAULT '',
 active BOOLEAN NOT NULL DEFAULT TRUE,
 sort_order INT NOT NULL DEFAULT 100,
 metadata JSON NOT NULL,
 updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
 updated_by CHAR(36) NULL,
 CONSTRAINT apps_updated_by_fk FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_pages(slug,language,title,description,content_json,status) VALUES
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
('privacy','en','Privacy','Privacy policy.','{}','published');
INSERT IGNORE INTO site_settings(`key`,value_json) VALUES
('site.identity','{"brand":"راز صحرا","brand_en":"RAZ SAHRA","slogan":"از تأمین تا ارزش‌آفرینی"}'),
('site.features','{"accounts":true,"editorial_cms":true,"madar_mount_ready":true}');
INSERT IGNORE INTO app_catalog(slug,name,description,app_url,download_url,active,sort_order,metadata)
VALUES('madar','مدار','سامانه مدیریت عملیات و شبکه تأمین','/madar/','',TRUE,10,'{"integration_status":"same_origin_web_route","path":"/madar/"}');
