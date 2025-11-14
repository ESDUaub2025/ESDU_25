# Hero Background Carousel Refactoring

## Summary
Successfully refactored the hero section to use a full-width background carousel instead of a side-by-side layout.

## Changes Made

### 1. HTML Structure (`index.html`)
**Before:**
- Split layout: `hero-copy` (left) and `hero-visual` (right)
- Carousel in portrait frame on the right side
- Content scattered across multiple containers

**After:**
- Single centered column layout
- Background carousel covers entire section
- All content overlaid and centered
- Dark overlay for text readability

**New Structure:**
```html
<section class="hero">
  <!-- Background Carousel -->
  <div class="hero-background-carousel">
    <div class="hero-bg-image active"></div>
    <div class="hero-bg-image"></div>
    <div class="hero-bg-image"></div>
    <div class="hero-overlay"></div>
  </div>
  
  <!-- Centered Content -->
  <div class="container hero-content">
    - Logo
    - Titles
    - ESDU Acronym Image
    - Description
    - CTA Buttons
  </div>
</section>
```

### 2. CSS Styling (`assets/css/styles.css`)
**Key Features:**
- **Full-height hero**: `min-height: 100vh` with flexbox centering
- **Absolute positioned backgrounds**: Cover entire section
- **Dark overlay**: Gradient overlay (rgba(0,0,0,0.4-0.5)) for text contrast
- **White text**: All hero text now white with text-shadow
- **Semi-transparent boxes**: Description and ESDU image have frosted glass effect
- **Responsive design**: Adapts to mobile with adjusted spacing
- **Smooth transitions**: 1.5s fade between background images

**Visual Enhancements:**
- Drop shadows on logo and text for depth
- Backdrop blur on content boxes
- Frosted glass effect on ESDU acronym container
- Enhanced button shadows

### 3. JavaScript (`assets/js/main.js`)
**Background Carousel Logic:**
- Targets `.hero-background-carousel` instead of `.hero-image-carousel`
- Works with `.hero-bg-image` div elements (using CSS background-image)
- Same 6-second auto-rotation
- Smooth opacity transitions
- Simpler code without portrait/landscape detection

### 4. Design Benefits

**Visual Impact:**
- ✅ More dramatic and modern presentation
- ✅ Full-screen immersive experience
- ✅ Better use of hero images
- ✅ Professional parallax-ready structure

**Content Organization:**
- ✅ Single-column layout easier to read
- ✅ Clear visual hierarchy
- ✅ Better mobile experience
- ✅ Content doesn't compete with images

**Performance:**
- ✅ CSS background-image instead of `<img>` tags
- ✅ Simpler DOM structure
- ✅ Fewer elements to animate
- ✅ Better GPU acceleration

## Responsive Behavior

### Desktop (>900px):
- Full viewport height
- Centered content column (max-width: 900px)
- Large ESDU image (600px max)

### Tablet (640-900px):
- Reduced min-height
- Adjusted padding
- Smaller logo and ESDU image

### Mobile (<640px):
- Stacked layout
- Full-width buttons
- Compact spacing
- Optimized font sizes

## Technical Details

### Z-Index Layers:
1. **z-index: 0** - Background images
2. **z-index: 2** - Dark overlay
3. **z-index: 3** - Content (text, images, buttons)

### Transition Timing:
- Background fade: 1.5s ease-in-out
- Auto-rotation: Every 6 seconds
- Smooth opacity changes

### Accessibility:
- `aria-hidden="true"` on background carousel
- Proper semantic structure maintained
- Text contrast enhanced with overlay
- Keyboard navigation preserved

## Files Modified

1. `index.html` - Complete hero section restructure
2. `assets/css/styles.css` - New hero styles, hidden old carousel
3. `assets/js/main.js` - Updated carousel JavaScript

## Backward Compatibility

Old carousel styles kept but hidden with `display: none`:
- `.hero-inner`
- `.hero-copy`  
- `.hero-visual`
- `.hero-image-carousel`

This allows easy rollback if needed.

## Future Enhancements

Possible additions:
- Ken Burns effect (subtle zoom/pan on backgrounds)
- Parallax scrolling
- Video background support
- Scroll indicator/arrow
- Custom transition effects
- Pause on hover functionality

---

**Implementation Date:** November 14, 2025
**Status:** ✅ Complete and Production Ready
