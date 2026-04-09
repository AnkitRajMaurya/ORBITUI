/**
 * =====================================================================
 * OrbitUI — main.js
 * Shared JavaScript across: index.html | about.html | contact.html
 * =====================================================================
 */

/* =====================================================================
   UTILITY: Safe element grabber (returns null without throwing)
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

/* =====================================================================
   0. CUSTOM CURSOR & AMBIENT ORBS
   ===================================================================== */
(function initVisuals() {
  // 0.1 Custom Cursor
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth trailing effect
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover states for the cursor
  const interactables = $$('a, button, .glass, .dest-card, .cabin-card, .mission-card, .gallery-item, .feature-item, .fact-card, .proj-card, .cabin-cta, .dest-book-btn, input, select, textarea');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // 0.2 Ambient Background Orbs
  const colors = ['rgba(0, 212, 255, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(236, 72, 153, 0.3)'];
  for (let i = 0; i < 4; i++) {
    const orb = document.createElement('div');
    orb.className = 'ambient-orb';
    
    // Randomize size and position
    const size = Math.random() * 300 + 200;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.left = `${Math.random() * 100}vw`;
    orb.style.top = `${Math.random() * 100}vh`;
    orb.style.background = `radial-gradient(circle, ${colors[i % colors.length]}, transparent 70%)`;
    orb.style.animationDelay = `${Math.random() * 5}s`;
    orb.style.animationDuration = `${Math.random() * 10 + 15}s`;

    document.body.insertBefore(orb, document.body.firstChild);
  }

  // 0.3 Typing Effect on Hero
  const typingText = $('hero-typing-text');
  if (typingText) {
    const originalText = typingText.innerHTML.trim();
    typingText.innerHTML = ''; // clear initially
    typingText.style.visibility = 'visible'; // override any initial display:none hide issues
    
    // Convert to plain text to animate properly letter by letter
    const textToType = "Experience the universe beyond Earth's limits. Journey to the Moon, orbit Mars, or dock with the ISS aboard state-of-the-art spacecraft.";
    
    let charIndex = 0;
    // Delay start slightly to let page transition finish
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < textToType.length) {
          typingText.innerHTML += textToType.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          typingText.style.borderRight = 'none'; // remove cursor when done
        }
      }, 35); // speed
    }, 800);
  }
})();

/* =====================================================================
   1. ANIMATED STAR FIELD (Canvas)
   ===================================================================== */
(function initStarField() {
  const canvas = $('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(count = 220) {
    stars = Array.from({ length: count }, () => ({
      x     : Math.random() * canvas.width,
      y     : Math.random() * canvas.height,
      r     : Math.random() * 1.5 + 0.3,
      alpha : Math.random(),
      speed : Math.random() * 0.4 + 0.1,
      dir   : Math.random() > 0.5 ? 1 : -1
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      // Twinkle — drift alpha back and forth
      s.alpha += s.speed * 0.01 * s.dir;
      if (s.alpha <= 0 || s.alpha >= 1) s.dir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });

  resize();
  createStars();
  drawFrame();
})();

/* =====================================================================
   2. NAVBAR — Scroll effect + Hamburger toggle
   ===================================================================== */
(function initNavbar() {
  const navbar    = $('navbar');
  const hamburger = $('hamburger');
  const navLinks  = $('nav-links');

  if (!navbar) return;

  const navHrefLabelMap = {
    'index.html': 'Home',
    'missions.html': 'Missions',
    'gallery.html': 'Gallery',
    'booking.html': 'Booking',
    'about.html': 'About',
    'contact.html': 'Contact'
  };

  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && navHrefLabelMap[href]) {
      link.textContent = navHrefLabelMap[href];
    }
  });

  document.querySelectorAll('.nav-logo').forEach(link => {
    link.textContent = 'OrbitUI';
  });

  // Darken navbar on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked on mobile
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
})();

/* =====================================================================
   3. PAGE TRANSITIONS
   Intercepts internal links and plays a slide overlay animation
   ===================================================================== */
