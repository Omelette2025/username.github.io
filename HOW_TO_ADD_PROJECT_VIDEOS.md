> 25 October 2026: the three reviewed demos are now configured locally. Other slots remain pending. Optional `captions` accepts a local `.vtt` path in the project videos folder. See docs/DEMO_INTEGRATION_2026-10-25.md.

# How to add project videos

Open a terminal in the portfolio folder containing `index.html` and `package.json`. Node.js is required; no dependency installation is needed. Paths below are relative to that folder.

## Copy a recording and build

| Project | Video folder | Recommended filename |
|---|---|---|
| Pandarithm | `assets/projects/pandarithm/videos/` | `structural-analysis-and-design.mp4` |
| Life OS + Second Brain | `assets/projects/lifeos/videos/` | `automated-project-documentation.mp4` |
| CAD-to-BOQ | `assets/projects/cad-to-boq/videos/` | `automated-estimation-workflow.mp4` |
| MEC Cost Control Suite | `assets/projects/mec-html-suite/videos/` | `cost-control-workflow.mp4` |
| Gamified Reviewing Tool | `assets/projects/legacy-9/videos/` | `reviewing-tool-demo.mp4` |

1. Open the matching folder and copy your MP4 or WebM recording directly into it. Use lowercase filenames with hyphens. Do not start filenames with `_` or `.` or use subfolders.
2. Run `npm run build`. This discovers recordings and updates `project-media-discovered.js`. A filename such as `beam-analysis.mp4` becomes the title **Beam Analysis**.
3. Run `npm run preview`. Open `http://127.0.0.1:8780`, find your featured project and click **Watch Demo**, or open its case study. If the preview is already running, just refresh it after building; do not start a second server on the same port. Stop preview with Ctrl+C.
4. Copy more recordings into the same folder and rebuild to get a playlist. No recording means no Watch Demo action or broken player.

Discovery runs at build time. The browser cannot enumerate the folder. Every project has a configuration slot, and additional project IDs use the same assets/projects/<id>/videos convention. Confidential projects reject public recordings during the build. Three reviewed demos are configured; remaining recordings are pending. Do not add private source files. Rebuild after adding, renaming or removing files.

## Customize titles, thumbnails and chapters

Edit **`project-media.js`**, the single manual configuration file. Do not edit the generated manifest. Replace the appropriate empty `videos: []` with entries like this:

```js
pandarithm: {
  videos: [{
    src: 'assets/projects/pandarithm/videos/structural-analysis-and-design.mp4',
    title: 'Pandarithm — Structural Analysis & Design Demonstration',
    description: 'Model creation, engineering inputs, analysis, diagrams and reports.',
    thumbnail: 'assets/projects/pandarithm/screenshots/demo-poster.webp',
    chapters: [
      { time: '0:00', title: 'Model creation' },
      { time: '0:40', title: 'Engineering inputs' },
      { time: '1:20', title: 'Results visualization' },
      { time: '2:10', title: 'Calculation report' }
    ]
  }]
},
```

Copy an actual thumbnail into the stated screenshots folder first. Omit `thumbnail` if you have none. Description and chapters are optional. Chapter times must fit the recording. A manual entry with the identical `src` overrides the discovered title without duplicating the video. Preserve commas and surrounding braces.

For **Life OS**, edit `lifeos` and use:

```js
{ src: 'assets/projects/lifeos/videos/automated-project-documentation.mp4',
  title: 'Life OS + Second Brain — Automated Project Documentation',
  thumbnail: 'assets/projects/lifeos/screenshots/demo-poster.webp' }
```

For **estimation**, edit `'cad-to-boq'` and use:

```js
{ src: 'assets/projects/cad-to-boq/videos/automated-estimation-workflow.mp4',
  title: 'CAD-to-BOQ — Automated Estimation Workflow',
  thumbnail: 'assets/projects/cad-to-boq/screenshots/demo-poster.webp' }
```

These are examples: add the files before the entries, or omit optional thumbnails. Multiple entries go in the same array, separated by commas. Local posters appear on the native player. Hosted embeds use the provider's own thumbnail after opening.

