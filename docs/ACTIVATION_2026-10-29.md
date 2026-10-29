
## 29 October activation revision
The Netlify project now has a provisioned managed PostgreSQL database. Do not recreate it. Use ANALYTICS_DATABASE_PROVIDER=netlify with @netlify/database; no manually copied database URL is needed. SQL migration netlify/database/migrations/202610290001_portfolio_analytics.sql is applied by Netlify before publication. Personal-token production write access remains disabled.

Basic page opens are now automatic and separate from optional browser/session detail. A document sends one transient UUID for retry deduplication; no persistent browser ID, cookie, page path, IP or referral is stored in the basic table. Privacy signals and bot filters suppress writes. Reloading counts another open. Public label: page opens, never unique people. Daily basic events are retained up to 365 days; anonymous numerical totals remain. Optional detailed tracking, sessions and engaged-time logic remain consent based.

Local QA: build passed, 12 tests passed, Chromium/Edge automatic-open browser QA passed (before consent, unique per-load event, no pre-consent browser ID, decline, GPC, optional consent and 320/390/768/1440px layouts in both modes, no JavaScript errors). Remote driver/migration/rate-limit execution remains unverified until deployment. No production release yet.

Windows denies edits to older source files despite allowing new files. Originals are intact. Editable tested source: .analytics-local/release-source. Fresh Git deployment checkout: .analytics-local/deployment-checkout, based on origin/main 9a13f6e. Exclude all .analytics-local content from publication; it contains tools, caches and local QA data. New source, docs and server migrations are committed from the deployment checkout only after review. Do not publish entire workspace folder or backups.

Server settings required: ANALYTICS_ENABLED=true, ANALYTICS_DATABASE_PROVIDER=netlify, ANALYTICS_ORIGIN=https://portfolioruzzeldulay.netlify.app, ANALYTICS_ENVIRONMENT=production, plus owner-generated signing secret and scrypt password hash. Preserve other environment values. Dashboard is /analytics; no default password. Setup, credential authorization and publication await explicit approval.

Official references: https://docs.netlify.com/build/data-and-storage/netlify-database/api/ and https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/ .
