
ALTER TABLE portfolio_analytics.page_opens ADD COLUMN IF NOT EXISTS elapsed_seconds integer NOT NULL DEFAULT 0;
ALTER TABLE portfolio_analytics.page_opens ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