## Use YouTube or Vimeo

1. Upload your non-confidential recording through YouTube Studio. Wait for processing; choose Public or Unlisted visibility and allow embedding. Private videos generally cannot play for visitors.
2. Copy the Share URL and paste it as `src` in the matching entry in `project-media.js`:

```js
lifeos: {
  videos: [{
    src: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
    title: 'Life OS + Second Brain — Automated Project Documentation',
    description: 'A walkthrough using sample notes.'
  }]
},
```

Replace the placeholder with your actual URL. Standard watch, Share and Shorts URLs work. Vimeo numeric links such as `https://vimeo.com/123456789` are supported with your real ID; private hash links are not supported. HTTPS links to hosted MP4/WebM files also work if their host permits playback.

Build and preview as above. The modal creates the hosted player only when opened. It does not autoplay with sound; closing removes the player. Chapters seek native video or reload the hosted embed at the selected time without autoplay.

## Publish through the existing Git → Netlify workflow

**This enhancement has not been deployed. Review it and approve release first.** Git push triggers publication.

The existing site uses `main` in `Omelette2025/username.github.io` with Netlify continuous deployment. Publishable site contents belong at the repository root. If you are editing the supplied `outputs/portfolio` deliverable, copy its reviewed contents into your existing deployment checkout first. Do not copy enclosing work/evidence folders.

From the deployment checkout, run:

```powershell
npm run build
npm run preview
```

Review the recordings on desktop and phone. Stop preview, inspect `git status`, and stage only intended site files. For a video-only update after approval:

```powershell
git add assets/projects project-media.js project-media-discovered.js
git diff --cached --stat
git commit -m "Add project demonstration videos"
git push origin main
```

For the first infrastructure release also include the reviewed player files, scripts, HTML, project data, CSS, package file, Netlify config and this guide. Avoid blanket staging from a folder containing private material.

`netlify.toml` builds with `node scripts/build.mjs` and publishes `.`. Confirm the existing Netlify site remains linked to the same repository/main branch and has no conflicting base-directory or publish settings. Wait for a successful deploy. Open production, hard refresh, play and seek each recording, test fullscreen and close to confirm playback stops. Repeat on a real phone. A local build does not confirm a deployment.

## Recording recommendations

Use MP4 with H.264 video and AAC audio, 1080p and 16:9. Compress enough to load quickly while keeping engineering text readable. WebM works when the device supports its codec. Review every frame for client names, confidential prices, private notes, paths, tokens and notifications. Use sample projects. Prefer YouTube for long/large recordings to avoid large Git history, transfer costs and mobile downloads. The build warns above 50 MB; that is a recommendation, not a hosting limit guarantee.

## Troubleshooting

| Problem | Fix |
|---|---|
| Video not appearing | Check the project folder, extension and direct file placement. Rebuild and inspect `project-media-discovered.js`. Files beginning `_` or `.` are ignored. Hard refresh. |
| Wrong path | Use exact filename/case, `/`, and `assets/projects/…`; no drive letters or `..`. Build reports missing configured local files. |
| Unsupported format | Renaming MOV to MP4 does not convert it. Export H.264/AAC MP4 and test the actual device. |
| Broken thumbnail | Copy the image first and use its exact relative PNG/JPG/WebP/SVG path, or remove `thumbnail`. Build checks missing local posters. |
| Mobile failure | Use HTTPS production, H.264 MP4 and tap play. Unusual codecs or large files can fail despite a correct extension. |
| Slow loading | Compress/shorten the recording or use YouTube. Native players initially load metadata; hosted embeds load when opened. |
| YouTube embed error | Check actual ID, processing, Public/Unlisted visibility and embedding permission. Owner, age, region and copyright restrictions can block embeds. |
| Netlify size/deploy issue | Read the deploy log and current account limits. Move large recordings to YouTube or a media host. Removing a file does not remove its existing Git history. |
| Old production content | Confirm the deployed commit, generated manifest and filename case, then hard refresh. |

Unconfigured video arrays remain empty. Disposable test recordings are not production content. Provider URL handling and teardown are tested separately from future hosted recordings, whose availability you must check after upload.
