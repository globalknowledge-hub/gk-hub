-- Migration: Content Engine (2026-04-02)
-- Creates scholarships and news_articles tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  provider text,
  deadline timestamptz,
  eligibility_tags text[],
  link text,
  category text CHECK (category IN ('local','national','global')) DEFAULT 'local',
  created_at timestamptz DEFAULT now()
);

-- News articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_body text,
  slug text UNIQUE,
  language text CHECK (language IN ('en','as','hi','bn')) DEFAULT 'en',
  source_url text,
  importance_score integer CHECK (importance_score >= 1 AND importance_score <= 10) DEFAULT 5,
  created_at timestamptz DEFAULT now()
);
