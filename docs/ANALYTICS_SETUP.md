
## 29 October activation revision
The Netlify project now has a provisioned managed PostgreSQL database. Do not recreate it. Use ANALYTICS_DATABASE_PROVIDER=netlify with @netlify/database; no manually copied database URL is needed. SQL migration netlify/database/migrations/202610290001_portfolio_analytics.sql is applied by Netlify before publication. Personal-token production write access remains disabled.

Basic page opens are now automatic and separate from optional browser/session detail. A document sends one transient UUID for retry deduplication; no persistent browser ID, cookie, page path, IP or referral is stored in the basic table. Privacy signals and bot filters suppress writes. Reloading counts another open. Public label: page opens, never unique people. Daily basic events are retained up to 365 days; anonymous numerical totals remain. Optional detailed tracking, sessions and engaged-time logic remain consent based.

Local QA: build passed, 12 tests passed, Chromium/Edge automatic-open browser QA passed (before consent, unique per-load event, no pre-consent browser ID, decline, GPC, optional consent and 320/390/768/1440px layouts in both modes, no JavaScript errors). Remote driver/migration/rate-limit execution remains unverified until deployment. No production release yet.

Windows denies edits to older source files despite allowing new files. Originals are intact. Editable tested source: .analytics-local/release-source. Fresh Git deployment checkout: .analytics-local/deployment-checkout, based on origin/main 9a13f6e. Exclude all .analytics-local content from publication; it contains tools, caches and local QA data. New source, docs and server migrations are committed from the deployment checkout only after review. Do not publish entire workspace folder or backups.

Server settings required: ANALYTICS_ENABLED=true, ANALYTICS_DATABASE_PROVIDER=netlify, ANALYTICS_ORIGIN=https://portfolioruzzeldulay.netlify.app, ANALYTICS_ENVIRONMENT=production, plus owner-generated signing secret and scrypt password hash. Preserve other environment values. Dashboard is /analytics; no default password. Setup, credential authorization and publication await explicit approval.

Official references: https://docs.netlify.com/build/data-and-storage/netlify-database/api/ and https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/ .

---

# Portfolio analytics: configuration and release

Prepared 28 October 2026. **Local implementation only. No production deployment, database creation, environment-variable change or credential rotation has been performed.**

## What was inspected

- Active source: `D:\PROJECT FOLDERS\Engineering Projects\Online Portfolio\portfolio` (an editable export, without `.git` metadata).
- Deployment repository: `Omelette2025/username.github.io`, `main`; inspected remote and historical checkout both at `9a13f6e92940285207c768720d13cc12fe167550` before this work. The old C checkout was read for history only; all new work is on D.
- Static HTML/CSS/JS; root `index.html` and legacy `personalized/index.html`. Main Personalized mode is also handled by the root page.
- Existing Netlify build is `node scripts/build.mjs`, publishing `.`, with functions at `netlify/functions`. Existing chat function and `public_brain.md` included-files setting remain intact.
- No existing analytics tracker, shared counter, analytics database or dashboard was found in the supplied source. No historic counts have been imported or invented. Account-level Netlify analytics/logs were not accessible or audited.

## Architecture

Optional first-party client -> Netlify Functions -> dedicated PostgreSQL database using the Neon serverless HTTP driver. PostgreSQL 14+ multiranges merge overlapping activity intervals. Event insertion, session upsert, section timing and lifetime numeric counters run in **one SQL statement**, so retries and concurrent updates do not use an unsafe read/modify/write counter.

Netlify Blobs was evaluated. It can persist objects, but cross-event/session transactional updates and time-range aggregation are a better fit for PostgreSQL. A file on a function's filesystem or localStorage is not a shared database.

The browser keeps consent (up to one year), a random browser ID (30 days), shared-session activity metadata (30-minute inactivity timeout), and at most 100 pending retry events. These are optional client state, not authoritative counts. The server stores an HMAC-derived browser key, not the raw browser ID. Multiple tabs reuse a session and PostgreSQL unions overlapping intervals.

## Files and routes