(function initPageTransitions() {
  const overlay = $('page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    // Only same-origin, non-hash, non-external links
    const isSameOrigin = link.hostname === location.hostname;
    const isHashLink   = !!link.hash && link.pathname === location.pathname;
    const isExternal   = link.target === '_blank';

    if (isSameOrigin && !isHashLink && !isExternal) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.href;
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 500);
      });
    }
  });
})();

/* =====================================================================
   4. SCROLL REVEAL — IntersectionObserver
   ===================================================================== */
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* =====================================================================
   5. INDEX PAGE — Destination & Cabin cards redirect to booking logic
   ===================================================================== */
(function initDestCards() {
  // dest-cards are now <a> tags — just handle cabin param auto-select on booking page
  // Auto-select destination on booking.html based on URL parameter
  const destSelect = $('f-dest');
  if (destSelect) {
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get('dest');
    if (destParam && Array.from(destSelect.options).some(opt => opt.value === destParam)) {
      destSelect.value = destParam;
    }
  }

  // Auto-select cabin class on booking.html based on URL parameter
  const cabinSelect = $('f-cabin');
  if (cabinSelect) {
    const params = new URLSearchParams(window.location.search);
    const cabinParam = params.get('cabin');
    if (cabinParam && Array.from(cabinSelect.options).some(opt => opt.value === cabinParam)) {
      cabinSelect.value = cabinParam;
    }
  }
})();

/* =====================================================================
   6. INDEX PAGE — Auto-fill minimum launch date (2 months from now)
   ===================================================================== */
(function initDateAutofill() {
  const dateInput = $('f-date');
  if (!dateInput) return;

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() + 2);

  const yyyy = minDate.getFullYear();
  const mm   = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd   = String(minDate.getDate()).padStart(2, '0');
  const formatted = `${yyyy}-${mm}-${dd}`;

  dateInput.min   = formatted;
  dateInput.value = formatted;
})();

/* =====================================================================
   7. INDEX PAGE — Hero CTA smooth scroll/navigation & scroll indicator
   ===================================================================== */
(function initHeroCTA() {
  const btn = $('hero-book-btn');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    const target = $('booking');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' }); // if we're somehow on the same page
    } else {
      const pageTransition = $('page-transition');
      if (pageTransition) pageTransition.classList.add('active');
      setTimeout(() => {
        window.location.href = 'booking.html';
      }, 500); 
    }
  });

  // Scroll indicator — scroll down to destinations section
  const scrollBtn = $('hero-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const dest = $('destinations') || $('why-orbitui');
      if (dest) dest.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();

/* =====================================================================
   8. INDEX PAGE — Booking Form Validation & Fake Success
   ===================================================================== */
(function initBookingForm() {
  const form = $('booking-form');
  if (!form) return;

  /**
   * Validate a single field.
   * @param {string} inputId    - ID of the input/select element
   * @param {string} errId      - ID of the error span
   * @param {Function} condition - Returns true when value is valid
   * @returns {boolean}
   */
  function validateField(inputId, errId, condition) {
    const el  = $(inputId);
    const err = $(errId);
    if (!el || !err) return true;

    const isValid = condition(el.value);
    el.classList.toggle('error', !isValid);
    err.classList.toggle('show', !isValid);
    return isValid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const checks = [
      validateField('f-name',       'err-name',       v => v.trim().length >= 2),
      validateField('f-email',      'err-email',      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validateField('f-dest',       'err-dest',       v => v !== ''),
      validateField('f-date',       'err-date',       v => v !== ''),
      validateField('f-cabin',      'err-cabin',      v => v !== ''),
      validateField('f-passengers', 'err-passengers', v => v >= 1 && v <= 6)
    ];

    if (!checks.every(Boolean)) return;

    // Show personalised success message
    const name  = $('f-name').value;
    const dest  = $('f-dest').value;
    const cabin = $('f-cabin').value;
    const pax   = $('f-passengers').value;

    form.style.display = 'none';

    const successBox = $('success-msg');
    const detail     = $('success-detail');
    if (successBox && detail) {
      detail.textContent =
        `${name}, your ${cabin} seat to ${dest} for ${pax} passenger(s) is confirmed. Mission Control will contact you shortly. 🌌`;
      successBox.classList.add('show');
    }
  });

  // Remove error state on input
  ['f-name', 'f-email', 'f-dest', 'f-date', 'f-cabin', 'f-passengers'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });
})();

