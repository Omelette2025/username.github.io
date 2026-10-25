> Latest local update: three reviewed demos integrated on 25 October 2026. See DEMO_INTEGRATION_2026-10-25.md. Not deployed.

# Current local recruitment update — 24 October 2026

Read RECRUITMENT_UPDATE_2026-10-24.md first. Local working changes add six supplied/renamed resumes and a compact selector, recruitment narrative, three project disciplines (7 structural / 5 cost / 9 automation; 16 unique projects), role/verification summaries and optional demo slots for every project. Real videos are pending by request. This supersedes the old category counts and single-resume UI. No production push/deployment for this update. Baseline f8fd36c; do not reset these working changes. The earlier handoff below records the preceding session.

---

# AI handoff — engineering portfolio

Prepared 22 October 2026, Asia/Taipei. Scope: this conversation's portfolio only. This preservation task does not authorize new features, refactoring, pushing or deployment.

## Resume from this checkpoint

- Last deployed application: **`f248808e701081ae3d84f024a664d89a1a86a5c4`**, branch **`main`**, repository **`Omelette2025/username.github.io`**.
- Production: https://portfolioruzzeldulay.netlify.app/ . It was verified after the release; no fresh live check was performed in this documentation pass.
- These documents are a subsequent **local-only** checkpoint. Resolve its exact hash with `git log -1 --format=%H -- docs`; the task-local `CHECKPOINT_RECEIPT.md` also records the final documentation commit.
- At checkpoint start Git was clean. `main` and the local `origin/main` tracking ref matched the deployed commit. No remote fetch was performed during preservation, so this is not a fresh remote-state assertion.
- There was no half-edited feature or pending deployment. Immediately preceding this checkpoint, the user requested publishing; it completed successfully. The exact task now is preservation and handoff.

## Locate the files

The authoritative Git checkout is the task workspace's **`work/portfolio-deploy/`**, containing this `docs/` folder. The workspace itself is not a Git repository. A corresponding editable export is **`outputs/portfolio/`** in that workspace. All matching application files were equal after CRLF/LF normalization at checkpoint start. If only a clone survives, use the Git checkout as source of truth; do not assume the separate workspace exists.

Outside the public site, the task workspace retains QA scripts, screenshots, rollback ZIPs, private source-evidence copies and `outputs/PORTFOLIO_ENHANCEMENT_REPORT.md`. That report is reverse chronological, contains superseded states and private source paths, and must not be copied into the public site. The task-local checkpoint receipt identifies the scoped evidence archive. Existing test scripts have machine-specific paths and several stale expectations.

The original engineering applications and original reference portfolio are separate **read-only private inputs**. This is not permission to modify them. Their discovery locations remain in the private report rather than these potentially publishable docs. Missing older assistant turns are not assumed available; see PROJECT_HISTORY.

## User intent and non-negotiable design decisions

Ruzzel A. Dulay is a Registered Civil Engineer. Position civil/structural engineering first, supported by estimation, cost control and practical automation. Continue the existing portfolio; no framework rewrite. Do not invent credentials, availability, metrics, testimonials, engineering certification or software validation. Use authentic sanitized screenshots, not generated application interfaces.

References were the original panda/green/arcade identity, Nova/WebScale typography/motion and BrewedOps-style compact profile/project presentation. Do not copy proprietary media or remove retained licenses. The user rejected tiny text, decorative arrow glyphs, clutter, oversized empty boxes and overpowering motifs. External launch links now use SVG icons. Keep every experience entry visible together. Visible Nova footer attribution was removed by request; license files remain.

Professional companion is **Leonard**, a rounded panda logo inspired by the supplied reference, wearing **headphones only**: no chains or outfit. Personalized companions: **Ajaw** for green/all, **Floaty** for cloud/coding, **Cosmo** for cosmos/costing. Keep readable palettes, subtle edges, stable mobile layout and user motion controls. Do not restore the old pale-on-pale chips or mobile companion labels.

## Implemented application

Static HTML/CSS/JavaScript, with dependency-free Node build/preview and one optional Netlify function. No React/Astro framework runtime or Python server is needed for the website.

- Desktop rail, mobile dock, Pandarithm showcase/tabs, seven-card engineering carousel, supporting tools, searchable/filterable archive, case-study and Markdown brief downloads, captioned galleries/lightbox, workflow tabs, education/experience, FAQ/contact, reading preferences and companion chat.
- **16 unique projects**, not the earlier intermediate 23. Category memberships overlap: structural 6, costing 5, automation 5, Python 2, knowledge 1. CAD-to-BOQ, MEC and AUTOCALC span costing and automation. CAD-to-BOQ is first in the archive and visible in supporting tools.
- Engineering order: `pandarithm`, `legacy-2` (Project 448 ETABS only), `drawing`, `cad-to-boq`, `legacy-3`, `legacy-4`, `legacy-5`.
- Desktop carousel auto movement pauses on hover/focus/dialog. Phone behavior is swipe/manual navigation with peek edge; do not reintroduce moving/clipped phone text.
- Coding toolkit: Codex, Ollama, VS Code, Git/GitHub, Python, JavaScript, HTML/CSS, Flask, SQLite. New local icons include custom symbolic marks rather than a claim that all are official artwork.

