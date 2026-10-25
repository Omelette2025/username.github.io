# Architecture

Static HTML/CSS/JavaScript. Node supplies build/preview; no site Python backend or framework compilation. Showcased engineering apps are separate and not website dependencies.

| File/module | Purpose |
| ----------- | ------- |
| index.html | Static page/cards, embedded portfolioData and companion voice data |
| projects.json | Separate catalogue copy; manually synchronized |
| portfolio.js | Modes, filters/search, case studies, Markdown briefs |
| companion-answers.js | Offline facts/intents, project aliases and follow-up context |
| creative.js | Chat UI, companion voices, achievements, optional AI request |
| portfolio-hub.js | Galleries, reading settings, FAQ, workflows, section navigation |
| project-carousel.js | Auto/manual movement, clones, pause/keyboard/touch behavior |
| flagship.js | Pandarithm panels/tabs and screenshot gallery events |
| toolkit.js | Engineering/coding strip toggle and edge-path variables |
| nova-motion.js | Viewport/reveal effects |
| nova-lenis-lib.min.js, nova-scroll.js | Bundled Lenis and scroll/motion integration |
| project-history.js | MEC/Life OS connected history and case-study insertions |
| project-media.js | Hand-edited video config |
| project-media-discovered.js | Build-generated local video manifest |
| media-utils.js | Source/poster/timestamp validation and merge/dedup |
| project-videos.js | Actions, responsive dialog/player, playlist/chapters, teardown |
| scripts/build.mjs | Video discovery, config/path/HTML-asset checks |
| scripts/preview.mjs | Local static MIME/range/no-store server |
| netlify/functions/chat.js | Optional serverless provider adapter |
| public_brain.md | Public-only knowledge for optional online answers |
| assets/icons, assets/img | Local icons/art/photos/real captures |
| assets/projects/id | Screenshots and prepared video folders |
| licenses/ | Retained inherited licenses/asset notes |

## Data and synchronization

The page parses embedded JSON and uses pre-rendered cards; it does not fetch projects.json. The external JSON, embedded JSON, cards, filter badges, search attributes and public chat knowledge require coordinated edits. Build currently does not regenerate cards or check catalogue equality. Fresh checkpoint checks establish current equality.

Primary cat selects the case-study label; optional categories and HTML data-categories enable overlaps. Current 16 IDs remain stable. Old projectAliases point retired entries into MEC/Life OS rather than duplicate products. Carousel clones are aria-hidden/untabbable. gallery/video enhancements must respect clones and execution order.

Deferred order matters: local resolver before creative chat; carousel before enhancement; media config/manifest before media utilities/player; history after catalogue dialogs. Events include portfolio-project-open and portfolio-gallery-open. Motion/theme events coordinate preferences and scrolling.

## Styles

Active load order: nova-foundation.css → project-videos.css → project-history.css → theme-accessibility.css. Numerous other CSS files remain unlinked. Inspect actual loaded sheets, not names alone. Foundation has accumulated overrides. Mode/template attributes select professional, forest/all, cloud/coding or cosmos/costing. Semantic surface/text/muted/accent/border/button tokens support all panels; paper/ink alias surface/text. Preferences persist in localStorage and HTML attributes. New final rules prevent pale-on-pale history chips and stray mobile companion labels.

## Video

Five configured IDs have direct MP4/WebM discovery. Underscore/dot names ignored; no browser folder enumeration. Manual entries override matching discovered paths. Native video/allowed provider iframe is created only on opening; closing pauses/unloads/removes it. No sound autoplay; native controls/playsinline; posters and chapters optional; provider permissions external. Empty lists hide controls. Preview range responses support seeking. Player dialogs pause carousel movement.

## Chat

Local facts/intents precede curated responses. Unsupported local/file queries receive a scoped fallback. Deployed unsupported questions may call the Netlify function with owner-managed provider configuration. Environment variable name is in code, never its value. Missing key gives 503. General provider operation was not verified. Provider quota/model comments are historical, not a guaranteed current contract.

## Running and deployment

Node required, no application dependencies to install. npm run build executes node scripts/build.mjs and writes the manifest. npm run preview serves 127.0.0.1:8780 (PORT override); it does not emulate functions. Direct file opening supports basics; HTTP preview recommended for media.

Netlify: build node scripts/build.mjs; publish '.'; functions netlify/functions; included public_brain.md. Main triggers the existing site; last verified release f248808. Review all docs/assets before a future authorized push because repository-root publishing includes new files. This checkpoint deploys nothing.

Root legacy Data Extractor.py and some old asset variants exist only in the checkout. Not site runtime dependencies; not executed or removed. Private source apps, databases, fixtures, screenshots awaiting review and QA work must remain outside publishable folders.
