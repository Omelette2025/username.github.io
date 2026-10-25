# Test results and evidence limits

## Fresh preservation checks — 22 October 2026

Read-only against application files, without rebuilding/overwriting source, executing integration scripts or deploying:

- Git initially clean; main and local origin/main at f248808. No new remote fetch.
- Editable export and corresponding checkout files match after newline normalization; checkout-only legacy files preserved.
- 21 JS/MJS files passed node --check with Node v24.19.0.
- Embedded portfolioData equals projects.json; 16 unique IDs.
- Memberships: structural 6, costing 5, automation 5, Python 2, knowledge 1; overlap intentional.
- Referenced local HTML/catalogue assets exist. Not a full external-link crawler/image decoder audit.
- Batch status Confidential with no images; zero production MP4/WebM files.
- Scoped inventory of 153 tracked filenames/text files found no candidate provider-token, literal-secret, private-key-header, sensitive-filename or internal-path matches. No values from environment credentials were accessed. Binary/images and historical Git blobs not comprehensively scanned.

Private raw records remain in work/checkpoint-static-results.json and work/checkpoint-security-scan.json in the task workspace. Scoped copies are in docs/evidence. Application source unchanged. No new browser/remote provider test is claimed for this documentation pass.

## Earlier successful evidence

| Area | Saved evidence | Verified scope / limit |
| ---- | -------------- | ---------------------- |
| Native demos | work/portfolio-qa-results.json; original test-portfolio.cjs run | Real disposable MP4/H.264 and WebM/VP8 decode/play/seek/pause, playlist/poster/chapters/no-sound-autoplay/Escape cleanup. Fixtures removed. Old script catalogue assertions now stale. |
| Hosted video wiring | Same QA result | YouTube/Vimeo URL handling and iframe lifecycle with stub provider replies. Not real hosted playback. |
| Galleries/cases | QA and later scripts | Image decoding, case galleries/lightbox open/close and historical asset responses. |
| Carousel | portfolio-interaction-results.json + scripts | Desktop movement/hover pause/arrows/keyboard; phone peek/manual. Saved count 23 is historical, not current. |
| Phone layouts | Screenshots/QA | Emulated 360/390/600/768/1440 px; phone modal and production 390 px fit. Not real hardware. |
| Personalized themes | personalized-contrast-results.json | Three worlds, page/sample case/companion: no tested text ratio below 4.5:1; interaction/phone fit. Not complete WCAG audit. |
| Chat | test-companion.cjs | Supplied transcript questions, context/project aliases, case buttons, mobile chat and no server calls for supported local questions. Provider not exercised. |
| Categories | test-category-fix.cjs | Five costing and five automation matches; CAD/MEC/AUTOCALC cross-list, badges/search, All 16. |
| Toolkit | test-toolkit.cjs | Nine coding tools, icon decoding, both toggle directions; earlier keyboard checks recorded. |
| Confidential UI | test-confidential.cjs | Redacted batch text, panda art, drawing placeholders and phone fit. Not Git-history deletion. |
| Production | deployment-verification.json; test-live-deployment.cjs | f248808 live catalogue exactly matched reviewed data; filters/toolkit/local chat/panda/theme/mobile; no observed page errors/missing assets. Last release verification, not rerun now. |
| Pandarithm live sample | Private report/screenshots | 6 m/10 kN sample returned 5 kN reactions, 15 kNm moment, 2.8125 mm deflection. Blank load angle initially prevented adding load; explicit 0 degrees resolved. One sample only. |
| Underlying source evidence | Private report | 20 recorded closed-form Pandarithm comparisons inspected, synthetic CAD actual extraction 6/6/4 + rejection, 10 actual Life OS observer tests rerun in isolation. Not private production/full engineering validation. |

## Inherited test inventory and hazards

Tests live outside site Git in task work; require the scoped evidence archive if only a clone remains. They use machine-specific Playwright require paths, installed Edge, task-workspace cwd and usually port 8780. No portable npm test script exists.

- **STALE:** test-portfolio.cjs expects 23 projects/old carousel and writes temporary videos/manifest, then rebuilds. Do not run blindly.
- **STALE:** test-consolidation.cjs wrongly expects MEC to remain without screenshot.
- **PARTLY STALE:** test-lineage.cjs expects an older placeholder state.
- **Historical text:** test-interactions.cjs results describe 23 even after its dynamic source assertions changed.
- Later category, companion, confidential, toolkit, personalized, mobile-video, text-estimation and live-deployment scripts passed at relevant revisions. Inspect prerequisites/side effects before reuse.
- Old verify/check/refinement/integration scripts are historical tools, not a current suite. Some mutate source/copy private templates. Never execute as a resume shortcut.

Some raw evidence reflects intermediate 23-entry or hidden-MEC states; CURRENT_STATUS/current source supersede those details. No test files were refactored in this preservation session.

## Commands

Read-only syntax, repository root:

```powershell
node --check portfolio.js
node --check companion-answers.js
node --check creative.js
node --check scripts/build.mjs
```

Normal development commands (build writes generated manifest; not performed in this no-source-change checkpoint):

```powershell
npm.cmd run build
npm.cmd run preview
```

Existing private QA, only after reviewing scripts/restoring runtime and preview, from task workspace:

```powershell
node work/test-category-fix.cjs
node work/test-companion.cjs
```

These are not guaranteed portable. Replace hardcoded runtime paths in a separately authorized test-maintenance task. A missing Playwright/runtime is an environment failure, not proof production is broken. Never connect private vault/client data just to reproduce portfolio media.
