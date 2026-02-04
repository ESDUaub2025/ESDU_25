# ESDU 25th Anniversary Portfolio

**Environment and Sustainable Development Unit at AUB**  
*Exploring Solutions, Defying Uncertainties – 25 Years of Sustainable Community Development*

---

## 🌟 Overview

This is the official portfolio website celebrating ESDU's 25-year journey (1996-2026) of community-led sustainable development, food security, and rural transformation across Lebanon and the MENA region.

**Live Site:** [Add URL when deployed]

---

## 🚀 Features

- **Interactive Timeline** - 25 years of milestones and achievements
- **Animated Map** - Geographic outreach across Local, Regional, and Global scales
- **Impact Metrics** - Animated counters showcasing measurable outcomes
- **PDF Export** - Download complete portfolio with clickable links
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Leadership Foreword** - Messages from AUB President and FAFS Dean
- **Project Showcase** - Comprehensive portfolio of 19+ projects

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Leaflet.js** - Interactive maps
- **html2pdf.js** - PDF generation
- **Google Analytics** - Usage tracking

---

## 📁 Project Structure

```
ESDU_25_v2/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   ├── styles.css         # Main styles (2558 lines)
│   │   └── animations.css     # Animation system (721 lines)
│   ├── js/
│   │   ├── main.js            # Core interactions (1281 lines)
│   │   └── pdf-simple.js      # PDF export (336 lines)
│   ├── data/
│   │   └── esdu_locations.js  # Map location data (1180 lines)
│   ├── images/                # Image assets
│   ├── files/                 # PDF resources
│   │   └── extracted/         # Extracted PDF content
│   └── videos/                # Video assets
├── scripts/
│   ├── extract_esdu.py        # PDF text/image extraction
│   └── compress_images.py     # Image optimization
├── .github/
│   └── copilot-instructions.md # AI agent guidelines
├── VISUAL_ENHANCEMENT_PLAN.md  # Resource requirements
├── IMAGE_CHECKLIST.md          # Asset collection guide
├── EXECUTIVE_SUMMARY.md        # Leadership overview
└── README.md                   # This file
```

---

## 🎨 Design System

**Colors:**
- Primary: `#840132` (AUB Berytus Red)
- Complementary: Teal, Amber, Green variations
- Backgrounds: Rose, Gray, Teal tints

**Typography:**
- Font: Montserrat (300, 400, 600, 700)
- Responsive sizing with `clamp()`

**Sections:**
- Hero with carousel backgrounds
- Foreword (leadership messages)
- Mission, Vision, Core Values
- Our Story (timeline)
- ESDU at Work
- Strategic Goals 2025-2030
- Keepers of the Land
- Impact & Outreach
- Projects
- Partners & Donors
- Resources

---

## 🚀 Quick Start

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd ESDU_25_v2
   ```

2. **Open in browser:**
   - Simply open `index.html` in a modern web browser
   - No build step required!

3. **Optional - Python scripts:**
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Extract PDF content
   py -3.12 scripts/extract_esdu.py
   
   # Compress images
   py -3.12 scripts/compress_images.py
   ```

### Development

No build tools required. Edit files directly:
- HTML: `index.html`
- Styles: `assets/css/styles.css` or `assets/css/animations.css`
- JavaScript: `assets/js/main.js` or `assets/js/pdf-simple.js`
- Data: `assets/data/esdu_locations.js`

---

## 📋 Current Status

### ✅ Phase 1: Complete
- All core features implemented
- PDF export with clickable URLs
- Cross-browser compatibility
- Mobile responsive
- Accessibility features

### ⏳ Phase 2: In Progress
Awaiting visual assets from Communications Team:
- Leadership photos (2)
- Timeline images (7)
- Project photos (19)
- Community/field photos (30+)
- Partner logos (40-60)

See [VISUAL_ENHANCEMENT_PLAN.md](VISUAL_ENHANCEMENT_PLAN.md) for details.

---

## 🤝 Contributing

### For Developers
1. Review [.github/copilot-instructions.md](.github/copilot-instructions.md)
2. Follow existing code patterns
3. Test across browsers (Chrome, Firefox, Safari, Edge)
4. Ensure mobile responsiveness
5. Maintain accessibility standards

### For Content Team
1. Review [IMAGE_CHECKLIST.md](IMAGE_CHECKLIST.md)
2. Follow image specifications
3. Obtain necessary permissions
4. Submit via designated folder

---

## 📊 Performance

- **Page Load:** < 3 seconds
- **Lighthouse Score:** Target 85+
- **Image Optimization:** Lazy loading, compressed assets
- **Animations:** RequestAnimationFrame for smooth 60fps

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ IE11 not supported (modern browsers only)

---

## 📄 License

© 2026 Environment and Sustainable Development Unit (ESDU)  
American University of Beirut  
All rights reserved.

---

## 📞 Contact

**ESDU:**
- Website: https://www.aub.edu.lb/fafs/esdu
- Email: [Add contact]

**Technical Support:**
- Developer: [Add contact]
- Issues: [GitHub Issues link]

---

## 📚 Documentation

- [Copilot Instructions](.github/copilot-instructions.md) - AI agent guidelines
- [Visual Enhancement Plan](VISUAL_ENHANCEMENT_PLAN.md) - Future improvements
- [Image Checklist](IMAGE_CHECKLIST.md) - Asset requirements
- [Executive Summary](EXECUTIVE_SUMMARY.md) - Leadership overview

---

## 🎯 Milestones

- [x] **Jan 2026** - Project initiated
- [x] **Feb 4, 2026** - Phase 1 complete, ready for deployment
- [ ] **Feb-Mar 2026** - Visual asset collection (Phase 2)
- [ ] **Mar 2026** - Full visual enhancement launch
- [ ] **Apr 2026** - 25th Anniversary celebration

---

## 🙏 Acknowledgments

This portfolio celebrates 25 years of dedication by ESDU staff, partners, donors, and the communities we serve. Special thanks to:

- AUB Leadership for continued support
- ESDU team past and present
- Partner organizations and donors
- Rural communities across the region
- Communications team for visual assets

---

**Last Updated:** February 4, 2026  
**Version:** 1.0  
**Status:** Ready for Production Deployment