### Evolving projects, not duplicates

**MEC Cost Control Suite** includes the newest HELIO dashboard, Expense Monitoring Normalizer, PDF/check-voucher-to-Excel extraction, former Engineering Tools Suite and ledger/reconciliation history. Its approved actual screenshot is the empty/no-records interface. The user objected when the assistant incorrectly removed it: keep this screenshot, withhold populated workplace records.

**Life OS** grew from Second Brain and incorporates project review/register, documentation and agent-assisted workflows. Do not recreate standalone current cards for the earlier Second Brain/register. Its source-template screenshot uses isolated sample API responses, not the private production database/vault. Local-first does not mean optional cloud authoring is offline.

**Gamified Reviewing Tool** replaces PHAINON. Its updated interface has not been captured/retested. Show the original headphone-panda work-in-progress illustration until approved current media exists; it is not a fake screenshot or claimed completion percentage.

**CAD-to-BOQ Estimation Automation** is a current development project, separate from old IEEI AUTOCALC and workbook-audit work. Preserve its Cost & estimation/automation cross-listing and ongoing verification status. Synthetic quantities and prices are not a final estimate.

**Calculation Batch Runner & Evidence Reports** and coordinated drafting are confidential. Batch implementation details were removed from current public descriptions, search text and chat knowledge. Keep headphone-panda lock placeholders. UI redaction is not historical Git erasure or a purge of unused legacy assets.

MEC/Life OS connected histories use an approximate April start, overlapping iteration, and present development. The user supplied “around April”; **2026 was the assistant's stated assumption**. Do not invent individual monthly milestones or make durations look longer without evidence.

### Authentic media and engineering boundaries

Pandarithm dashboard and beam plots were captured live using a sample model. CAD media is the actual viewer with a synthetic workbook. Life OS is its actual source template with sample API data and private vault disconnected. The old Second Brain image was cropped to remove terminal/path panes. Panda progress/lock art is explicitly illustrative.

The live beam sample matched independent values: 6 m span, 10 kN midspan load, E = 200 GPa, I = 8e-5 m4; reactions 5 kN each, maximum moment 15 kNm, deflection 2.8125 mm. One test is not platform certification. Repository evidence records 20 closed-form comparisons; they were not all newly rerun. Isolated actual CAD extraction returned 6 m, 6 m2 and four markers, rejecting an open-area polygon. Ten actual Life OS observer tests passed in isolation. Underlying apps remain beta/provisional with their own validation gaps.

### Demo videos

`project-media.js` is the manual config. Build discovers direct MP4/WebM files in `assets/projects/<id>/videos/` and writes `project-media-discovered.js`. Manual entries override the matching source without duplication. Prepared IDs: `pandarithm`, `cad-to-boq`, `lifeos`, `mec-html-suite`, `legacy-9`. **All production slots are empty**; no demo was fabricated and no Watch Demo control appears until valid media exists.

Player supports native MP4/WebM, HTTPS files, standard YouTube and numeric Vimeo, playlists, native posters, descriptions, chapters, controls/fullscreen, no sound autoplay, lazy creation, Escape/backdrop closing and pause/unload/removal on close. Hosted players use provider posters/permissions; private Vimeo hash URLs are unsupported. Real temporary MP4/WebM fixtures passed. Hosted lifecycle tests were stubbed, not real playback. See `../HOW_TO_ADD_PROJECT_VIDEOS.md` for exact workflows. Do not publish automatically.

### Companion chat

`companion-answers.js` supplies local facts/ordinary-language intents and project context before `creative.js` falls back to curated voices. Fixed examples: current job → Cost Control Engineer/MEC; last job → IEEI; graduation → 2024; flagship → Pandarithm; Second Brain → Life OS; extractor/HELIO → MEC; follow-ups → actual case-study content. Buttons open current IDs. Unknown personal questions must not receive invented answers.

Broader deployed chat optionally calls `/.netlify/functions/chat`. It needs owner-managed `GEMINI_API_KEY` and provider availability; no key was accessed or verified. Missing configuration returns 503. Broad AI chat was **not** verified. Localhost/file preview does not emulate this service. Busy input/prompt guards prevent silently discarded messages. Provider/model/quota comments are historical, not a promise of current free access.

## Architecture and editing traps

`index.html` has static cards **and** embedded `#portfolioData`; `projects.json` is a second data copy. Keep all three, category badges, search strings, `data-categories` and public chat knowledge aligned. The build does not regenerate cards or check data equality. Stable aliases consolidate retired IDs into MEC/Life OS.

