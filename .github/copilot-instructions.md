# ESDU 25th Anniversary Portfolio Site - AI Agent Instructions

## Project Overview
Static single-page application showcasing ESDU's (Environment and Sustainable Development Unit at AUB) 25-year journey. This is a vanilla JS/HTML/CSS site with interactive features: hero carousels, timeline navigation, animated maps with Leaflet.js, and PDF export functionality.

## Architecture & Key Components

### Core Structure
- **Single HTML file**: [index.html](index.html) - All content in one scrollable page with semantic sections (#mission, #story, #work, etc.)
- **JavaScript modules**:
  - [assets/js/main.js](assets/js/main.js) - All interactive features (carousels, sliders, timeline, map, animations)
  - [assets/js/pdf-simple.js](assets/js/pdf-simple.js) - PDF generation using html2pdf.js library
  - [assets/data/esdu_locations.js](assets/data/esdu_locations.js) - Geographic data for interactive map (1180 lines of location data)
- **Styling**:
  - [assets/css/styles.css](assets/css/styles.css) - Main styles with AUB brand colors (--brand: #840132)
  - [assets/css/animations.css](assets/css/animations.css) - Modular animation system with CSS variables

### Interactive Features (all in main.js)

1. **Hero Background Carousel**: 3 background images with synchronized text slides
2. **Mission/Vision/Values Slider**: Mobile-optimized card slider with dot navigation
3. **Timeline**: Horizontal scroll timeline with auto-advance and manual navigation
4. **ESDU at Work Carousel**: Coverflow-style carousel with pause-on-interaction
5. **Interactive Map** (Leaflet.js): 
   - Three views: Local (Lebanon), Regional (MENA), Global (Worldwide)
   - Hub-and-spoke visualization from ESDU headquarters
   - Animated connection lines using great circle arcs
   - Sequential marker animation with calculated delays
6. **Counter Animations**: Scroll-triggered number counters for impact metrics
7. **Proximity Effects**: Mouse-driven lift effect on donor cards (desktop) and scroll-based center-focus (mobile)

### Critical Patterns

#### Cross-browser Compatibility
- IntersectionObserver polyfill for older browsers (line 16-27 in main.js)
- Explicit scroll position handling: `window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop`
- CSS vendor prefixes for transforms and transitions

#### Animation System
- IntersectionObserver-based reveal animations with `.visible` class
- Separate observers for different element types (cards, sections, map elements)
- CSS custom properties in animations.css for timing: `--anim-duration-fast: 0.3s`, `--anim-duration-normal: 0.6s`

#### Map Implementation Details
Map data structure in esdu_locations.js has 4 categories: `hub`, `local`, `regional`, `global`

**View switching flow**:
1. Cancel pending timeouts and clear markers when switching views
2. Filter nodes by category, then set map view/bounds
3. Wait 10ms for map to update, then call `renderOutreachMap()`
4. Markers animated sequentially with calculated delays (maxAnimationTime: 4000ms)

**Great circle connections**: Uses spherical geometry for curved lines between hub and nodes (lines 787-806)

#### Mobile Responsiveness
- Touch detection: `'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 900`
- Different interaction patterns: mouse proximity (desktop) vs scroll-based center focus (mobile)
- Mobile nav: aria-expanded attributes control visibility

### Python Utilities

#### scripts/extract_esdu.py
Extracts text and images from PDF portfolios in assets/files using PyMuPDF (fitz)
- Text output: `assets/files/extracted/{stem}.txt`
- Images: `assets/files/extracted/{stem}/images/`
- Handles CMYK → RGB conversion for image extraction

**Usage**: `py -3.12 scripts/extract_esdu.py`

#### scripts/compress_images.py
Compresses images in a directory using Pillow
- Creates backup before compression
- Max width: 2000px, Quality: 85%
- Handles RGBA → RGB conversion for JPEG
- Reports size savings

### Brand & Design System

**AUB Brand Colors** (CSS variables in styles.css):
- Primary: `--brand: #840132` (Berytus Red)
- Complementary: `--accent-teal: #006666`, `--accent-amber: #cc7700`, `--accent-green: #2d5a27`
- Backgrounds: `--tint-rose`, `--tint-gray`, `--tint-teal`, `--tint-amber`, `--tint-green`

**Section backgrounds**: Use `.bg-rose`, `.bg-amber`, `.bg-green` classes for subtle gradients

## Development Workflows

### Running Locally
1. Open index.html in a browser (no build step required)
2. For Python scripts: Ensure Python 3.12+ with required packages: `pip install pymupdf pillow`

### Making Changes

**Adding new interactive sections**:
1. Add HTML structure in index.html with appropriate semantic markup and `data-` attributes
2. Add scroll reveal by including element selector in IntersectionObserver (line 88 in main.js)
3. Style in styles.css following existing grid/card patterns
4. Add animations in animations.css if custom animations needed

**Modifying map data**:
- Edit esdu_locations.js directly - structure is: `{ hub: {...}, local: [...], regional: [...], global: [...] }`
- Each location needs: `name`, `title`, `desc`, `lat`, `lon`, optional: `logo`, `website`, `projects`

**PDF Export customization**:
- Edit pdf-simple.js to modify PDF layout/content extraction
- Uses html2pdf.js library with A4 format (210mm x 297mm)
- Extracts content from DOM using `querySelector` and `querySelectorAll`
- **Clickable URLs**: Projects and partner links are preserved as clickable hyperlinks in the PDF
- **Cross-browser compatibility**: Includes browser capability detection and graceful fallback
- **Consistent output**: Uses standardized html2canvas and jsPDF settings for uniform rendering across devices

### Performance Considerations
- Images: Lazy loading with `loading="lazy"` attribute
- Animations: Use `requestAnimationFrame` for smooth updates
- Map markers: Sequential animation with calculated delays to prevent overwhelming browser
- Event listeners: Use `{ passive: true }` for scroll/touch handlers

## Common Patterns to Follow

1. **Function organization**: Utility functions at top, `ready()` callback contains all DOM-dependent code
2. **Mobile-first checks**: Always check `isTouch` before applying mouse-specific interactions
3. **Cleanup**: Cancel timeouts/intervals when switching views or states
4. **Accessibility**: Include ARIA attributes, skip links, semantic HTML
5. **Error handling**: Image error handlers show elegant fallbacks (lines 1102-1182 in main.js)

## External Dependencies
- **Leaflet.js** (1.9.4): Interactive maps
- **html2pdf.js** (0.10.1): PDF generation
- **Google Analytics**: Configured with tracking ID G-4XE0FR7ZBY
- **Google Fonts**: Montserrat (300, 400, 600, 700 weights)

## Key Files Reference
- [index.html](index.html) - Main content (719 lines)
- [assets/js/main.js](assets/js/main.js) - All interactions (1281 lines)
- [assets/js/pdf-simple.js](assets/js/pdf-simple.js) - PDF export (336 lines)
- [assets/data/esdu_locations.js](assets/data/esdu_locations.js) - Map data (1180 lines)
- [assets/css/styles.css](assets/css/styles.css) - Main styles (2558 lines)
- [assets/css/animations.css](assets/css/animations.css) - Animation system (721 lines)

## Current Project Status

### Phase 1: Core Functionality ✅ COMPLETE
- All interactive features implemented
- PDF export with clickable URLs
- Cross-browser compatibility
- Mobile responsive design
- Foreword section with leadership message

### Phase 2: Visual Enhancements ⏳ AWAITING RESOURCES
See [VISUAL_ENHANCEMENT_PLAN.md](../VISUAL_ENHANCEMENT_PLAN.md) and [IMAGE_CHECKLIST.md](../IMAGE_CHECKLIST.md) for detailed requirements.

**Waiting for Communications Team:**
- Leadership photos (President, Dean)
- Timeline milestone images (7 photos)
- Project showcase images (19 photos)
- Field work/community photos (30+ photos)
- Partner/donor logos (40-60 logos)

**Ready to Implement (No Resources Needed):**
- Glassmorphism card effects
- Animated gradient backgrounds
- 3D hover effects on existing images
- Parallax scrolling
- Progress ring animations for stats
- Micro-interactions

### Phase 3: Future Enhancements
- 360° panoramic tours
- Interactive data visualizations (D3.js)
- Video backgrounds
- Multi-language support

## Testing Checklist
When making changes, verify:
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness (test touch interactions)
- [ ] Scroll animations trigger correctly with IntersectionObserver
- [ ] Map view switching clears previous markers/connections
- [ ] PDF export captures all sections correctly
- [ ] No console errors for missing images (fallback handlers work)
- [ ] Image lazy loading working properly
- [ ] New visual enhancements don't impact performance
