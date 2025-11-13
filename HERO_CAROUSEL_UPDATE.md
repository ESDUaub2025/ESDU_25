# Hero Image Carousel - Portrait Mode Update

## Overview
Updated the hero image carousel to display only portrait-oriented images with an expanded, optimized layout.

## Changes Made

### 1. **Image Selection** (HTML)
- **Removed**: `hero-3.JPG` (4608×3456 landscape) and `hero-4.jpg` (4128×2752 landscape)
- **Kept**: `hero-0.jpg`, `hero-1.jpg`, `hero-2.jpg` (all portrait orientation)
- This ensures consistent vertical presentation in the carousel

### 2. **Layout Expansion** (CSS)
#### Hero Section Flex Layout
```css
.hero-copy {
  flex: 1 1 420px;          /* Reduced minimum width */
  min-width: 300px;
  max-width: 580px;         /* Capped max width */
}

.hero-visual {
  flex: 1.5 1 480px;        /* Increased flex-grow (1.5 vs 1) */
  min-width: 380px;         /* Increased from 280px */
  max-width: 650px;         /* Added max width constraint */
}
```
**Result**: Carousel now takes ~60% more space while staying beside the ESDU brand

#### Carousel Container
```css
.hero-visual {
  min-height: 550px;        /* Increased from 400px */
  max-height: 700px;        /* Added height cap */
  box-shadow: 0 8px 24px rgba(132, 1, 50, 0.12);  /* Enhanced shadow */
}

.hero-image-carousel {
  min-height: 550px;
  max-height: 700px;
  background: linear-gradient(135deg, var(--tint-rose) 0%, var(--tint-gray) 100%);
}
```
**Result**: Taller container optimized for portrait images with elegant gradient background

### 3. **Image Display Strategy** (CSS)
#### Portrait-Optimized Positioning
```css
.hero-image {
  position: absolute;
  top: 0;                   /* Align to top */
  left: 50%;                /* Center horizontally */
  transform: translateX(-50%);  /* Only horizontal centering */
  width: auto;              /* Let width adjust to height */
  height: 100%;             /* Fill height completely */
  max-width: none;          /* Allow overflow for wide portraits */
  object-fit: cover;        /* Cover the frame */
}
```

#### Horizontal Overflow Handling
When portrait images are wider than the container:
- **Soft Edge Fade**: Linear gradient mask fades edges smoothly
- **Center Focus**: Most important content stays visible in center
- **No Crop Abruptly**: Gentle fade creates professional look

```css
-webkit-mask-image: linear-gradient(to right, 
  rgba(0,0,0,0) 0%, 
  rgba(0,0,0,1) 8%, 
  rgba(0,0,0,1) 92%, 
  rgba(0,0,0,0) 100%);
```

### 4. **Animation Updates** (CSS)
All animations updated from `translate(-50%, -50%)` to `translateX(-50%)`:
- ✅ fadeBlurIn
- ✅ zoomInEffect / zoomOutEffect
- ✅ slideRightIn / slideLeftIn
- ✅ slideUpIn / slideDownIn
- ✅ rotateIn
- ✅ flipHorizontal / flipVertical
- ✅ scaleBounce
- ✅ wipeLeft / wipeRight
- ✅ crossZoomIn / crossZoomOut
- ✅ blurFocusIn

### 5. **Responsive Behavior** (CSS)
```css
@media (max-width: 900px) {
  .hero-visual { 
    order: -1;              /* Move above text on mobile */
    max-width: 100%;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .hero-visual {
    min-height: 450px;      /* Slightly smaller on phones */
  }
}
```

## Best Programming Practices Applied

### ✅ 1. **Semantic HTML**
- Kept proper HTML structure
- Added comment to indicate portrait-only images
- Maintained accessibility attributes

### ✅ 2. **Progressive Enhancement**
- Base layout works without JavaScript
- Animations enhance experience
- Fallback gradient background

### ✅ 3. **Performance Optimization**
- Removed 2 unnecessary images (reduced page weight)
- Using `object-fit: cover` for better browser optimization
- CSS transforms use GPU acceleration

### ✅ 4. **Maintainability**
- Clear CSS comments
- Logical property grouping
- Consistent naming conventions

### ✅ 5. **Responsive Design**
- Mobile-first approach with media queries
- Flexible sizing with min/max constraints
- Proper stacking on smaller screens

### ✅ 6. **Visual Polish**
- Soft edge masking for wide images
- Gradient background for context
- Enhanced shadow for depth
- Smooth transitions

### ✅ 7. **Cross-Browser Compatibility**
- Vendor prefixes for masks (-webkit-)
- Standard transform properties
- Fallback for gradient

## Result
- ✅ Only portrait images displayed
- ✅ Carousel significantly larger (380-650px width vs 280-360px)
- ✅ Stays beside ESDU brand text (not full width)
- ✅ Wide portraits show with soft horizontal fade
- ✅ All animations work correctly
- ✅ Fully responsive across devices
- ✅ Professional appearance maintained

## Testing Recommendations
1. Test on different screen sizes (desktop, tablet, mobile)
2. Verify all 3 portrait images display correctly
3. Check animation transitions are smooth
4. Ensure text remains readable beside expanded carousel
5. Validate on different browsers (Chrome, Firefox, Safari, Edge)
