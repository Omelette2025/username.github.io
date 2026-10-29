# Known bugs, limitations and fixed regressions

Application state: deployed f248808. This preservation pass did not perform new browser investigation or fix application behavior.

## Open / unverified

| ID | Finding | Evidence and scope | Next action |
| -- | ------- | ------------------ | ----------- |
| QA-01 | Some saved tests are stale | test-portfolio.cjs expects 23 projects/old carousel; consolidation expects MEC screenshot absent; lineage has an old media assertion; interaction result description still says 23. | Align tests to current requirements, not app to old assertions. |
| QA-02 | QA scripts are not portable or tracked in site Git | Private work scripts hardcode Playwright/Edge runtime paths/task cwd; some mutate fixtures/manifests. | Preserve scoped archive; review before rerun. |
| CHAT-01 | Broad AI service not verified | Optional function needs owner provider configuration, controlled 503 if absent. | Test only if requested; no keys in logs/docs. Known local facts work. |
| MEDIA-01 | No actual demo recordings | All production slots intentionally empty. | Approved real recording, then actual playback test. |
| MEDIA-02 | Real YouTube/Vimeo playback unverified | Provider tests stubbed responses; private Vimeo hash links unsupported. | Check real owner URL/permissions/devices. |
| CONTENT-01 | Manual content synchronization | Cards, embedded/external JSON and public knowledge can drift. Fresh JSON equality currently passes. | Synchronize cards, counts, data-categories/search/knowledge; improve guardrails when authorized. |
| HISTORY-01 | Date precision unresolved | User said April; 2026 was assistant's stated assumption. | Confirm before finer date/duration claims. |
| PRIVACY-01 | Redaction is not historical erasure | Batch current details redacted, old graph cropped; unreferenced assets and earlier Git blobs not comprehensively reviewed. Project 448 floor plan hidden from UI, not proven purged. | Audit privately; no destructive cleanup/history rewrite in this task. |
| LICENSE-01 | Inherited asset/terms review incomplete | License files retained; visible footer credit removed by request. | Verify terms; no invented permission/legal conclusion. |
| UI-01 | Coverage is not comprehensive accessibility | Scoped contrast/emulation passed, not all screen readers/hardware/states. | Formal broader review if requested. |
| UI-02 | Accumulated CSS overrides | Four active sheets, many retained unlinked legacy sheets. | Inspect actual load/specificity; avoid unsolicited rewrite. |
| DEPLOY-01 | CLI credentials failed during release | Windows credential store unavailable; connected GitHub succeeded. | Inspect authorized connection for a future publish; do not expose credentials. |
| SOURCE-01 | Private applications retain validation gaps | Beta Pandarithm, provisional estimation/native Excel release, optional Life OS integrations. | Accurate case-study limits; separate source-app task. |

## Fixed in this conversation

- Phone header/spacing and unstable/clipped touch cards; desktop movement retained.
- Decorative launch glyph/stretched button replaced with compact SVG-icon actions.
- Incorrectly removed empty MEC screenshot restored by explicit user correction.
- Multiple old tools represented as separate current products: consolidated MEC/Life OS with history/aliases.
- Eight malformed punctuation sequences, including Structures Â· Cost Â· Automation, corrected and scanned.
- Current estimation missing from Cost & estimation: multi-category memberships, badges/search and prominent placement fixed.
- Personalized pale chips/panels/native controls/mobile companion label: semantic theme fixes and scoped verification.
- Ordinary current-job/previous-job/graduation/flagship questions falling through: local facts/intents/context resolution.
- Busy online form silently dropping messages: input/prompt guard/restoration.
- Undefined-key external request: explicit unconfigured-service response.
- Confidential batch current descriptions/search/chat details: generic private status and headphone-panda lock.

Old screenshots/test output may depict intentionally superseded states. Do not restore them as a 'fix'. No untested issue is claimed to be a reproduced production failure.


## 28 October 2026 local scope
Analytics production integration awaits a dedicated database, server environment configuration and staging verification. Local tests pass; Netlify edge rate limits and scheduled invocation are not verified in production. Existing unused sw.js has a legacy syntax issue and no registration references were found; it was not changed by this task.
