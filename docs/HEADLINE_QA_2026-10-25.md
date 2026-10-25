# Approved hero headline and QA - 25 October 2026

The homepage leads with the user's exact headline: "Engineering with precision. Innovating with purpose." It is the single H1, with the second sentence on its own line. Name/RCE is a smaller supporting line beneath, followed by the role line and introduction. The duplicate name above the headline was removed. Professional and Personalized modes keep the same main headline.

## Checks

- Build passed: all 6 resume PDFs and 3 configured demos found; embedded project catalogue remains synchronized.
- Hero hierarchy checked in both modes at 320, 360, 390, 768 and 1440px: one H1, exact wording, name beneath and smaller than headline, no document overflow. Screenshots reviewed after transitions settled.
- All 6 PDFs returned 200, downloaded with correct filenames and byte hashes. Native selector keyboard use/default general resume passed.
- Category filters, priority ordering, 16 project entries, case studies, confidential fallbacks and active local/contact link targets passed.
- Three actual demo players passed card/case-study opening, 60s metadata, controls, no autoplay, subtitles without boundary overlap, chapter seek, range requests and Escape teardown.
- 390px mobile player and Personalized mode passed. Text contrast checks found no failures across all three Personalized worlds for page, case-study and companion contexts.
- No browser/page errors or missing asset responses in the scoped checks. Existing optional AI-provider chat and external LinkedIn account ownership were not independently exercised; real-device testing is outside this automated pass.

No project data, resumes, engineering calculations, video content or confidentiality settings were changed by this correction. Publication is separately recorded in the deployment receipt.
