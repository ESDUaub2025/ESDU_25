// Basic site interactions, sliders, timeline, counters, outreach dots

// Utility: on DOM ready
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

// Cross-browser compatibility helpers
function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// Polyfill for IntersectionObserver (basic fallback)
if (typeof IntersectionObserver === 'undefined') {
  window.IntersectionObserver = function(callback, options) {
    this.callback = callback;
    this.options = options || {};
    this.observe = function(element) {
      // Simple fallback: trigger immediately after a short delay
      setTimeout(() => {
        this.callback([{ isIntersecting: true, target: element }], this);
      }, 100);
    };
    this.unobserve = function() {};
    this.disconnect = function() {};
  };
}

ready(() => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shrink on scroll (cross-browser compatible)
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
      }
    };
    
    // Use passive listener for better performance
    const scrollOptions = { passive: true };
    if (window.addEventListener) {
      window.addEventListener('scroll', handleScroll, scrollOptions);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', handleScroll);
    }
  }

  // Mobile nav toggle
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Enhanced reveal on scroll for all animated elements
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal], .kpi, .card, .slide, .goal-card, .initiative-item, .mvv .card, .hero-ctas .btn, .ecosystem-card, .donor-card').forEach(el => io.observe(el));
  
  // 3D Tilt Effect for Donor Cards - Enhanced and faster
  const donorCards = document.querySelectorAll('.donor-card');
  
  donorCards.forEach(card => {
    let isHovering = false;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let animationFrame = null;
    
    // Ensure transform is controlled by JS, not CSS - remove transform from transition
    card.style.transition = 'opacity 0.6s ease, box-shadow 0.2s ease-out, border-color 0.2s ease-out, background 0.2s ease-out';
    // Set initial transform to ensure JS control
    if (card.classList.contains('visible')) {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    }
    
    const updateTransform = () => {
      animationFrame = null;
      
      if (!isHovering) {
        // Smoothly return to neutral
        currentRotationX *= 0.85;
        currentRotationY *= 0.85;
        
        if (Math.abs(currentRotationX) < 0.1 && Math.abs(currentRotationY) < 0.1) {
          currentRotationX = 0;
          currentRotationY = 0;
          card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
          return;
        }
      } else {
        // Smoothly interpolate to target (fast interpolation for responsiveness)
        currentRotationX += (targetRotationX - currentRotationX) * 0.3;
        currentRotationY += (targetRotationY - currentRotationY) * 0.3;
      }
      
      // Apply 3D transform with lift
      card.style.transform = `translateY(-12px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) scale(1.02)`;
      
      if (isHovering || Math.abs(currentRotationX) > 0.1 || Math.abs(currentRotationY) > 0.1) {
        animationFrame = requestAnimationFrame(updateTransform);
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isHovering || !card.classList.contains('visible')) return;
      
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      
      // Calculate rotation angles (max 25 degrees for more noticeable effect)
      const maxRotation = 25;
      targetRotationY = (deltaX / (rect.width / 2)) * maxRotation;
      targetRotationX = -(deltaY / (rect.height / 2)) * maxRotation;
      
      // Clamp values
      targetRotationX = Math.max(-maxRotation, Math.min(maxRotation, targetRotationX));
      targetRotationY = Math.max(-maxRotation, Math.min(maxRotation, targetRotationY));
      
      if (!animationFrame) {
        updateTransform();
      }
    };
    
    const handleMouseEnter = (e) => {
      if (!card.classList.contains('visible')) return;
      isHovering = true;
      // Trigger initial calculation on enter
      handleMouseMove(e);
      if (!animationFrame) {
        updateTransform();
      }
    };
    
    const handleMouseLeave = () => {
      isHovering = false;
      targetRotationX = 0;
      targetRotationY = 0;
      if (!animationFrame) {
        updateTransform();
      }
    };
    
    // Watch for when card becomes visible
    const visibilityObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (card.classList.contains('visible') && !isHovering) {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
          }
        }
      });
    });
    visibilityObserver.observe(card, { attributes: true, attributeFilter: ['class'] });
    
    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
  
  // Additional observers for sections and map
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible-fade-up'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section, .map-stage, .timeline .year, .kotl-card, .logo-tile').forEach(el => sectionIo.observe(el));
  
  // Footer observer
  const footerIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.3 });
  const footer = document.querySelector('.site-footer');
  if (footer) footerIo.observe(footer);

  // Mission/Vision/Values – slider controls (mobile)
  const slider = document.querySelector('.mvv .card-slider');
  if (slider) {
    const cards = Array.from(slider.children);
    const dotsWrap = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = cards.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => goTo(i));
      return b;
    });
    function goTo(i) {
      const card = cards[i];
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      dots.forEach(d => d.removeAttribute('aria-current'));
      dots[i].setAttribute('aria-current', 'true');
    }
    prevBtn?.addEventListener('click', () => {
      const i = Math.max(0, activeIndex(cards));
      goTo(Math.max(0, i - 1));
    });
    nextBtn?.addEventListener('click', () => {
      const i = Math.max(0, activeIndex(cards));
      goTo(Math.min(cards.length - 1, i + 1));
    });
    // init
    if (dots[0]) dots[0].setAttribute('aria-current', 'true');
  }

  // ESDU at Work – simple carousel with pause-on-interaction
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    let index = 0;
    let autoAdvanceInterval = null;
    let pauseTimer = null;
    const PAUSE_DURATION = 30000; // 30 seconds in milliseconds
    const AUTO_ADVANCE_INTERVAL = 4500; // 4.5 seconds

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => { 
        index = i; 
        render(); 
        pauseAutoAdvance();
      });
      dotsWrap.appendChild(b);
    });

    // Coverflow neighbor classing
    function applyCoverflow() {
      slides.forEach((s, i) => {
        s.classList.remove('is-prev','is-next','is-active');
        if (i === index) s.classList.add('is-active');
        if (i === ((index - 1 + slides.length) % slides.length)) s.classList.add('is-prev');
        if (i === ((index + 1) % slides.length)) s.classList.add('is-next');
      });
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', i === index));
      applyCoverflow();
    }

    // Pause auto-advance and reset timer
    function pauseAutoAdvance() {
      // Clear existing timers
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
      if (pauseTimer) {
        clearTimeout(pauseTimer);
        pauseTimer = null;
      }
      
      // Set timer to resume after 30 seconds
      pauseTimer = setTimeout(() => {
        resumeAutoAdvance();
      }, PAUSE_DURATION);
    }

    // Resume auto-advance
    function resumeAutoAdvance() {
      if (autoAdvanceInterval) return; // Already running
      
      autoAdvanceInterval = setInterval(() => {
        index = (index + 1) % slides.length;
        render();
      }, AUTO_ADVANCE_INTERVAL);
    }

    // Manual navigation handlers
    const handleManualNavigation = (direction) => {
      if (direction === 'prev') {
        index = (index - 1 + slides.length) % slides.length;
      } else {
        index = (index + 1) % slides.length;
      }
      render();
      pauseAutoAdvance(); // Pause when user manually navigates
    };

    prev.addEventListener('click', () => handleManualNavigation('prev'));
    next.addEventListener('click', () => handleManualNavigation('next'));

    // Keyboard and swipe
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        handleManualNavigation('prev');
      } else if (e.key === 'ArrowRight') {
        handleManualNavigation('next');
      }
    });
    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) {
        handleManualNavigation('prev');
      } else if (dx < -40) {
        handleManualNavigation('next');
      }
    });

    render();
    // Start auto-advance initially
    resumeAutoAdvance();
  }

  // Timeline – curated milestones with auto-scroll and pause-on-interaction
  const timeline = document.querySelector('[data-timeline]');
  if (timeline) {
    const milestones = [
      { year: 1996, text: 'IDRC support bails out community-based research: Arsaal project begins' },
      { year: 2001, text: 'ESDU established as interdisciplinary R&D unit at AUB/FAFS — Arsal case study ($750K)' },
      { year: 2002, text: 'First regional window: UNCCD collaboration begins' },
      { year: 2003, text: 'Healthy Basket launches: organic agriculture and farmer livelihoods' },
      { year: 2005, text: 'IFAD-NEMTA program: Agricultural management training across MENA' },
      { year: 2006, text: 'ESDU becomes 7th Center of RUAF (Resource Centres on Urban Agriculture)' },
      { year: 2007, text: 'Technology transfer: Yammouneh/Deir el Ahmar extension project' },
      { year: 2012, text: 'First AUB university budget allocation' },
      { year: 2013, text: 'Food Heritage Foundation (FHF) established to conserve traditional food heritage' },
      { year: 2014, text: 'RCODE master\'s program hosting; EvalMENA third general assembly in Amman' },
      { year: 2015, text: 'Keepers of the Land Research Fund launched' },
      { year: 2017, text: 'KariaNet knowledge-sharing platform officially hosted by ESDU' },
      { year: 2018, text: 'REEF pilot: Rural Empowerment & Entrepreneurship Forum' },
      { year: 2019, text: 'Selected by Food Tank as initiative redefining food & agriculture in Middle East' },
      { year: 2020, text: 'CLIMAT wins Khalifa Date Palm Award; Ardi Ardak featured by FAO' },
      { year: 2021, text: 'Ardi Ardak national food security initiative; Urban Oasis renovation begins' },
      { year: 2023, text: 'Urban Oasis engagement center launched; wins PRIMA WEFE Nexus Award — First Place' },
      { year: 2024, text: 'AFESD Small Green Innovative Project secured; Champion of Plastic Pollution Prevention' },
      { year: 2025, text: 'Strategy 2025–2030 and Portfolio 2025 published' },
    ];
    milestones.forEach(m => {
      const year = document.createElement('div');
      year.className = 'year';
      year.setAttribute('tabindex', '0');
      year.setAttribute('role', 'button');
      const h = document.createElement('h4');
      h.textContent = String(m.year);
      const p = document.createElement('p');
      p.textContent = m.text;
      year.append(h, p);
      timeline.appendChild(year);
    });

    const rail = timeline.querySelector('.rail');
    const progress = timeline.querySelector('.progress');
    const items = Array.from(timeline.querySelectorAll('.year'));
    let currentIndex = 0;
    const prevBtn = document.querySelector('.timeline-prev');
    const nextBtn = document.querySelector('.timeline-next');
    let autoAdvanceInterval = null;
    let pauseTimer = null;
    const PAUSE_DURATION = 30000; // 30 seconds in milliseconds
    const AUTO_ADVANCE_INTERVAL = 4500; // 4.5 seconds

    function setActive(i, isManual = false) {
      // Handle looping: if at end, loop back to start
      if (i >= items.length) {
        i = 0; // Loop back to start
      } else if (i < 0) {
        i = items.length - 1; // Loop to end if going backwards from start
      }
      
      if (i < 0 || i >= items.length) return;
      
      currentIndex = i;
      items.forEach((el, idx) => el.classList.toggle('active', idx === i));
      
      // Update progress bar
      const pct = (i + 1) / items.length;
      const railWidth = rail.getBoundingClientRect().width;
      progress.style.width = `${Math.max(0, Math.floor(railWidth * pct))}px`;
      
      // Smoothly scroll the timeline container horizontally
      const container = timeline;
      const item = items[i];
      if (item && container) {
      const targetLeft = item.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
        // Use requestAnimationFrame for better cross-browser support
        const scrollToPosition = () => {
          const target = Math.max(0, targetLeft);
          
          // Modern browsers with smooth scroll
          if (container.scrollTo && typeof container.scrollTo === 'function') {
            try {
              container.scrollTo({ left: target, behavior: 'smooth' });
              return;
            } catch (e) {
              // Fallback if smooth scroll fails - continue to animation
            }
          }
          
          // Fallback for older browsers - smooth scroll polyfill
          const start = container.scrollLeft;
          const distance = target - start;
          
          // If already at target, no need to animate
          if (Math.abs(distance) < 1) {
            container.scrollLeft = target;
            return;
          }
          
          const duration = 300;
          let startTime = null;
          
          function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-in-out)
            const ease = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            container.scrollLeft = start + (distance * ease);
            
            if (timeElapsed < duration) {
              if (window.requestAnimationFrame) {
                requestAnimationFrame(animateScroll);
              } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(animateScroll);
              } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(animateScroll);
              } else {
                // Final fallback: instant scroll
                container.scrollLeft = target;
              }
            } else {
              container.scrollLeft = target;
            }
          }
          
          if (window.requestAnimationFrame) {
            requestAnimationFrame(animateScroll);
          } else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(animateScroll);
          } else if (window.mozRequestAnimationFrame) {
            window.mozRequestAnimationFrame(animateScroll);
          } else {
            // Final fallback for very old browsers
            container.scrollLeft = target;
          }
        };
        
        if (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame) {
          if (window.requestAnimationFrame) {
            requestAnimationFrame(scrollToPosition);
          } else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(scrollToPosition);
          } else {
            window.mozRequestAnimationFrame(scrollToPosition);
          }
        } else {
          scrollToPosition();
        }
      }
      
      // Update button states - remove disabled state since we're looping
      if (prevBtn) {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }

      // If manual interaction, pause auto-advance
      if (isManual) {
        pauseAutoAdvance();
      }
    }

    // Pause auto-advance and reset timer
    function pauseAutoAdvance() {
      // Clear existing timers
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
      if (pauseTimer) {
        clearTimeout(pauseTimer);
        pauseTimer = null;
      }
      
      // Set timer to resume after 30 seconds
      pauseTimer = setTimeout(() => {
        resumeAutoAdvance();
      }, PAUSE_DURATION);
    }

    // Resume auto-advance
    function resumeAutoAdvance() {
      if (autoAdvanceInterval) return; // Already running
      
      autoAdvanceInterval = setInterval(() => {
        // Auto-advance to next item (will loop back to start when reaching end)
        const nextIndex = currentIndex + 1;
        setActive(nextIndex, false); // false = not manual, so don't pause
      }, AUTO_ADVANCE_INTERVAL);
    }

    // Click handlers for timeline items
    items.forEach((item, index) => {
      item.addEventListener('click', () => setActive(index, true));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive(index, true);
        }
      });
    });

    // Navigation button handlers
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        setActive(currentIndex - 1, true);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        setActive(currentIndex + 1, true);
      });
    }

    // Keyboard navigation
    timeline.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActive(currentIndex - 1, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActive(currentIndex + 1, true);
      }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    timeline.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    timeline.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - go to next
          setActive(currentIndex + 1, true);
        } else {
          // Swipe right - go to previous
          setActive(currentIndex - 1, true);
        }
      }
    }

    // Initialize first item
    setActive(0, false);
    
    // Start auto-advance
    resumeAutoAdvance();
    
    // Observe timeline items for animations after they're created
    setTimeout(() => {
      const years = timeline.querySelectorAll('.year');
      years.forEach(year => sectionIo.observe(year));
    }, 100);
  }

  // Impact counters
  const counters = document.querySelectorAll('.kpi-value[data-count]');
  const cIo = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const end = parseInt(target.getAttribute('data-count') || '0', 10);
      animateCount(target, end, 1200);
      obs.unobserve(target);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cIo.observe(c));

  function animateCount(el, end, duration) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ESDU Outreach Map with Leaflet and Carto Light
  const mapContainer = document.getElementById('esdu-map-container');
  const tabLocal = document.getElementById('tab-local');
  const tabRegional = document.getElementById('tab-regional');
  const tabGlobal = document.getElementById('tab-global');
  
  if (mapContainer && window.L) {
    // Initialize Leaflet map with Carto Light basemap
    const map = L.map('esdu-map-container', {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true,
      dragging: true
    }).setView([33.897, 35.478], 8); // Start at Lebanon view

    // Add Carto Light basemap without labels (no country names)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    
    // Add CSS to ensure no labels appear (hide any that might slip through)
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container .leaflet-pane {
        position: relative;
      }
      /* Hide all text labels on the map */
      .leaflet-container .leaflet-pane svg text,
      .leaflet-container .leaflet-pane .leaflet-tile-container text,
      .leaflet-container text {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Use esduLocations data from imported script
    // Filter out RUAF-related locations
    function filterRUAF(locations) {
      if (!locations) return [];
      return locations.filter(loc => {
        const str = JSON.stringify(loc).toLowerCase();
        return !str.includes('ruaf');
      });
    }
    
    // Initialize data structure with RUAF locations filtered out
    let esduData = { 
      hub: typeof esduLocations !== 'undefined' ? esduLocations.hub : null, 
      local: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.local) : [],
      regional: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.regional) : [],
      global: typeof esduLocations !== 'undefined' ? filterRUAF(esduLocations.global) : []
    };

    // Render outreach map with connections
    function renderOutreachMap(map, data, expectedView) {
      // Clear existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      if (!data.hub) return;

      // Add hub marker (ESDU)
      const hubIcon = L.divIcon({
        className: 'esdu-hub-marker',
        html: `<div class="hub-pulse"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const hubMarker = L.marker([data.hub.lat, data.hub.lon], { icon: hubIcon });
      hubMarker.bindPopup(
        `<div class="map-popup-content">
          <h4>${data.hub.title}</h4>
          <p>${data.hub.desc}</p>
        </div>`
      );
      hubMarker.addTo(map);

      // Store markers and connections for animation
      const markersAndConnections = [];
      
      // CRITICAL FIX: Create markers but DON'T add to map yet
      // This prevents Leaflet from calculating positions before view is set
      data.nodes.forEach((node, index) => {
        // Create node marker with wrapper div for animation (transform wrapper, not marker element)
        const nodeIcon = L.divIcon({
          className: 'esdu-node-marker',
          html: `<div class="marker-animation-wrapper" style="opacity: 0; transform: scale(0); transition: opacity 0.5s ease, transform 0.5s ease;"><div class="node-pulse"></div></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        
        const nodeMarker = L.marker([node.lat, node.lon], { icon: nodeIcon });
        
        // Build popup content
        let popupContent = `<div class="map-popup-content">`;
        if (node.logo) {
          popupContent += `<img src="${node.logo}" alt="${node.name}" class="popup-logo" />`;
        }
        popupContent += `<h4>${node.title}</h4><p>${node.desc}</p>`;
        if (node.website) {
          popupContent += `<a href="${node.website}" target="_blank" rel="noopener" class="popup-link">Visit Website →</a>`;
        }
        popupContent += `</div>`;
        
        nodeMarker.bindPopup(popupContent);

        // Create bidirectional animated curved connection line with great circle arc
        const points = [];
        const steps = 50;
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Great circle interpolation for smooth curve
          const lat1 = data.hub.lat * Math.PI / 180;
          const lon1 = data.hub.lon * Math.PI / 180;
          const lat2 = node.lat * Math.PI / 180;
          const lon2 = node.lon * Math.PI / 180;
          
          const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
          
          if (d < 0.001) {
            points.push([data.hub.lat, data.hub.lon]);
            continue;
          }
          
          const A = Math.sin((1 - t) * d) / Math.sin(d);
          const B = Math.sin(t * d) / Math.sin(d);
          const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
          const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
          const z = A * Math.sin(lat1) + B * Math.sin(lat2);
          
          const finalLat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
          const finalLon = Math.atan2(y, x) * 180 / Math.PI;
          
          points.push([finalLat, finalLon]);
        }
        
        const connectionLine = L.polyline(points, {
          color: '#840132',
          weight: 2,
          opacity: 0,
          dashArray: '10, 10',
          className: 'animated-connection-line bidirectional'
        });
        
        // Store for animation - markers NOT added to map yet
        markersAndConnections.push({
          marker: nodeMarker,
          connection: connectionLine,
          node: node,
          index: index
        });
      });
      
      // Calculate delay to fit all markers within 4 seconds max
      const totalMarkers = markersAndConnections.length;
      const maxAnimationTime = 4000; // 4 seconds in milliseconds
      const minDelay = 50; // Minimum delay between markers (50ms for smooth sequential effect)
      const maxDelay = totalMarkers > 1 ? Math.min(maxAnimationTime / (totalMarkers - 1), 200) : 0;
      const delayPerMarker = Math.max(minDelay, maxDelay);
      
      // NOW add markers to map one by one with calculated delay - they're already properly positioned
      markersAndConnections.forEach((item, index) => {
        const delay = index * delayPerMarker;
        
        const timeoutId = setTimeout(() => {
          // CRITICAL FIX: Check if view has changed before adding layers
          // This prevents lines from previous view from appearing
          if (expectedView && currentView !== expectedView) {
            // View has changed, don't add these layers
            return;
          }
          
          // Add marker to map - Leaflet will position it correctly NOW
          item.marker.addTo(map);
          
          // Add connection line
          item.connection.addTo(map);
          
          // Animate marker appearance using the wrapper div inside the icon
          const markerElement = item.marker.getElement();
          if (markerElement) {
            const wrapper = markerElement.querySelector('.marker-animation-wrapper');
            if (wrapper) {
              // Trigger animation by changing wrapper styles
              requestAnimationFrame(() => {
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'scale(1)';
              });
            }
          }
          
          // Show connection line with animation
          const connectionElement = item.connection.getElement();
          if (connectionElement) {
            item.connection.setStyle({ opacity: 0.6 });
            // Add staggered delay to each line for wave effect (existing animation)
            const waveDelay = index * 0.3;
            connectionElement.style.animationDelay = `${waveDelay}s`;
          }
        }, delay);
        
        // Track this timeout so it can be cancelled if view changes
        pendingTimeouts.push(timeoutId);
      });
    }

    // Helper function to identify European locations
    function isEuropeanLocation(node) {
      // European location IDs (Mediterranean and European connections)
      const europeanIds = [
        'rome-fao', 'rome-ifad', 'rome-wfp', // Rome, Italy (FAO, IFAD, WFP)
        'brussels-eu', // Brussels, Belgium (European Commission)
        'barcelona-prima', // Barcelona, Spain (PRIMA)
        'amsterdam-porticus', 'amsterdam-seed-to-table', // Amsterdam, Netherlands
        'leusden-ruaf', // Leusden, Netherlands (RUAF Foundation)
        'zurich-drosos' // Zurich, Switzerland (DROSOS Foundation)
      ];
      
      // Also check for European locations by name patterns
      const europeanNames = ['rome', 'brussels', 'barcelona', 'amsterdam', 'leusden', 'zurich', 'paris', 'london', 'berlin', 'madrid', 'lisbon', 'athens'];
      if (node.name && europeanNames.some(name => node.name.toLowerCase().includes(name))) {
        return true;
      }
      
      // Check by ID first
      if (node.id && europeanIds.includes(node.id)) {
        return true;
      }
      
      // Also check by coordinates (Mediterranean Europe: 35-55°N, -10-40°E)
      const lat = node.lat;
      const lon = node.lon;
      if (lat >= 35 && lat <= 55 && lon >= -10 && lon <= 40) {
        // Additional check: exclude MENA countries (Arab countries)
        const menaCountryNames = ['beirut', 'arsal', 'baalbek', 'yammouneh', 'zahle', 'nabatieh', 
          'saida', 'akkar', 'shouf', 'hasbaya', 'cairo', 'amman', 'damascus', 'baghdad', 
          'ramallah', 'rabat', 'tunis', 'algiers', 'sanaa', 'riyadh', 'doha', 'manama', 
          'muscat', 'abu-dhabi', 'kuwait', 'dubai', 'sharjah'];
        if (node.id && !menaCountryNames.some(name => node.id.includes(name))) {
          return true;
        }
        // Also check by name if no ID
        if (node.name && !menaCountryNames.some(name => node.name.toLowerCase().includes(name))) {
          return true;
        }
      }
      
      return false;
    }

    // Tab switching for local/regional/global views
    let currentView = 'local';
    // Track pending timeouts to cancel them when switching views
    let pendingTimeouts = [];
    let renderTimeoutId = null;
    
    function switchView(view) {
      currentView = view;
      
      // CRITICAL FIX: Cancel all pending timeouts from previous view
      // This prevents lines from previous view from appearing in new view
      pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
      pendingTimeouts = [];
      if (renderTimeoutId) {
        clearTimeout(renderTimeoutId);
        renderTimeoutId = null;
      }
      
      // CRITICAL FIX: Immediately clear all markers and polylines before switching
      // This ensures no leftover lines from previous view
      map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
      
      // Filter nodes based on view - ensure local only shows Lebanon points
      let filteredNodes = [];
      if (view === 'local') {
        // Local view: Only Lebanon locations (type: 'local')
        filteredNodes = esduData.local.filter(node => node.type === 'local');
        // Include hub for local view
      } else if (view === 'regional') {
        // Regional view: MENA region locations + European connections
        const menaNodes = esduData.regional.filter(node => node.type === 'regional');
        const europeanNodes = esduData.global.filter(node => isEuropeanLocation(node));
        filteredNodes = [...menaNodes, ...europeanNodes];
      } else if (view === 'global') {
        // Global view: All international locations including key European partners
        // Include major European partners (FAO, IFAD, WFP, EU) in both views for balance
        const majorEuropeanIds = ['rome-fao', 'rome-ifad', 'rome-wfp', 'brussels-eu', 'barcelona-prima'];
        filteredNodes = esduData.global.filter(node => {
          // Include all non-European locations
          if (!isEuropeanLocation(node)) {
            return true;
          }
          // Include major European partners in global view too
          if (node.id && majorEuropeanIds.includes(node.id)) {
            return true;
          }
          return false;
        });
      }
      
      // For local view, include hub; for regional/global, include hub as well for context
      const filteredData = { hub: esduData.hub, nodes: filteredNodes };
      
      // Update UI
      tabLocal.setAttribute('aria-selected', view === 'local');
      tabRegional.setAttribute('aria-selected', view === 'regional');
      tabGlobal.setAttribute('aria-selected', view === 'global');
      
      // CRITICAL: Set map view FIRST before rendering markers
      // This ensures markers are positioned correctly from the start
      const setViewAndRender = () => {
        if (view === 'local') {
          // Local view: Show only Lebanon - zoomed in view
          if (filteredNodes.length > 0) {
            const bounds = L.latLngBounds([esduData.hub.lat, esduData.hub.lon]);
            filteredNodes.forEach(node => {
              bounds.extend([node.lat, node.lon]);
            });
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: false });
          } else {
            // Default Lebanon view
            map.setView([33.897, 35.478], 8, { animate: false });
          }
        } else if (view === 'regional') {
          // Regional view: Show MENA region + European connections (closer zoom)
          if (filteredNodes.length > 0) {
            const bounds = L.latLngBounds([esduData.hub.lat, esduData.hub.lon]);
            filteredNodes.forEach(node => {
              bounds.extend([node.lat, node.lon]);
            });
            // Regional view: closer zoom (maxZoom: 6) to show MENA + Europe more clearly
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6, animate: false });
          } else {
            // Default MENA + Europe view if no nodes
            map.setView([35.0, 25.0], 5, { animate: false });
          }
        } else if (view === 'global') {
          // Global view: Show world map with all global connections (wider zoom)
          if (filteredNodes.length > 0) {
            const bounds = L.latLngBounds([esduData.hub.lat, esduData.hub.lon]);
            filteredNodes.forEach(node => {
              bounds.extend([node.lat, node.lon]);
            });
            // Global view: wider zoom (maxZoom: 2) to show worldwide connections
            map.fitBounds(bounds, { padding: [100, 100], maxZoom: 2, animate: false });
          } else {
            // Default world view
            map.setView([20.0, 0.0], 2, { animate: false });
          }
        }
        
        // Wait for map to update, then render markers
        renderTimeoutId = setTimeout(() => {
          map.invalidateSize();
          renderOutreachMap(map, filteredData, view);
          renderTimeoutId = null;
        }, 10);
      };
      
      setViewAndRender();
    }

    tabLocal.addEventListener('click', () => switchView('local'));
    tabRegional.addEventListener('click', () => switchView('regional'));
    tabGlobal.addEventListener('click', () => switchView('global'));
    
  // Initial render
    switchView('local');
  }
});