/* =====================================================================
   9. ABOUT PAGE — Timeline Tabs (Education / Experience)
   ===================================================================== */
(function initTimelineTabs() {
  const tabBtns = $$('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all
      tabBtns.forEach(b => b.classList.remove('active'));
      $$('.timeline-list').forEach(l => l.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const target = $('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
})();

/* =====================================================================
   10. CONTACT PAGE — Contact Form Validation & Fake Success
   ===================================================================== */
(function initContactForm() {
  const form = $('contact-form');
  if (!form) return;

  function validateField(inputId, errId, condition) {
    const el  = $(inputId);
    const err = $(errId);
    if (!el || !err) return true;

    const isValid = condition(el.value);
    el.classList.toggle('error', !isValid);
    err.classList.toggle('show', !isValid);
    return isValid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const checks = [
      validateField('c-name',    'cerr-name',    v => v.trim().length >= 2),
      validateField('c-email',   'cerr-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validateField('c-message', 'cerr-message', v => v.trim().length >= 10)
    ];

    if (!checks.every(Boolean)) return;

    form.style.display = 'none';
    const success = $('c-success');
    if (success) success.classList.add('show');
  });

  // Remove error on input
  ['c-name', 'c-email', 'c-message'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });
})();

/* =====================================================================
   11. GALLERY PAGE — Filter Tabs
   ===================================================================== */
(function initGalleryFilter() {
  const filterBtns = $$('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      $$('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* =====================================================================
   12. GALLERY PAGE — Lightbox
   ===================================================================== */
(function initLightbox() {
  const lightbox     = $('lightbox');
  if (!lightbox) return;

  const overlay      = $('lightbox-overlay');
  const closeBtn     = $('lightbox-close');
  const prevBtn      = $('lightbox-prev');
  const nextBtn      = $('lightbox-next');
  const lbImg        = $('lightbox-img');
  const lbTitle      = $('lightbox-title');
  const lbDesc       = $('lightbox-desc');

  let items  = [];  // visible gallery items
  let current = 0;

  /** Open lightbox at a given index */
  function openAt(index) {
    items = Array.from($$('.gallery-item:not(.hidden)'));
    current = Math.max(0, Math.min(index, items.length - 1));
    loadItem(current);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /** Load image data into lightbox */
  function loadItem(index) {
    const item = items[index];
    if (!item) return;
    const img = item.querySelector('img');
    lbImg.src        = img ? img.src   : '';
    lbImg.alt        = img ? img.alt   : '';
    lbTitle.textContent = item.dataset.title || '';
    lbDesc.textContent  = item.dataset.desc  || '';
    current = index;
  }

  /** Close lightbox */
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Click on gallery item → open
  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item && !item.classList.contains('hidden')) {
      const allVisible = Array.from($$('.gallery-item:not(.hidden)'));
      openAt(allVisible.indexOf(item));
    }
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  // Click overlay
  if (overlay)  overlay.addEventListener('click', closeLightbox);

  // Prev / Next buttons
  if (prevBtn) prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    items = Array.from($$('.gallery-item:not(.hidden)'));
    loadItem((current - 1 + items.length) % items.length);
  });

  if (nextBtn) nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    items = Array.from($$('.gallery-item:not(.hidden)'));
    loadItem((current + 1) % items.length);
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')  { items = Array.from($$('.gallery-item:not(.hidden)')); loadItem((current - 1 + items.length) % items.length); }
    if (e.key === 'ArrowRight') { items = Array.from($$('.gallery-item:not(.hidden)')); loadItem((current + 1) % items.length); }
  });
})();
