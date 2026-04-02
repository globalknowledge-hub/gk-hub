-- Migration: scholarships table
-- Run this with psql or via the provided scripts/apply-migration.ts

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  deadline timestamptz,
  eligibility_summary text,
  source_url text,
  category text CHECK (category IN ('local','national','global')) DEFAULT 'local',
  status text CHECK (status IN ('active','expired')) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
