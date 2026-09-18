-- Gym Training Planner — Postgres schema
-- Run automatically on boot by server/migrate.js (idempotent: IF NOT EXISTS everywhere)

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id        INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age            INTEGER,
  height_cm      NUMERIC,
  weight_kg      NUMERIC,
  goals          TEXT[] DEFAULT '{}',
  days_per_week  INTEGER,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per training day the user builds in the onboarding wizard.
CREATE TABLE IF NOT EXISTS training_days (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_order  INTEGER NOT NULL,
  name_ar    TEXT,
  name_en    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exercises entered by the user for each day, in the exact order/values they gave.
CREATE TABLE IF NOT EXISTS exercises (
  id             SERIAL PRIMARY KEY,
  day_id         INTEGER NOT NULL REFERENCES training_days(id) ON DELETE CASCADE,
  ex_order       INTEGER NOT NULL,
  name_ar        TEXT,
  name_en        TEXT,
  equipment_ar   TEXT,
  equipment_en   TEXT,
  sets           TEXT,
  reps           TEXT,
  rest           TEXT,
  video_url      TEXT DEFAULT ''
);

-- Toggleable completion state per exercise (checklist).
CREATE TABLE IF NOT EXISTS exercise_status (
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS weight_entries (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  weight_kg  NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS measurements (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  chest      NUMERIC,
  waist      NUMERIC,
  abdomen    NUMERIC,
  hips       NUMERIC,
  thigh      NUMERIC,
  arm        NUMERIC
);

CREATE TABLE IF NOT EXISTS calendar_entries (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('workout', 'done', 'rest')),
  PRIMARY KEY (user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_training_days_user ON training_days(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_day ON exercises(day_id);
CREATE INDEX IF NOT EXISTS idx_weight_user ON weight_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_user ON measurements(user_id);
