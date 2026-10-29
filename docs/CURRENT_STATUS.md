
## 29 October activation revision
The Netlify project now has a provisioned managed PostgreSQL database. Do not recreate it. Use ANALYTICS_DATABASE_PROVIDER=netlify with @netlify/database; no manually copied database URL is needed. SQL migration netlify/database/migrations/202610290001_portfolio_analytics.sql is applied by Netlify before publication. Personal-token production write access remains disabled.

Basic page opens are now automatic and separate from optional browser/session detail. A document sends one transient UUID for retry deduplication; no persistent browser ID, cookie, page path, IP or referral is stored in the basic table. Privacy signals and bot filters suppress writes. Reloading counts another open. Public label: page opens, never unique people. Daily basic events are retained up to 365 days; anonymous numerical totals remain. Optional detailed tracking, sessions and engaged-time logic remain consent based.

Local QA: build passed, 12 tests passed, Chromium/Edge automatic-open browser QA passed (before consent, unique per-load event, no pre-consent browser ID, decline, GPC, optional consent and 320/390/768/1440px layouts in both modes, no JavaScript errors). Remote driver/migration/rate-limit execution remains unverified until deployment. No production release yet.

Windows denies edits to older source files despite allowing new files. Originals are intact. Editable tested source: .analytics-local/release-source. Fresh Git deployment checkout: .analytics-local/deployment-checkout, based on origin/main 9a13f6e. Exclude all .analytics-local content from publication; it contains tools, caches and local QA data. New source, docs and server migrations are committed from the deployment checkout only after review. Do not publish entire workspace folder or backups.

Server settings required: ANALYTICS_ENABLED=true, ANALYTICS_DATABASE_PROVIDER=netlify, ANALYTICS_ORIGIN=https://portfolioruzzeldulay.netlify.app, ANALYTICS_ENVIRONMENT=production, plus owner-generated signing secret and scrypt password hash. Preserve other environment values. Dashboard is /analytics; no default password. Setup, credential authorization and publication await explicit approval.

Official references: https://docs.netlify.com/build/data-and-storage/netlify-database/api/ and https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/ .

---

> Latest local update: three reviewed demos integrated on 25 October 2026. See DEMO_INTEGRATION_2026-10-25.md. Not deployed.

# Current local recruitment update — 24 October 2026

Read RECRUITMENT_UPDATE_2026-10-24.md first. Local working changes add six supplied/renamed resumes and a compact selector, recruitment narrative, three project disciplines (7 structural / 5 cost / 9 automation; 16 unique projects), role/verification summaries and optional demo slots for every project. Real videos are pending by request. This supersedes the old category counts and single-resume UI. No production push/deployment for this update. Baseline f8fd36c; do not reset these working changes. The earlier handoff below records the preceding session.

---

# Current status

As of 22 October 2026, Asia/Taipei. Scope: portfolio, not certification of its showcased engineering applications.

## Checkpoint

Repository `Omelette2025/username.github.io`, branch `main`. Last deployed application: **f248808e701081ae3d84f024a664d89a1a86a5c4**. Production: https://portfolioruzzeldulay.netlify.app/ . This documentation is a newer local-only commit: resolve with `git log -1 --format=%H -- docs` and the task-local receipt.

At preservation start: clean Git status; main and local origin/main matched the application release; no new remote fetch. All corresponding editable-export files matched after newline normalization. No feature was half-edited. No push, reset or deployment is performed by this task.

Git checkout: task workspace `work/portfolio-deploy/`. Editable export: `outputs/portfolio/`. Private QA/report/rollback material remains outside the publishable site. See AI_HANDOFF for boundaries and missing early history.

## Current behavior and decisions

- Civil-engineer-first static portfolio with desktop rail/mobile dock, Pandarithm showcase, seven engineering slides, supporting tools, case studies/briefs/lightbox, workflow/experience/education, FAQ/contact and reading settings.
- 16 unique projects. Category memberships overlap: structural 6; costing 5; automation 5; Python 2; knowledge 1. CAD-to-BOQ is first in archive and in costing + automation, as are MEC/AUTOCALC overlaps.
- Engineering order: Pandarithm, Project 448 ETABS, drafting, CAD-to-BOQ, remaining warehouse/residential/thesis work. Phone carousel remains stable/manual with peek edge; desktop auto motion remains.
- MEC includes HELIO, expense monitoring, PDF-to-Excel, former Engineering Tools Suite and ledger history. Life OS includes Second Brain/register history. Gamified Reviewing Tool replaces PHAINON. Earlier IDs redirect, not duplicate current cards.
- Actual empty MEC interface screenshot restored. Batch/drafting confidential with headphone-panda lock. Current batch details redacted. Gamified tool uses original panda progress art while current capture is pending.
- Approximate history: user said April; year 2026 was stated as an assumption. Stages overlap; no invented monthly durations.
- Professional Leonard panda; personalized Ajaw/Floaty/Cosmo; readable semantic theme sheet, native controls, focus and mobile-label fixes. Nine coding tools include Codex/Ollama.
- Videos: five prepared project slots, no real recordings, empty controls hidden. Native playback tested with real disposable files; external embeds only stub-tested. Existing guide is the actual upload workflow.
- Local chat answers ordinary factual questions and context follow-ups. Optional general provider chat exists but owner configuration and real operation are unverified; missing key returns 503.

