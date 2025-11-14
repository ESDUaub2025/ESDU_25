# Hero Section - Refined Design

## Overview
The hero section has been refined into three distinct layers:
1. **Logo Section** - Clean white background, above everything
2. **Background Carousel Section** - Images with overlaid content
3. **Description & CTA Section** - White background, below carousel

## Structure

```
┌─────────────────────────────────────┐
│   LOGO SECTION (White BG)           │
│   - 25th Anniversary Logo           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   HERO CAROUSEL (Image BG)          │
│   ┌───────────────────────────┐     │
│   │ Main Titles (White)       │     │
│   │ ┌───────────────────────┐ │     │
│   │ │ ESDU Image            │ │     │
│   │ │ (Translucent white BG)│ │     │
│   │ └───────────────────────┘ │     │
│   └───────────────────────────┘     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   BOTTOM SECTION (White BG)         │
│   - Description paragraph           │
│   - CTA Buttons                     │
└─────────────────────────────────────┘
```

## Key Features

### 1. Logo Section
- **Purpose**: Dedicated space for the 25th anniversary logo
- **Background**: Clean white (`var(--bg)`)
- **Padding**: Responsive (`clamp(1.5rem, 3vw, 2.5rem)`)
- **Logo Size**: `clamp(200px, 35vw, 450px)`

### 2. Hero Carousel Section
**Background Images:**
- Absolute positioned carousel
- Full width and height of section
- Lighter overlay: `rgba(0, 0, 0, 0.25-0.3)` for better image visibility
- Smooth 1.5s fade transitions

**Titles:**
- White text with strong shadows
- Font size: `clamp(1.3rem, 2.8vw, 2.2rem)`
- Multiple shadow layers for readability

**ESDU Acronym Image:**
- **Transparent background** on the PNG itself
- **Translucent white backdrop** using `::before` pseudo-element
  - Size: 85% of image dimensions
  - Background: `rgba(255, 255, 255, 0.75)`
  - Backdrop blur: 12px for frosted glass effect
  - Centered behind the image
- **Drop shadow** for depth
- Images flow through the transparent areas
- Text remains readable on translucent white

### 3. Bottom Section
- **Background**: White (`var(--bg)`)
- **Description**: 
  - Dark gray text (`var(--muted)`)
  - No background box
  - Natural text on white background
  - Max width: 750px
- **CTA Buttons**:
  - Primary: Red brand color
  - Ghost: White with subtle border
  - Subtle shadows
  - Responsive stacking on mobile

## Technical Implementation

### HTML Structure
```html
<!-- 1. Logo Section -->
<section class="hero-logo-section">
  <img src="logo.png" class="hero-logo-main" />
</section>

<!-- 2. Carousel Section -->
<section class="hero">
  <div class="hero-background-carousel">
    <div class="hero-bg-image active"></div>
    <div class="hero-overlay"></div>
  </div>
  <div class="hero-content">
    <h2>Titles</h2>
    <div class="hero-esdu-image">
      <img src="esdu-acronym.png" />
      <!-- ::before creates translucent backdrop -->
    </div>
  </div>
</section>

<!-- 3. Bottom Section -->
<section class="hero-bottom-section">
  <p>Description</p>
  <div class="hero-ctas">Buttons</div>
</section>
```

### CSS Key Classes

**`.hero-esdu-image::before`**
```css
content: '';
position: absolute;
top: 50%; left: 50%;
transform: translate(-50%, -50%);
width: 85%;
height: 85%;
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(12px);
border-radius: 1rem;
z-index: 1; /* Behind image (z-index: 2) */
```

**`.hero-overlay`**
```css
background: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.3) 0%,
  rgba(0, 0, 0, 0.25) 50%,
  rgba(0, 0, 0, 0.3) 100%
);
```

## Visual Effects

### ESDU Image Transparency
1. **PNG with transparent background** - allows images to show through
2. **Smaller translucent white box** (85% size) - provides contrast for text
3. **Backdrop blur** - creates frosted glass effect
4. **Drop shadow** - adds depth and separation
5. **Z-index layering**:
   - Background images: z-index 0-2
   - White backdrop: z-index 1
   - ESDU image: z-index 2

### Background Carousel
- Only extends to bottom of ESDU image
- Lighter overlay preserves image detail
- Smooth transitions between images
- Images visible through transparent areas of ESDU PNG

### Text Contrast
- **On carousel background**: White text with heavy shadows
- **On white background**: Dark gray text, no shadows
- **ESDU image text**: Readable against translucent white backdrop

## Responsive Behavior

### Desktop (>900px):
- Logo: 450px max
- ESDU image: 650px max
- Full-width background carousel
- Side-by-side buttons

### Tablet (640-900px):
- Logo: Scales to 50vw
- ESDU image: 100% of container
- Reduced padding throughout

### Mobile (<640px):
- Logo: 60vw, 300px max
- ESDU backdrop: 90% (more coverage)
- Stacked buttons (full width, 300px max)
- Tighter spacing

## Color Palette

### Hero Sections:
- **Logo section**: `#ffffff` (white)
- **Carousel overlay**: `rgba(0, 0, 0, 0.25-0.3)` (light dark)
- **ESDU backdrop**: `rgba(255, 255, 255, 0.75)` (translucent white)
- **Bottom section**: `#ffffff` (white)

### Text:
- **On carousel**: `#ffffff` with shadows
- **On white**: `var(--muted)` (dark gray)

### Buttons:
- **Primary**: `var(--brand)` (#840132)
- **Ghost**: White with gray border

## Benefits

✅ **Clear Separation**: Three distinct sections with clear purposes
✅ **Better Image Visibility**: Lighter overlay, transparent ESDU image
✅ **Improved Readability**: Translucent white backdrop for ESDU text
✅ **Professional Layout**: Logo separate, content organized
✅ **Flexible Design**: Background only where needed
✅ **Modern Aesthetics**: Frosted glass effect, clean transitions
✅ **Accessible**: Good contrast ratios, clear hierarchy

## Browser Support

- **Backdrop filter**: Modern browsers (Chrome 76+, Safari 9+, Firefox 103+)
- **Fallback**: `rgba` background still works without blur
- **Transitions**: All major browsers
- **Flexbox**: Universal support

---

**Updated:** November 14, 2025
**Status:** ✅ Production Ready
