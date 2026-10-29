# Simple visits and time open — 29 October 2026

This revision supersedes the consent-based analytics UI and optional tracking features described in earlier notes. The user requested the reference portfolio's small automatic count and elapsed open time only.

- The reference was opened at https://portfolio.brewedops.cloud/kape-tools and visually inspected. Its counter is a small text line beneath the profile identity, not a full-width consent panel.
- Removed the large footer panel, consent/preferences dialog and optional tracking client. The print PDF link is a quiet icon/text footer action.
- Added a compact count beneath the existing identity on desktop/mobile, using the existing palette. Label: visits. Repeat page openings count separately; this is not a claim of unique people.
- Automatic first-party counting and document-time heartbeats use only a temporary random per-document event ID and elapsed seconds. No analytics cookie, persistent visitor identifier, fingerprint, project/download tracking or referrer collection. Old local analytics identifiers are cleared. The detailed-event endpoint is retired with HTTP 410; historical stored data is not deleted outside retention policy.
- Browser GPC/DNT no longer suppress these minimal first-party counts; no data is shared or used to identify visitors across page openings. No consent controls are displayed.
- Every 15 seconds and on page hide/close, the browser sends cumulative elapsed document-open time. The server takes a monotonic maximum bounded by actual elapsed server time, so retries cannot inflate visits/time. Time includes idle/background periods; it is not reading/engaged time. Failed final deliveries can undercount.
- Native migration 202610290002_visit_elapsed_time.sql adds time fields without resetting the existing count. Historical visits with unknown/zero time are excluded from averages.
- Private owner login and password are unchanged. Reports now show total visits, visits in the period, average elapsed open time, and day/week/month traffic. Existing advanced reports were removed from the visible dashboard to match the simpler request.

Tests: 9 PostgreSQL-backed/auth/persistence/retention tests pass. Local browser QA checks automatic counting with GPC/DNT, absence of consent UI and persistent analytics IDs, heartbeat seconds without extra counts, refresh counting and both modes at 320/390/768/1440px. See local simple-counter-browser-qa.json for the completed browser result. Production verification follows publication.

The currently edited Git source is .analytics-local/deployment-checkout under the D: portfolio. Original top-level files remain preserved due Windows permissions. Never publish .analytics-local from the parent workspace; publish only the tracked Git source. The existing private owner-access file remains outside the deployment.
