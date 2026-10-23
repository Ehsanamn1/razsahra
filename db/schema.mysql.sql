-- Raz Sahra MySQL 8.0+ schema for the domestic-hosting migration.
-- This is a staging schema only. The current Cloudflare Pages Functions still use Neon/PostgreSQL.
-- Do not run against production until the Node.js/MySQL API adapter is deployed and verified.
-- MySQL 8.0.13+ expression defaults generate UUIDs for new runtime records; imported IDs remain unchanged.
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  username VARCHAR(48) NOT NULL UNIQUE,
  email VARCHAR(254) NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  status ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  last_login_at DATETIME(3) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(43) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at DATETIME(3) NOT NULL,
  ip_hash CHAR(43) NULL,
  user_agent VARCHAR(512) NULL,
  KEY sessions_user_id_idx (user_id),
  KEY sessions_expiry_idx (expires_at),
  CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS auth_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bucket_hash CHAR(43) NOT NULL,
  happened_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY auth_attempts_bucket_time_idx (bucket_hash, happened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS site_pages (
  slug VARCHAR(100) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'fa',
  title VARCHAR(220) NOT NULL,
  description TEXT NOT NULL,
  content_json JSON NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by CHAR(36) NULL,
  PRIMARY KEY (slug, language),
  CONSTRAINT site_pages_updated_by_fk FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT site_pages_language_chk CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS articles (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  slug VARCHAR(140) NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'fa',
  title VARCHAR(240) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  cover_image TEXT NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by CHAR(36) NULL,
  UNIQUE KEY articles_slug_language_unique (slug, language),
  KEY articles_status_published_idx (status, published_at),
  CONSTRAINT articles_updated_by_fk FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT articles_language_chk CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  `key` VARCHAR(120) NOT NULL PRIMARY KEY,
  value_json JSON NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by CHAR(36) NULL,
  CONSTRAINT site_settings_updated_by_fk FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS inquiries (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
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
  KEY inquiries_status_created_idx (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor_id CHAR(36) NULL,
  action VARCHAR(120) NOT NULL,
  target_type VARCHAR(80) NOT NULL DEFAULT '',
  target_id VARCHAR(180) NOT NULL DEFAULT '',
  metadata JSON NOT NULL,
  ip_hash CHAR(43) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY audit_logs_created_idx (created_at),
  CONSTRAINT audit_logs_actor_fk FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS app_catalog (
  slug VARCHAR(80) NOT NULL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  app_url TEXT NOT NULL,
  download_url TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 100,
  metadata JSON NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by CHAR(36) NULL,
  KEY app_catalog_order_idx (sort_order, name),
  CONSTRAINT app_catalog_updated_by_fk FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