| Route / file | Purpose |
|---|---|
| `analytics-client.js`, `analytics-clock.js` | Consent, single initialization, interaction collection, visibility/focus/idle timing |
| `analytics.css`, `privacy.html` | Theme-compatible counter/privacy choices and public notice |
| `POST /api/analytics/events` | Validated, same-origin ingestion; no frontend write secret |
| `GET /api/analytics/counter` | Lifetime numeric recorded-visits total only; no visitor records |
| `/analytics`, `/analytics/login`, `/analytics/logout` | Server-rendered owner sign-in/dashboard, CSRF checks, secure HttpOnly session cookie |
| `GET /api/analytics/report` | Authenticated aggregate report, 7/30/90/365 days; daily/weekly/monthly grouping |
| `analytics-dashboard.js` | Private dashboard rendering; all returned strings use textContent |
| `netlify/analytics/schema.sql` | Dedicated schema; events, sessions, section intervals and anonymous lifetime totals |
| `analytics-retention.mjs` | Daily scheduled deletion of detailed records older than 365 days; anonymous numeric totals retained |
| `scripts/analytics-preview.mjs` | Isolated local PostgreSQL (PGlite); never connects to production |

Static rewrites deny `/netlify/*`, `/node_modules/*`, `/scripts/*` and `/tests/*`. Function/API routes still perform authorization themselves. Private dashboard HTML is not a public static file. The production build command, publish directory, chat settings and existing environment values were not replaced.

## Production setup — only after approving the local result

1. Use a **dedicated Neon/PostgreSQL 14+ database**, or a Netlify-managed Neon database with a compatible connection string. Review account availability, costs, region and provider terms. Do not reuse an unrelated engineering application's database.
2. Apply `netlify/analytics/schema.sql` using the provider SQL editor, or set `ANALYTICS_DATABASE_URL` privately in your local environment and run `npm run analytics:migrate`. This creates only the `portfolio_analytics` schema with idempotent DDL. The migration is not run automatically during a Netlify build. Give the runtime database role access only to this schema and its required operations.
3. In an interactive local terminal run `npm run analytics:password`. Enter a strong password of at least 16 characters; typing is not echoed. The command prints a salted scrypt password hash and a random signing/HMAC secret. Copy them to server-side Netlify settings, not frontend files, Git, a chat message or a screenshot. Do not send me your password.
4. Add these **new** Netlify environment values, Functions scope and **production context only**. Preserve all existing values, including any chat-provider keys:

   | Variable | Value |
   |---|---|
   | `ANALYTICS_ENABLED` | `true` after approved configuration |
   | `ANALYTICS_DATABASE_URL` | Dedicated database connection string |
   | `ANALYTICS_ORIGIN` | `https://portfolioruzzeldulay.netlify.app` (exact origin, no trailing slash) |
   | `ANALYTICS_ENVIRONMENT` | `production` |
   | `ANALYTICS_SESSION_SECRET` | Random value from the password helper, 32+ characters |
   | `ANALYTICS_ADMIN_PASSWORD_HASH` | Salted scrypt hash from the helper |

   Keep preview/development database credentials separate. Do not grant deploy previews access to production analytics. `ANALYTICS_ENVIRONMENT` also namespaces database rows; it is not a substitute for separate least-privilege credentials.
5. Confirm the Netlify runtime/build uses Node 22+. New dependencies are locked in `package-lock.json`; `npm ci` installs them. The existing build/publish settings remain valid. Native Netlify rate-limit configuration is exported on each function. Confirm the platform applies it for your site before enabling writes; a local preview cannot verify Netlify's edge enforcement.
6. After release approval, copy the reviewed D-source changes into the actual deployment repository, inspect the diff, commit and publish via the existing Git -> Netlify flow. **Do not copy the sibling session/backup/database directory or actual `.env`/test TLS files into the published directory.**
7. Verify the deployed counter API, then make a deliberate consented visit. The counter must start from actual accepted sessions, never from an arbitrary baseline. Open `/analytics`, sign in, test reports and sign out. Check that the report API returns 401 without its authenticated cookie. Confirm cookies are Secure, HttpOnly, SameSite=Strict and that responses are private/no-store.
8. Verify Netlify scheduled retention executes successfully. Check application and provider logs without logging request bodies, browser IDs or passwords. Configure provider backup/recovery and an appropriate database region. No remote persistence or Netlify build/rate-limit/scheduler result is claimed until this smoke test succeeds.

