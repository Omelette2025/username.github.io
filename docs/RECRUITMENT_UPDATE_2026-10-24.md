# Recruitment upgrade — 24 October 2026

Local review build only: not pushed or deployed. Last deployed application remains f248808; documentation baseline f8fd36c. All 16 projects, the existing design, mascot, gallery, chat and motion systems remain.

## What changed

- Hero: RUZZEL A. DULAY, RCE; Civil Engineer | Structural Design · Cost Engineering · Automation. Summary reflects existing structural analysis/modeling, cost management, estimation and software development without new performance or production-readiness claims.
- General Civil Engineer is the default hero, sidebar and contact download. A compact labelled native selector offers six real supplied PDFs, a selected download, description and new-tab preview.
- Single mapping: resume-config.js. Behavior: resume-selector.js. Theme-aware layout: recruitment.css. All PDFs are in assets/resumes/.
- Three project disciplines: Structural Engineering; Cost Engineering & Quantity Surveying; Engineering Automation. Overlapping memberships: 7 / 5 / 9; All remains 16 unique projects. Earlier Python/knowledge entries remain within automation. Relevant existing cards are ordered first per discipline.
- Case studies and briefs now show objective, actual role, tools/methods, deliverables and verification boundaries. Archive cards add concise role/tools lines. Confidential details stay withheld.
- Every project has an empty optional demo slot. Existing player also handles ordinary archive cards. Confidential projects reject public recordings at build. No actual videos were added: the user asked to wait. Cases show pending or confidential fallbacks.
- Updated factual SEO metadata, resume navigation, active legacy resume link and PDF-download achievement matching. Old asset copies were retained rather than deleted.

## Six renamed PDFs

1. Ruzzel_Dulay_General_Civil_Engineer_Resume.pdf
2. Ruzzel_Dulay_Junior_Structural_Engineer_Resume.pdf
3. Ruzzel_Dulay_Graduate_Engineer_Resume.pdf
4. Ruzzel_Dulay_Cost_Engineer_Cost_Control_Resume.pdf
5. Ruzzel_Dulay_Quantity_Surveyor_Cost_Estimator_Resume.pdf
6. Ruzzel_Dulay_Civil_Engineering_Automation_Resume.pdf

Copied from the user-supplied ZIP, parsed as two pages each and SHA-256 checked identical to original bytes. PDF contents and provenance metadata were not edited; original ZIP untouched. A separate renamed delivery ZIP is outside the public site.

## Verification

- npm.cmd run build passed: six genuine PDF paths/signatures and synchronized data validated; zero demo recordings.
- All six PDF requests: HTTP 200, PDF content type, exact byte identity and correct actual browser download filenames. Native selector keyboard behavior, descriptions, preview and General default passed.
- Filters/priorities/counts passed at 7/5/9, retaining 16 unique projects. Case fact sheets, confidential batch and demo fallback passed.
- Local anchors/resources and email/LinkedIn link targets checked. No email sent. External account ownership and service availability were not independently established.
- Widths 360/390/768/1440 and personalized mobile fit passed without document overflow. Three personalized themes passed existing scoped contrast/case/companion checks. Not a full real-device/screen-reader/WCAG audit.
- No browser page errors or missing local assets. Twenty-three JS/MJS syntax checks passed. Site source had no internal drive-path matches.
- Native player tested from an ordinary archive card with a routed disposable fixture: playback/seek/no autoplay/Escape teardown passed. Fixture was not written to production content.
- Conservative asset inventory found 25 potentially unreferenced assets. Legacy routes/dynamic paths may use them; none deleted. Not a complete history/license audit.

The repository had no npm test command. Applicable saved checks and a targeted recruitment browser regression were run instead. Old scripts expecting 23 projects or no MEC screenshot are stale and must not dictate current content. QA reports/screenshots/byte manifest are outside the publishable site.

## Preview and release

From portfolio root:

```powershell
npm.cmd run build
npm.cmd run preview
```

Default URL: http://127.0.0.1:8780 . Recruitment QA used PORT 8783 to avoid another preview. Stop only the owned preview or choose another port if occupied. Static preview does not emulate Netlify functions.

After explicit approval, review/stage intended application files, all six PDFs, config/selector/styles, updated data/scripts/guide and generated manifest in the deployment repository. Commit and push to main to trigger the existing Netlify workflow. Review documentation before including it because publish root is '.'. Verify the deployed commit, six downloads, mobile selector, filters and assets. This document does not authorize publication.

## Remaining items

Actual demo recordings are pending by request. General AI-provider availability, precise historical dates, updated reviewing-tool capture, comprehensive accessibility/device/legacy-asset/license reviews remain unfinished. New files are the owner's supplied recruitment resumes, not private employer records. Their professional contact details/content remain unchanged for the owner's final public-release review.