// Helper: find active index from scroll position
function activeIndex(nodes) {
  let idx = 0, min = Infinity;
  const rect = nodes[0].parentElement.getBoundingClientRect();
  nodes.forEach((n, i) => {
    const r = n.getBoundingClientRect();
    const d = Math.abs((r.left + r.right) / 2 - (rect.left + rect.right) / 2);
    if (d < min) { min = d; idx = i; }
  });
  return idx;
}

// Image error handling - show fallback for missing images
ready(() => {
  // Handle all images on the page
  const allImages = document.querySelectorAll('img');
  
  allImages.forEach(img => {
    // Add error handler
    img.addEventListener('error', function() {
      // Mark as failed
      this.classList.add('image-error');
      this.style.display = 'none';
      
      // Create or show fallback
      const container = this.parentElement;
      if (container && !container.querySelector('.image-fallback')) {
        // Create fallback div
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.style.cssText = `
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: inherit;
          border: 1px solid rgba(132, 1, 50, 0.08);
        `;
        
        // No striped pattern - clean elegant background
        
        // Insert fallback - for hero images, make sure it doesn't create extra space
        if (container.classList.contains('hero-image-carousel') || container.classList.contains('hero-visual')) {
          container.style.position = 'relative';
          container.appendChild(fallback);
        } else {
          container.style.position = 'relative';
          container.appendChild(fallback);
        }
      }
    });
    
    // Also check if image loaded successfully
    img.addEventListener('load', function() {
      this.classList.remove('image-error');
      this.style.display = '';
      const fallback = this.parentElement?.querySelector('.image-fallback');
      if (fallback) {
        fallback.remove();
      }
    });
    
    // Pre-check images that might be broken
    if (img.complete && img.naturalHeight === 0 && img.src) {
      img.dispatchEvent(new Event('error'));
    }
  });
});

