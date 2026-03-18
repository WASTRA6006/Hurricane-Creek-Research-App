DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS zones;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS photo_status;
DROP TYPE IF EXISTS photo_category;

CREATE TYPE user_role AS ENUM ('admin', 'viewer');
CREATE TYPE photo_status AS ENUM ('active', 'hidden', 'flagged');
CREATE TYPE photo_category AS ENUM ('landscape', 'portrait', 'wildlife', 'macro');

CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  role          user_role NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          VARCHAR(255),
  password_hash VARCHAR(255)
);

CREATE TABLE zones (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE photos (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id),
  zone_id       BIGINT NOT NULL REFERENCES zones(id),
  category      photo_category NOT NULL,
  notes         TEXT,
  gps_allowed   BOOLEAN NOT NULL DEFAULT FALSE,
  latitude      NUMERIC(9,6),
  longitude     NUMERIC(9,6),
  image_url     TEXT NOT NULL,
  status        photo_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT gps_consistency CHECK (
    (gps_allowed = FALSE AND latitude IS NULL AND longitude IS NULL)
    OR
    (gps_allowed = TRUE AND latitude IS NOT NULL AND longitude IS NOT NULL)
  )
);

CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  actor_user_id   BIGINT NOT NULL REFERENCES users(id),
  target_photo_id BIGINT NOT NULL REFERENCES photos(id),
  action          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  detail          JSONB
);

CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_zone_id ON photos(zone_id);
CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_target ON audit_logs(target_photo_id);

INSERT INTO zones (name) VALUES 
  ('Parking'),
  ('Restoration Site'),
  ('Chestnuts');