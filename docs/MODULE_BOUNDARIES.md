# Module Boundaries

This portfolio is a static single-page site. Keep the repo boring: HTML describes the page, CSS owns presentation, JavaScript owns behavior, and assets stay under `assets/`.

## Files

- `index.html`
  - Owns document structure, copy that is not project-specific, accessibility labels, and stable `id` / `data-*` hooks.
  - Should not contain inline event handlers or page-level styles.

- `css/styles.css`
  - Owns layout, visual styling, animation, responsive rules, and CSS custom properties.
  - Add new visual variants here unless they are generated dynamically by a dedicated JS tool.

- `js/projects.js`
  - Owns portfolio project content: ids, titles, years, media paths, and modal text.
  - Project ids must match the `data-id` values on `.project-card` elements in `index.html`.
  - Publishes `window.PROJECTS` for the static page. Keep this as a classic script unless the site gets a build step.

- `js/app.js`
  - Owns runtime behavior for the public site: project modal, media viewer, keyboard handling, drag-to-scroll, custom cursor, reveal effects, cover video playback, badge animation, and page bootstrap.
  - Should not own long content lists or CSS theme data.
  - Depends on `js/projects.js` being loaded first.

- `js/palette-switcher.js`
  - Owns the temporary palette/design-dev switcher.
  - Keep this isolated so it can be removed without touching the public app behavior.
  - Publishes `window.initPaletteSwitcher` and is loaded before `js/app.js`.

- `assets/`
  - Owns images, video files, posters, and pixel art.
  - Prefer project-specific subfolders such as `assets/project_1/`.

## Adding A Project

1. Add the card markup in `index.html` with a unique `.project-card[data-id]`.
2. Add the matching project object in `js/projects.js`.
3. Put media files in `assets/project_N/`.
4. For videos, add poster images named like the video with `_poster.jpg`, because `js/app.js` derives video thumbnails from that naming convention.

## Rules Of Thumb

- If a change affects what visitors read, it probably belongs in `index.html` or `js/projects.js`.
- If a change affects how something looks at rest or across breakpoints, it belongs in `css/styles.css`.
- If a change responds to clicks, keys, scroll, history, focus, or media playback, it belongs in `js/app.js`.
- If a change is only for choosing palettes during design work, keep it in `js/palette-switcher.js`.
- Avoid ES module imports until the project has a local dev/build workflow. Classic deferred scripts keep the page usable from both `file://` and a static server.