## Roadmap vs reality

| Feature | Status | Evidence | Remaining Work | Priority |
| ------- | ------ | -------- | -------------- | -------- |
| Existing static portfolio retained | DEPLOYED | f248808 + source inventory | Preserve, no framework rewrite | P0 |
| Consolidation/aliases, 16 projects | DEPLOYED | Current data and browser checks | Keep evolution not duplicates | P0 |
| Estimation visibility/categories | DEPLOYED | Live + fresh 5/5 membership counts | Retest after edits | P0 |
| MEC safe screenshot | DEPLOYED | Current asset/gallery; decode checks | Keep populated records private | P0 |
| Confidential batch/drafting | DEPLOYED | Current redacted data/panda | Legacy asset/history review | P1 |
| Carousel, galleries, briefs | DEPLOYED | Earlier local and live browser tests | Current regression maintenance | P1 |
| Phone layout | DEPLOYED | Emulated 360–1440 px; live 390 px | Real hardware coverage | P1 |
| Personalized modes | DEPLOYED | Three-theme scoped contrast/interaction checks | Full accessibility audit | P1 |
| Coding toolkit | DEPLOYED | Nine-icon/toggle + live checks | Additional tools only if evidenced | P2 |
| Connected histories | DEPLOYED | Data/render tests | Confirm precise dates/year | P2 |
| Native video infrastructure | TESTED | Real MP4/WebM fixtures, cleanup | Real project demo | P1 |
| YouTube/Vimeo wiring | TESTED | Stubbed provider lifecycle | Actual owner-hosted playback | P1 |
| Real recordings | PLANNED | Production slots empty | User-approved recordings | P1 |
| Video upload guide | DEPLOYED | Guide included in release | Use for first upload | P1 |
| Local companion answers | DEPLOYED | Transcript and live checks | Broaden only from known facts | P2 |
| General external AI | IMPLEMENTED | Optional function; no live provider proof | Owner configuration/service check | P2 |
| Updated reviewing-tool capture | IN PROGRESS | Progress placeholder | Actual current screenshot/retest | P2 |
| Static consistency | VERIFIED | Fresh syntax/data/assets checks | Portable guardrails | P1 |
| Portable current regression suite | PLANNED | Private scripts, some stale | Parameterize, revise assertions | P1 |
| Comprehensive privacy/licenses | PLANNED | Scoped text scan; licenses retained | Review old assets/history/terms | P1 |
| Underlying engineering validation | IN PROGRESS | Narrow case-study evidence | Separate source-app authorization | Separate scope |
| Documentation preservation | IMPLEMENTED | Eight docs + scoped evidence | Exact local commit in receipt/log | P0 |

PLANNED = not established; IN PROGRESS = partial/ongoing; IMPLEMENTED = code/docs exist; TESTED = scoped tests passed; VERIFIED = direct evidence establishes stated scope; DEPLOYED = production release verified. BLOCKED is reserved for a concrete external prerequisite; nothing is marked blocked merely because untested. These statuses do not mean broad engineering certification.

## Fresh preservation checks

21 JS/MJS syntax passes; embedded data equals external JSON; 16 unique IDs and correct memberships; all referenced local/catalogue assets exist; confidential batch has no screenshots; zero production video files. Node v24.19.0. Scoped scan of 153 tracked filenames/text files found no candidate secret/private-key/internal-path matches. No source files were changed. Binary/image content and Git history were not comprehensively scanned.

Production/browser/provider tests were not rerun in this documentation task. Their earlier results and stale-script warnings are in TEST_RESULTS. No current application regression was established by these static checks alone.

## Exact last task

User authorized publishing; f248808 was deployed and browser-verified. No deployment is pending. The current request is to preserve this session and make a safe local documentation checkpoint. See AI_HANDOFF for the next three proposed tasks; none is authorized to begin now.


## Local update — 28 October 2026 (not deployed)
Analytics implemented: opt-in client events, PostgreSQL storage/deduplication, unioned active-time intervals, public recorded-visits counter and server-authenticated private dashboard. See ANALYTICS_SETUP.md and ANALYTICS_TEST_REPORT.md. Production database/environment configuration and staging/deployment verification remain outstanding; no production settings changed.
Six resumes corrected/tailored and installed locally; November 2024 licensing corrected. Original PDFs preserved in sibling session archive. Added a six-page printable portfolio and download links. See RESUME_AUDIT_2026-10-28.md.
Active source: D:/PROJECT FOLDERS/Engineering Projects/Online Portfolio/portfolio. This is an export without .git; no local checkpoint commit or push for these changes. Do not edit the old C: project or recover unrelated archives. Session artifacts, editable generators, backup and QA evidence are in sibling SESSION_ANALYTICS_RESUMES_2026-10-28.
Next: review final PDFs; configure an isolated database/server-only credentials using setup instructions; verify a staging deploy and obtain approval before production publication. Preserve the strong headline, both modes, projects and existing media.
