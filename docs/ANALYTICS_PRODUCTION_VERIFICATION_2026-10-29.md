# Analytics production verification — 29 October 2026

Status: DEPLOYED AND LIVE-VERIFIED.
Code commit: a39a913dae0080d76d2f52fefd279cc9a11e5acf
Netlify deploy: 6ae33e337193b3d5e510bce1
Site: https://portfolioruzzeldulay.netlify.app/
Private dashboard: https://portfolioruzzeldulay.netlify.app/analytics
Netlify confirmed Published / Migrations applied. The managed database was created earlier; do not recreate it.

## Direct live checks
- Opening the portfolio recorded one automatic page open; refreshing incremented it to two. The public API and owner dashboard returned persisted totals from PostgreSQL.
- Before consent, optional page views, sessions and unique-browser estimates remained zero. Basic opens are not unique people or sessions.
- Owner password login succeeded; dashboard reports loaded from the live database.
- After consent, one Pandarithm case view/card click and all six distinct resume-download clicks appeared in the report.
- All six PDF browser downloads succeeded. The separate six-page printable portfolio also downloaded successfully.
- Pandarithm demo opened with its local MP4 and one caption track. Three-demo playback and mobile layout QA were verified locally before release; no claim of all-device live testing.
- Average engaged and elapsed spans were shown separately. Optional tracking was disabled again after testing.
- Signing out succeeded. The report endpoint then returned Sign-in required.
- Verification traffic is real deliberate test traffic and contributes to totals. No invented baseline or historical visitor count was imported.

## Tests and limits
Build passed; all 12 automated analytics tests passed. Local browser checks passed automatic pre-consent counting, no persistent ID before consent, reloads, retry deduplication, decline/GPC, both modes at 320/390/768/1440px and no JavaScript errors. The native daily retention schedule and edge rate-limit enforcement were deployed, but their scheduled execution / abuse behavior have not been live load-tested.

## Configuration and secrets
Six new production-context variables were configured; one existing chat variable was preserved. This Netlify plan rejected custom variable scopes and secret masking with post-processing scope. Variables therefore use platform-default scopes, production context only, and are consumed only in server functions. No credential value is embedded in frontend JavaScript or committed. This is not a claim of Functions-only scope or Netlify masked-secret storage.
Owner access is in a private Git-ignored local file under the workspace's .analytics-local folder. Do not include that folder in any source upload, archive or Git commit. The password is not in this report. New setup/signing-secret files are also private and outside the deployed Git tree.

## Local source situation
Windows allowed new files but denied edits to older files, so the original top-level export was preserved.
Editable tested source: .analytics-local/release-source
Git release checkout: .analytics-local/deployment-checkout
Local snapshot commit b8a7cbe has the same exact tree as remote code commit a39a913 (tree bdeafce8c1ce4d11bfda978f7edcdb834fc0f2d3). Git command-line push failed on Windows credential storage; publication used the connected GitHub API with an expected-head check and no force push. The remote repository is authoritative. Fetch/synchronize it before any future local push; do not overwrite remote history.
Local screenshot: .analytics-local/live-dashboard-2026-10-29.png (verification traffic).
