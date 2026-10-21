-- Raz Sahra PostgreSQL schema. Safe to re-run.
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(48) NOT NULL UNIQUE,
  email varchar(254) UNIQUE,
  display_name varchar(120) NOT NULL DEFAULT '',
  password_hash text NOT NULL,
  role varchar(16) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  status varchar(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash char(43) PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  ip_hash char(43),
  user_agent varchar(512)
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS auth_attempts (
  id bigserial PRIMARY KEY,
  bucket_hash char(43) NOT NULL,
  happened_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_attempts_bucket_time_idx ON auth_attempts(bucket_hash, happened_at DESC);
CREATE TABLE IF NOT EXISTS site_pages (
  slug varchar(100) NOT NULL,
  language varchar(8) NOT NULL DEFAULT 'fa' CHECK (language IN ('fa','en')),
  title varchar(220) NOT NULL,
  description text NOT NULL DEFAULT '',
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status varchar(16) NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY(slug,language)
);
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(140) NOT NULL,
  language varchar(8) NOT NULL DEFAULT 'fa' CHECK (language IN ('fa','en')),
  title varchar(240) NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(slug,language)
);
CREATE INDEX IF NOT EXISTS articles_status_published_idx ON articles(status, published_at DESC);
CREATE TABLE IF NOT EXISTS site_settings (
  key varchar(120) PRIMARY KEY,
  value_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind varchar(40) NOT NULL DEFAULT 'contact',
  name varchar(160) NOT NULL DEFAULT '',
  email varchar(254) NOT NULL DEFAULT '',
  phone varchar(60) NOT NULL DEFAULT '',
  company varchar(180) NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status varchar(24) NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','answered','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_status_created_idx ON inquiries(status, created_at DESC);
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action varchar(120) NOT NULL,
  target_type varchar(80) NOT NULL DEFAULT '',
  target_id varchar(180) NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash char(43),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);
CREATE TABLE IF NOT EXISTS app_catalog (
  slug varchar(80) PRIMARY KEY,
  name varchar(180) NOT NULL,
  description text NOT NULL DEFAULT '',
  app_url text NOT NULL DEFAULT '',
  download_url text NOT NULL DEFAULT '',
  icon_url text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL
);
INSERT INTO site_pages (slug,language,title,description,status,content_json) VALUES
('home','fa','صفحه اصلی','معرفی راز صحرا، زنجیره ارزش و مسیرهای همکاری.','published','{}'::jsonb),
('about','fa','درباره ما','هویت و رویکرد راهبران زنجیره ارزش صحرا.','published','{}'::jsonb),
('business','fa','حوزه‌های فعالیت','حوزه‌های فعالیت راز صحرا.','published','{}'::jsonb),
('supply','fa','زنجیره تأمین','چارچوب هماهنگی تولید تا بازار.','published','{}'::jsonb),
('partnerships','fa','همکاری با ما','فرم‌ها و فرصت‌های همکاری.','published','{}'::jsonb),
('contact','fa','ارتباط با ما','دریافت و پیگیری پیام‌ها.','published','{}'::jsonb),
('insights','fa','مجله تخصصی','مقاله‌های آموزشی و تخصصی صنعت طیور.','published','{}'::jsonb),
('privacy','fa','حریم خصوصی','سیاست حریم خصوصی سایت.','published','{}'::jsonb),
('home','en','Home','Raz Sahra company introduction and value-chain overview.','published','{}'::jsonb),
('about','en','About us','Company identity and operating approach.','published','{}'::jsonb),
('business','en','Business areas','Raz Sahra business areas.','published','{}'::jsonb),
('supply','en','Supply chain','Production-to-market coordination.','published','{}'::jsonb),
('partnerships','en','Partnerships','Partnership opportunities.','published','{}'::jsonb),
('contact','en','Contact','Contact and inquiry information.','published','{}'::jsonb),
('insights','en','Insights','Industry articles and guides.','published','{}'::jsonb),
('privacy','en','Privacy','Website privacy policy.','published','{}'::jsonb)
ON CONFLICT (slug,language) DO NOTHING;
INSERT INTO site_settings(key,value_json) VALUES
('site.identity','{"brand":"راز صحرا","brand_en":"RAZ SAHRA","slogan":"از تأمین تا ارزش‌آفرینی"}'::jsonb),
('site.features','{"accounts":true,"editorial_cms":true,"madar_mount_ready":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
INSERT INTO app_catalog(slug,name,description,app_url,download_url,active,sort_order,metadata)
VALUES ('madar','مدار','سامانه مدیریت عملیات، شبکه تأمین و مزرعه؛ مسیر نصب و نسخه آنلاین پس از اتصال خروجی نهایی اپ تنظیم می‌شود.','','',false,10,'{"integration_status":"pending_bundle","planned_path":"/madar/"}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
