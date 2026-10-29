
## 29 October activation revision
The Netlify project now has a provisioned managed PostgreSQL database. Do not recreate it. Use ANALYTICS_DATABASE_PROVIDER=netlify with @netlify/database; no manually copied database URL is needed. SQL migration netlify/database/migrations/202610290001_portfolio_analytics.sql is applied by Netlify before publication. Personal-token production write access remains disabled.

Basic page opens are now automatic and separate from optional browser/session detail. A document sends one transient UUID for retry deduplication; no persistent browser ID, cookie, page path, IP or referral is stored in the basic table. Privacy signals and bot filters suppress writes. Reloading counts another open. Public label: page opens, never unique people. Daily basic events are retained up to 365 days; anonymous numerical totals remain. Optional detailed tracking, sessions and engaged-time logic remain consent based.

Local QA: build passed, 12 tests passed, Chromium/Edge automatic-open browser QA passed (before consent, unique per-load event, no pre-consent browser ID, decline, GPC, optional consent and 320/390/768/1440px layouts in both modes, no JavaScript errors). Remote driver/migration/rate-limit execution remains unverified until deployment. No production release yet.

Windows denies edits to older source files despite allowing new files. Originals are intact. Editable tested source: .analytics-local/release-source. Fresh Git deployment checkout: .analytics-local/deployment-checkout, based on origin/main 9a13f6e. Exclude all .analytics-local content from publication; it contains tools, caches and local QA data. New source, docs and server migrations are committed from the deployment checkout only after review. Do not publish entire workspace folder or backups.

Server settings required: ANALYTICS_ENABLED=true, ANALYTICS_DATABASE_PROVIDER=netlify, ANALYTICS_ORIGIN=https://portfolioruzzeldulay.netlify.app, ANALYTICS_ENVIRONMENT=production, plus owner-generated signing secret and scrypt password hash. Preserve other environment values. Dashboard is /analytics; no default password. Setup, credential authorization and publication await explicit approval.

Official references: https://docs.netlify.com/build/data-and-storage/netlify-database/api/ and https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/ .

---

# Analytics test report — 28 October 2026

Status: implemented and tested locally; NOT deployed or connected to a production database. No production credentials or settings changed. Original source backed up before edits; ZIP integrity checked.

## Inspection and implementation
Existing static HTML/CSS/JavaScript, Professional/Personalized modes, project carousel, media config and six-resume selector were preserved. Existing Netlify build/publish/functions configuration was extended. No source-level visitor analytics existed; account-level Netlify analytics was not accessible. D: source is an export without .git; no commit or push was made.

Plan followed: inspect source/hosting and existing analytics; implement consented client events and persistent server aggregation; add authenticated reports/public counter; test SQL, timing, security and browser behavior; document configuration. Then revise resumes and add the requested printable portfolio.

| Feature | Status | Evidence / remaining work |
|---|---|---|
| Page views, sessions, public recorded-visits counter | TESTED locally | PostgreSQL-backed ingestion; production DB and deployment required |
| Approximate unique browsers | TESTED locally | 30-day random browser ID, server HMAC; not identified people |
| Active/visible engaged time | TESTED locally | Pure clock tests, real idle/focus browser checks and overlapping SQL interval union |
| Project clicks, case views, demos, resume clicks, outbound domains | TESTED locally | Browser interaction and report assertions |
| Day/week/month trends, referrals, device, section engagement | TESTED locally | Aggregate SQL/report tests; browser dashboard grain selection |
| Server-side private dashboard | TESTED locally | HTTPS login, secure HttpOnly Strict cookie, authentication/CSRF/expiry tests |
| Persistence and deduplication | TESTED locally | PostgreSQL WASM close/reopen and concurrent retry tests |
| Consent, withdrawal, GPC/DNT and blocked storage | TESTED locally | Client/browser checks; no events before permission |
| Native Netlify rate limits and scheduled retention | IMPLEMENTED | Retention SQL tested; actual Netlify scheduling/edge enforcement requires staging verification |
| Production Neon integration | IN PROGRESS | Driver and migration supplied; no production connection configured |

## Executed checks
- Build passed: six valid PDF paths, synchronized catalogue, three local videos, configured media and HTML assets.
- Node test runner: 11 tests passed, zero failures. Real PostgreSQL-compatible SQL executed by PGlite, not a mocked storage object.
- Concurrent repeated ingestion counted one event/session; overlapping tabs unioned activity instead of summing it.
- Database restart preserved counters/reports. Retention removed detailed records while keeping anonymous lifetime totals.
- Forged/expired auth and CSRF requests rejected; missing configuration returns unavailable instead of an invented count.
- Edge browser: no collection before consent, shared session across reloads/tabs, project/resume/outbound interactions, withdrawal, blocked localStorage, GPC, keyboard modal dismissal, no JavaScript errors.
- Actual 35-second idle window followed by another 11 seconds, then unfocused-tab interval: no continuing engaged-time inflation beyond tolerance.
- Dashboard and footer screenshots visually reviewed, including 390px footer and Personalized mode.
- Found and fixed an actual browser login failure: no-referrer made form POST Origin null; same-origin referrer policy preserves private authentication checks.

Evidence is in sibling SESSION_ANALYTICS_RESUMES_2026-10-28: analytics-browser-qa.json, analytics-dashboard-local.png, analytics-footer-390.png, test-analytics-browser.cjs and tests/database artifacts. Screenshot values are LOCAL TEST DATA, never production visitor counts.

## Measurement limits and remaining deployment QA
Counts cover consenting, non-filtered browser traffic only; blockers, storage clearing and other devices affect estimates. Download events measure clicks, not completed saves. Project views mean opened case studies, not an independent route impression. Engaged time is an activity estimate within a 30-second idle window; elapsed span is first-to-last recorded event including idle gaps. There is no historical baseline/import. Origin/user-agent filtering cannot establish that every request is human.

Production requires a dedicated PostgreSQL database, migration, server-only environment variables and an owner password hash. Follow ANALYTICS_SETUP.md. Verify deployed function routing, rate limiting, scheduled retention and persistence on a staging deploy before requesting production approval. No production claim is made from local tests.

## Final download and layout regression
Six role selections each returned a valid PDF and completed a browser download with the expected descriptive filename. Printable portfolio download passed. All three demo players loaded approximately 60-second media with controls and subtitle tracks. Carousel clones initialized. Professional and Personalized layouts passed no-horizontal-overflow checks at 320, 390, 768 and 1440px. No JavaScript errors were observed. The final build passed again after adding the printable PDF link.