## Local commands

```powershell
cd 'D:\PROJECT FOLDERS\Engineering Projects\Online Portfolio\portfolio'
npm ci
npm run build
npm test
npm run preview
```

The ordinary static preview has no Functions runtime; a missing counter service displays an unavailable message. For end-to-end development use `npm run preview:analytics`. It starts an isolated local PostgreSQL database outside the public source and exposes the same handler code on localhost. It never reads `ANALYTICS_DATABASE_URL` or connects to the live database. Set an explicit **temporary** `ANALYTICS_PREVIEW_PASSWORD` to enable its owner page; no dashboard password is provided by default. Secure owner cookies need HTTPS: optional `ANALYTICS_PREVIEW_TLS_KEY` and `ANALYTICS_PREVIEW_TLS_CERT` can point to a locally generated development certificate outside the publish directory. Do not use a production key for preview. The automated browser QA used an isolated self-signed certificate with a temporary test password, not production credentials.

## Definitions and limits

- **Page view:** one load of an instrumented portfolio document after consent. Hash-section navigation is section engagement, not another page view. Privacy and owner pages do not instrument themselves.
- **Visit/session:** a recorded session ID, shared across tabs and refreshes until 30 minutes without activity. Storage blocking or races at expiry can split sessions; it is a browser-based estimate, not a verified human count.
- **Unique visitor:** distinct consented browser pseudonyms for the selected period. IDs rotate after 30 days. People on several devices, storage clearing and private browsing inflate it; multiple people sharing a browser can reduce it.
- **Engaged time:** visible, focused time within a 30-second activity window; long throttled-timer gaps are conservatively excluded. It does not prove reading. Intervals are merged across retries and overlapping tabs. Section totals may overlap across separate windows/sections and need not sum to the global union.
- **Elapsed span:** first to last accepted event timestamp, including idle gaps; it is not precise total time until tab closure. It is shown separately from engaged time.
- **Resume download:** a download-link click, not confirmed save completion. Project views are case-study openings; card clicks and demo opens are reported separately.
- **Traffic source:** only referrer category or hostname. No search terms, referrer paths or UTM/query fields are retained. Referrer policy, blockers and missing referrers limit attribution.
- **Public count:** lifetime recorded opt-in sessions since this installation, backed by atomic database counters. It excludes opted-out/blocked/filtered traffic and cannot reconstruct historical visitors before installation. No approximate starting count is displayed.
- Known crawler user agents, GPC/DNT, wrong origins, malformed/bloated payloads, unknown IDs, duplicate event IDs and inflated time intervals are filtered. Origin headers can be spoofed by non-browser clients; this is reasonable filtering, not a guarantee that every accepted event is human. Monitor abuse and platform quotas.
- Collection retries are bounded, best effort and deduplicated. Disconnects, browser shutdowns, blockers or full queues can lose events. Totals are not a billing/audit-grade measurement of all website traffic.

## Privacy and security review before activation

No names, emails, raw IPs, full user-agent strings, chat messages, query strings or form fields enter the analytics schema. Random IDs and keyed pseudonyms may still be personal data under applicable rules; do not describe the implementation as legally anonymous or universally compliant. Netlify and database providers see operational network/connection information independently of this application. The owner must review consent notices, lawful basis, retention, data-subject handling, transfer/data residency and provider contracts for the site's audience. Consent is off by default and withdrawal clears local IDs/retry state. Historical anonymous totals remain.

Rotate the owner password hash to revoke knowledge of the old password; rotate the signing secret to invalidate existing dashboard cookies. Secret rotation also changes visitor-key hashing and affects unique-browser comparisons. Production secrets have not been created or changed by this task.

## Official references consulted

- [Netlify Functions API and native rate-limit configuration](https://docs.netlify.com/build/functions/api/)
- [Netlify rate limiting](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/)
- [Netlify Blobs consistency and persistence](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Neon serverless PostgreSQL driver](https://neon.com/docs/serverless/serverless-driver)
- [PGlite persistent Node filesystem](https://pglite.dev/docs/filesystems)
- [Philippine National Privacy Commission: DPA implementing rules](https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/)
