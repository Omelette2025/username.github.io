# Demo integration - 25 October 2026

Local only; no commit, push or production deployment. The latest corrected 60-second Pandarithm, Life OS and Estimation Tool exports replace the three empty media slots. Original recordings and editing archives are outside the public site.

Pandarithm includes the user-provided narration text, FEM/matrix stiffness label, and five-page report sequence. The corrected estimation export excludes the opening OBS flash and ends safely before OBS. Life OS uses the previously corrected export. All files are silent native 720p H.264 MP4, with local posters and optional English narration-text subtitles (not an audio transcript).

Configuration: project-media.js. Build discovery: project-media-discovered.js. Existing Watch Demo controls appear on project cards and in case studies. Posters, subtitles and chapters are configured per project. Other projects retain their existing pending/confidential behavior.

The CAD-to-BOQ card retains its existing project identity. The demo description accurately limits this particular recording to component estimation and reinforcement previews; it does not claim demonstrated CAD extraction or independently verified quantities.

Checks are recorded after integration. Production release still requires explicit approval.

## Verified results

Build passed and discovered exactly 3 videos. All three card and case-study buttons open the correct 60-second video with posters, native controls, optional narration-text subtitles, no autoplay, working chapter seeking and HTTP range requests. Escape unloads the media. 390px mobile and Personalized mode passed, with no console errors or missing asset responses. Git diff whitespace check passed. No confidential project video was added. Evidence: demo-integration-qa.json in the dated D-drive recovery folder.

Subtitle cue boundaries were separated by 1 ms; chapter seeks display one active cue without overlapping adjacent narration. Retest passed for all three demos.