// Video fullscreen handling for better cross-platform support (for iframe embeds)
ready(() => {
  const videoIframe = document.querySelector('.esdu-video-iframe');
  // Note: Google Drive iframe handles fullscreen internally, no additional JS needed
  // The iframe's allowfullscreen attribute enables native fullscreen support

  // Hero Image Carousel with dynamic image loading and enhanced animations
  const heroCarousel = document.querySelector('.hero-image-carousel');
  if (heroCarousel) {
    // CONFIGURATION: Add any image filename with "hero" in the name to this array
    // The carousel will automatically include all images listed here
    // Example: ['hero-1.jpg', 'hero-2.jpg', 'hero-3.JPG', 'hero-4.png']
    const heroImageNames = ['hero-1.jpg', 'hero-2.jpg', 'hero-3.JPG','hero-4.jpg'];
    
    // Check if there are existing images in HTML (for fallback/SEO)
    const existingImages = heroCarousel.querySelectorAll('.hero-image');
    let heroImages = [];
    
    if (existingImages.length > 0) {
      // Use existing images from HTML
      heroImages = Array.from(existingImages);
      // Ensure first image is active
      heroImages.forEach((img, index) => {
        if (index === 0) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    } else {
      // Create image elements dynamically from the configuration array
      heroCarousel.innerHTML = '';
      heroImageNames.forEach((imgName, index) => {
        const img = document.createElement('img');
        img.src = `./assets/images/${imgName}`;
        img.alt = `ESDU Hero Image ${index + 1}`;
        img.className = 'hero-image';
        if (index === 0) {
          img.classList.add('active');
        }
        heroCarousel.appendChild(img);
        heroImages.push(img);
      });
    }
    
    // Enhanced animation effects with more variety
    const effects = [
      'fade',           // Classic fade
      'fade-blur',      // Fade with blur
      'zoom-in',        // Zoom in from center
      'zoom-out',       // Zoom out from large
      'slide-left',     // Slide from left
      'slide-right',    // Slide from right
      'slide-up',       // Slide from bottom
      'slide-down',     // Slide from top
      'rotate-in',      // Rotate while fading in
      'flip-horizontal', // Flip horizontally
      'flip-vertical',  // Flip vertically
      'scale-bounce',   // Scale with bounce effect
      'wipe-left',      // Wipe from left
      'wipe-right',     // Wipe from right
      'cross-zoom',     // Cross zoom (old zooms out, new zooms in)
      'blur-focus'      // Blur to focus
    ];
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    function getRandomEffect() {
      return effects[Math.floor(Math.random() * effects.length)];
    }
    
    function rotateHeroImages() {
      if (isTransitioning || heroImages.length <= 1) return;
      
      isTransitioning = true;
      const previousIndex = currentIndex;
      currentIndex = (currentIndex + 1) % heroImages.length;
      const effect = getRandomEffect();
      
      const prevImg = heroImages[previousIndex];
      const nextImg = heroImages[currentIndex];
      
      // Remove all effect classes from all images
      heroImages.forEach(img => {
        img.classList.remove(
          'active', 'fade-out', 'fade-in', 'fade-blur-in', 'fade-blur-out',
          'zoom-in', 'zoom-out', 'zoom-in-effect', 'zoom-out-effect',
          'slide-left', 'slide-right', 'slide-up', 'slide-down',
          'slide-left-in', 'slide-right-in', 'slide-up-in', 'slide-down-in',
          'rotate-in', 'flip-horizontal', 'flip-vertical',
          'scale-bounce', 'wipe-left', 'wipe-right',
          'cross-zoom-out', 'cross-zoom-in', 'blur-focus-in'
        );
        img.style.transform = '';
        img.style.filter = '';
        img.style.opacity = '';
      });
      
      // Handle different animation effects
      switch(effect) {
        case 'fade':
          prevImg.classList.add('fade-out');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            nextImg.classList.add('active', 'fade-in');
            setTimeout(() => {
              nextImg.classList.remove('fade-in');
              isTransitioning = false;
            }, 1500);
          }, 800);
          break;
          
        case 'fade-blur':
          prevImg.classList.add('fade-blur-out');
          setTimeout(() => {
            prevImg.classList.remove('fade-blur-out', 'active');
            nextImg.classList.add('active', 'fade-blur-in');
            setTimeout(() => {
              nextImg.classList.remove('fade-blur-in');
              isTransitioning = false;
            }, 1500);
          }, 800);
          break;
          
        case 'zoom-in':
          prevImg.classList.add('fade-out');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            nextImg.classList.add('active', 'zoom-in-effect');
            setTimeout(() => {
              nextImg.classList.remove('zoom-in-effect');
              isTransitioning = false;
            }, 1500);
          }, 300);
          break;
          
        case 'zoom-out':
          prevImg.classList.add('zoom-out-effect');
          setTimeout(() => {
            prevImg.classList.remove('zoom-out-effect', 'active');
            nextImg.classList.add('active', 'fade-in');
            setTimeout(() => {
              nextImg.classList.remove('fade-in');
              isTransitioning = false;
            }, 1500);
          }, 300);
          break;
          
        case 'slide-left':
          prevImg.classList.add('slide-left');
          nextImg.classList.add('active', 'slide-right-in');
          setTimeout(() => {
            prevImg.classList.remove('slide-left', 'active');
            setTimeout(() => {
              nextImg.classList.remove('slide-right-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'slide-right':
          prevImg.classList.add('slide-right');
          nextImg.classList.add('active', 'slide-left-in');
          setTimeout(() => {
            prevImg.classList.remove('slide-right', 'active');
            setTimeout(() => {
              nextImg.classList.remove('slide-left-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'slide-up':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'slide-up-in');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('slide-up-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'slide-down':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'slide-down-in');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('slide-down-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'rotate-in':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'rotate-in');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('rotate-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'flip-horizontal':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'flip-horizontal');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('flip-horizontal');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'flip-vertical':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'flip-vertical');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('flip-vertical');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'scale-bounce':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'scale-bounce');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('scale-bounce');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'wipe-left':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'wipe-left');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('wipe-left');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'wipe-right':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'wipe-right');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('wipe-right');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'cross-zoom':
          prevImg.classList.add('cross-zoom-out');
          nextImg.classList.add('active', 'cross-zoom-in');
          setTimeout(() => {
            prevImg.classList.remove('cross-zoom-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('cross-zoom-in');
              isTransitioning = false;
            }, 100);
          }, 1200);
          break;
          
        case 'blur-focus':
          prevImg.classList.add('fade-out');
          nextImg.classList.add('active', 'blur-focus-in');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            setTimeout(() => {
              nextImg.classList.remove('blur-focus-in');
              isTransitioning = false;
            }, 100);
          }, 1500);
          break;
          
        default:
          // Fallback to fade
          prevImg.classList.add('fade-out');
          setTimeout(() => {
            prevImg.classList.remove('fade-out', 'active');
            nextImg.classList.add('active', 'fade-in');
            setTimeout(() => {
              nextImg.classList.remove('fade-in');
              isTransitioning = false;
            }, 1500);
          }, 800);
      }
    }
    
    // Wait for images to load before starting carousel
    let imagesLoaded = 0;
    const totalExpected = heroImages.length; // Use actual heroImages array length
    let carouselStarted = false;
    
    function startCarouselIfReady() {
      if (!carouselStarted && imagesLoaded >= totalExpected && heroImages.length > 1) {
        carouselStarted = true;
        setInterval(rotateHeroImages, 5000);
      }
    }
    
    heroImages.forEach(img => {
      if (img.complete) {
        imagesLoaded++;
        startCarouselIfReady();
      } else {
        img.addEventListener('load', () => {
          imagesLoaded++;
          startCarouselIfReady();
        });
        img.addEventListener('error', () => {
          imagesLoaded++;
          // Remove broken image from array
          const index = heroImages.indexOf(img);
          if (index > -1) {
            heroImages.splice(index, 1);
            img.remove();
          }
          startCarouselIfReady();
        });
      }
    });
  }
});
