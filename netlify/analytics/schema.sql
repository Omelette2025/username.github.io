-- Apply to a dedicated PostgreSQL 14+ database, never a browser database.
CREATE SCHEMA IF NOT EXISTS portfolio_analytics;
CREATE TABLE IF NOT EXISTS portfolio_analytics.sessions (
  environment text NOT NULL, session_id uuid NOT NULL, visitor_key text NOT NULL,
  started_at timestamptz NOT NULL, last_event_at timestamptz NOT NULL,
  device text NOT NULL, source text NOT NULL,
  engaged tstzmultirange NOT NULL DEFAULT '{}',
  PRIMARY KEY (environment, session_id)
);
CREATE TABLE IF NOT EXISTS portfolio_analytics.events (
  environment text NOT NULL, event_id uuid NOT NULL, session_id uuid NOT NULL,
  visitor_key text NOT NULL, kind text NOT NULL,
  occurred_at timestamptz NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
  project_id text, resume_id text, target text, section_id text,
  active_range tstzrange, device text NOT NULL, source text NOT NULL,
  PRIMARY KEY (environment, event_id),
  CHECK (kind IN ('page_view','project_click','project_view','resume_download','outbound_click','engagement','demo_open'))
);
CREATE TABLE IF NOT EXISTS portfolio_analytics.sections (
  environment text NOT NULL, session_id uuid NOT NULL, section_id text NOT NULL,
  engaged tstzmultirange NOT NULL DEFAULT '{}',
  PRIMARY KEY (environment,session_id,section_id),
  FOREIGN KEY (environment,session_id) REFERENCES portfolio_analytics.sessions ON DELETE CASCADE
);
-- These lifetime counters contain numbers only and survive raw-data retention.
CREATE TABLE IF NOT EXISTS portfolio_analytics.totals (
  environment text PRIMARY KEY, pageviews bigint NOT NULL DEFAULT 0,
  visits bigint NOT NULL DEFAULT 0, tracking_started timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS analytics_event_time ON portfolio_analytics.events(environment,occurred_at);
CREATE INDEX IF NOT EXISTS analytics_session_time ON portfolio_analytics.sessions(environment,started_at);

CREATE TABLE IF NOT EXISTS portfolio_analytics.page_opens (
 environment text NOT NULL, event_id uuid NOT NULL, opened_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(environment,event_id)
);
CREATE INDEX IF NOT EXISTS analytics_open_time ON portfolio_analytics.page_opens(environment,opened_at);
CREATE TABLE IF NOT EXISTS portfolio_analytics.open_totals (
 environment text PRIMARY KEY, page_opens bigint NOT NULL DEFAULT 0, tracking_started timestamptz NOT NULL
);

ALTER TABLE portfolio_analytics.page_opens ADD COLUMN IF NOT EXISTS elapsed_seconds integer NOT NULL DEFAULT 0;
ALTER TABLE portfolio_analytics.page_opens ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