Only active sheets: `nova-foundation.css`, `project-videos.css`, `project-history.css`, then `theme-accessibility.css`. Old sheets are retained but unlinked. The foundation has accumulated overrides: inspect specificity. Semantic `--paper`/`--ink` alias surface/text for newer panels. Deferred script order matters: answer engine before creative chat, carousel before gallery/video enhancements, media config/manifest before player, history after case handling. Clones remain aria-hidden and untabbable. Events include `portfolio-project-open` and `portfolio-gallery-open`.

Legacy root `Data Extractor.py` and several image variants exist only in the Git checkout, not the export. They are pre-existing and not website dependencies. Preserve/audit before cleanup; do not install Python packages to serve this site.

## Commands and evidence

From repository root:

```powershell
node --version
npm.cmd run build
npm.cmd run preview
```

No website packages need installing. Open `http://127.0.0.1:8780`; do not start a second server on an occupied port. `PORT` can select another port. Direct file browsing works for basics; HTTP preview is recommended for video. Build writes the generated manifest; preview serves byte ranges, but no Netlify functions.

Read-only syntax checks:

```powershell
node --check portfolio.js
node --check companion-answers.js
node --check creative.js
node --check scripts/build.mjs
```

Read TEST_RESULTS before inherited browser scripts. Private `work/*.cjs` scripts need Playwright/Edge, hardcoded local runtime paths and task-workspace cwd. They are not portable npm tests, and some write fixtures/manifests. **Do not blindly run old test-portfolio.cjs** (23 projects/obsolete carousel), **test-consolidation.cjs** (expects absent MEC screenshot), or **test-lineage.cjs** (old placeholder assertion). Do not alter the app to satisfy stale tests. Early integration/refinement scripts can mutate source; do not run them as a resume shortcut.

Fresh checkpoint checks: 21 JS/MJS syntax passes, embedded/external JSON equality, 16 IDs, correct memberships, existing referenced assets, confidential batch with no images and no production videos. Scoped tracked-text/filename scan found no candidate secrets/private keys. Source was unchanged. This is not a comprehensive binary/history/license/accessibility audit.

Earlier browser results include real fixture video playback/teardown, galleries, desktop/mobile layout, three-theme scoped contrast, categories, local chat and production verification. Distinguish historical successful tests from fresh checks; see TEST_RESULTS and docs/evidence. If only the Git clone remains, the private evidence archive may be unavailable: say so.

## Outstanding tasks and next three priorities

1. Make QA portable/current against the 16-project catalogue and restored MEC media. Preserve meaningful media/error-path tests; don't merely mirror implementation.
2. Add the first real, approved, non-confidential project demo using the existing guide. Verify actual desktop/phone playback, poster, chapters, teardown and provider permissions if hosted.
3. Review remaining media/privacy/license/accessibility issues with the user; confirm dates and current review-tool capture. Verify optional general AI only if requested, without exposing credentials or assuming quota/model availability.

Other boundaries: no actual demos yet; no comprehensive real-device/screen-reader audit; general AI unverified; precise dates unconfirmed; legacy unused images and Git history not comprehensively checked. Underlying engineering validation remains a separate authorized scope. A functioning UI does not certify calculations.

## Restrictions

This task is preservation only. Do not touch unrelated projects/private engineering sources; fabricate screenshots/dates/metrics; publish confidential drawings, rates, notes, internal paths or credentials; delete/reset/force-push history; refactor or deploy. New docs are local-only until separately reviewed/authorized. Netlify publishes the repository root, so review documentation and private evidence carefully before any future push. Keep license files.

## READY-TO-PASTE CONTINUATION PROMPT

> Continue this existing engineering portfolio from its saved checkpoint. First read docs/AI_HANDOFF.md, docs/CURRENT_STATUS.md, docs/KNOWN_BUGS.md and docs/TEST_RESULTS.md, then inspect Git status/log without resetting anything. Last deployed application: f248808e701081ae3d84f024a664d89a1a86a5c4 on main in Omelette2025/username.github.io, live at https://portfolioruzzeldulay.netlify.app/. The newer documentation checkpoint is local only; find it in Git history and the task-local CHECKPOINT_RECEIPT.md. Scope is this portfolio, not its private source applications. Preserve 16 consolidated projects, estimation's costing/automation memberships, MEC's restored empty screenshot, readable personalized themes, headphone-panda identity, confidentiality art and existing video/chat systems. Do not restore obsolete 23-project test assumptions. Keep cards/embedded JSON/projects.json consistent. Do not invent dates/results or expose private material. No push/deploy, new feature, refactor or destructive cleanup without a concrete new user task. Summarize the saved state and ask which documented next task the user wants; if a task accompanies this prompt, perform only that task with appropriate verification. Use the local receipt/evidence archive if available; otherwise state what historical evidence is missing.
