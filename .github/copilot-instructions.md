# ESDU 25th Anniversary Portfolio Site — AI Agent Instructions

## Architecture
Zero-build static single-page app (vanilla HTML/CSS/JS). No bundler, no npm. Open `index.html` directly or via VS Code Live Server (port 5501). All CDN dependencies use SRI hashes.

**Script load order matters** (global `<script>` tags, no ES modules):
1. Leaflet.js 1.9.4 → 2. `assets/data/esdu_locations.js` (global `esduLocations` const) → 3. `assets/js/main.js` → 4. `assets/js/pdf-generator.js`

### Key Files
| File | Role |
|------|------|
| `index.html` | All content — 13 `<section>` elements with anchor IDs (#foreword, #mission, #story, #work, #goals, #keepers, #impact, #projects, #partners, #resources) |
| `assets/js/main.js` | All interactions: carousels, timeline, map, counters, scroll animations (~1280 lines) |
| `assets/js/pdf-generator.js` | PDF export via html2pdf.js — builds standalone HTML from DOM, not screenshot-based |
| `assets/data/esdu_locations.js` | Map data: `{ hub: {...}, local: [...], regional: [...], global: [...] }` |
| `assets/css/styles.css` | Main styles + CSS custom properties (~2750 lines) |
| `assets/css/animations.css` | IntersectionObserver-driven reveal system (~750 lines) |
| `scripts/extract_esdu.py` | PDF text/image extraction (PyMuPDF). Run: `py -3.12 scripts/extract_esdu.py` |
| `scripts/compress_images.py` | Image optimization (Pillow, not in requirements.txt). Max 2000px, quality 85% |

## Critical Patterns

### JS Structure (main.js)
- Top-level utilities (`ready()`, `getScrollPosition()`), then one main `ready(() => { ... })` block containing all DOM logic, plus a second `ready()` for video autoplay.
- Each UI feature (carousel, timeline, map) uses **nested function scoping** with its own local `pauseAutoAdvance()`/`resumeAutoAdvance()`.
- **Data attributes drive behavior**: `data-slider`, `data-carousel`, `data-timeline`, `data-count`, `data-reveal`, `data-autoplay-on-scroll`.
- Touch detection: `'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 900`
- Cross-browser: IntersectionObserver polyfill (top of file), vendor-prefixed CSS, `{ passive: true }` on scroll/touch listeners.

### Animation System
JS adds `.visible` class via IntersectionObserver → CSS in `animations.css` handles transitions. Timing variables: `--anim-duration-fast: 0.3s`, `--anim-duration-normal: 0.6s`, `--anim-duration-slow: 1s`. Always include `-webkit-` and `-ms-` prefixes on transforms.

### CSS Conventions
- **Desktop-first** responsive: all `@media` use `max-width`. Primary breakpoint: **640px** (15 uses), secondary: **900px** (nav collapse, grid changes).
- Container: `width: min(1120px, 92%); margin: auto`. Section padding: `clamp(3rem, 6vw, 6rem)`.
- Brand colors via CSS variables: `--brand: #840132` (primary), `--accent-teal: #006666`, `--accent-amber: #cc7700`, `--accent-green: #2d5a27`.
- Section background tints via classes: `.bg-rose`, `.bg-amber`, `.bg-green`.

### Map (Leaflet)
Data in `esduLocations`: each node has `name`, `title`, `desc`, `lat`, `lon`, optional `logo`, `website`, `projects[]`. Three views: Local/Regional/Global. View switching **must** cancel pending timeouts and clear markers before rendering. Great circle arcs use spherical geometry for hub-and-spoke connections.

### PDF Export (pdf-generator.js)
Uses `$`/`$$`/`txt`/`esc` helper shortcuts. Extracts DOM content and builds an HTML string rendered by html2pdf.js (A4). Forces `[data-reveal]` elements visible before capture. Brand color `#840132` is hardcoded.

## When Making Changes
1. **New interactive section**: Add `<section>` in index.html with `data-reveal` → register in IntersectionObserver in main.js → style in styles.css → optional custom keyframes in animations.css.
2. **New map location**: Add entry to the appropriate array in `esdu_locations.js` with required fields (`name`, `title`, `desc`, `lat`, `lon`).
3. **Accessibility**: Use ARIA attributes (`aria-expanded`, `aria-label`), semantic HTML, skip links.
4. **Images**: Use `loading="lazy"`, add error fallback handlers (see ~line 1100 in main.js).

## Testing Checklist
- Cross-browser: Chrome, Firefox, Safari, Edge (check vendor-prefixed CSS)
- Mobile: touch interactions, nav toggle (`aria-expanded`), 640px breakpoint
- Map: view switching clears previous markers; connection lines render correctly
- PDF: all sections captured, clickable URLs preserved
- No console errors for missing images (fallback handlers must work)
