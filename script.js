/* ============================================================
   DevStudio Portfolio — Main JavaScript v2.0
   Clean, performant, no cursor glow, deployment ready
   ============================================================ */

'use strict';

/* ─── State ─────────────────────────────────────────────────── */
const state = {
  isDark: true,
  lang: 'en',
  menuOpen: false,
};

/* ─── DOM Cache ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ─── Elements ───────────────────────────────────────────────── */
const desktopThemeBtn = $('themeToggle');
const mobileThemeBtn = $('mobileThemeToggle');
const desktopSunIcon = $('sunIcon');
const desktopMoonIcon = $('moonIcon');
const mobileSunIcon = $('mobileSunIcon');
const mobileMoonIcon = $('mobileMoonIcon');

const desktopLangBtn = $('langToggle');
const mobileLangBtn = $('mobileLangToggle');
const desktopLangLabel = $('langLabel');
const mobileLangLabel = $('mobileLangLabel');

const menuToggleBtn = $('menuToggle');
const mobileMenu = $('mobileMenu');
const mobileBar = $('mobileBar');

const contactForm = $('contactForm');
const successMsg = $('successMessage');
const submitBtn = $('submitBtn');
const submitText = $('submitText');
const submitArrow = $('submitArrow');
const submitSpinner = $('submitSpinner');

/* ─── Init ───────────────────────────────────────────────────── */
function init() {
  loadPreferences();
  bindEvents();
  initRevealObserver();
  initNavHighlight();
  initHeroAnimations();
  initSmoothScroll();
  initCounterAnimations();
  initPricingTilt();
  initScrollNavEffect();
  initKeyboardNav();
  initTouchSwipe();
}

/* ─── Load Preferences ───────────────────────────────────────── */
function loadPreferences() {
  // Theme
  const savedTheme = localStorage.getItem('ds-theme');
  if (savedTheme === 'light') {
    state.isDark = false;
  } else {
    state.isDark = true;
  }
  applyTheme(false);

  // Language
  const savedLang = localStorage.getItem('ds-lang');
  if (savedLang === 'fa') {
    state.lang = 'fa';
    applyLanguage(false);
  }
}

/* ─── Theme ──────────────────────────────────────────────────── */
function applyTheme(save = true) {
  const html = document.documentElement;

  if (state.isDark) {
    html.classList.add('dark');
    document.body.style.backgroundColor = '#080810';
    // Icons
    desktopSunIcon.classList.add('hidden');
    desktopMoonIcon.classList.remove('hidden');
    mobileSunIcon.classList.add('hidden');
    mobileMoonIcon.classList.remove('hidden');
    // Meta theme-color
    document.querySelector('meta[name="theme-color"]').content = '#080810';
  } else {
    html.classList.remove('dark');
    document.body.style.backgroundColor = '';
    // Icons
    desktopSunIcon.classList.remove('hidden');
    desktopMoonIcon.classList.add('hidden');
    mobileSunIcon.classList.remove('hidden');
    mobileMoonIcon.classList.add('hidden');
    // Meta theme-color
    document.querySelector('meta[name="theme-color"]').content = '#f5f5ff';
  }

  if (save) {
    localStorage.setItem('ds-theme', state.isDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  state.isDark = !state.isDark;
  applyTheme();
}

/* ─── Language ───────────────────────────────────────────────── */
function applyLanguage(save = true) {
  const isFa = state.lang === 'fa';
  const html = document.documentElement;

  html.setAttribute('dir', isFa ? 'rtl' : 'ltr');
  html.setAttribute('lang', isFa ? 'fa' : 'en');

  // Update toggle labels
  const newLabel = isFa ? 'EN' : 'FA';
  desktopLangLabel.textContent = newLabel;
  mobileLangLabel.textContent = newLabel;

  // Translate all elements
  document.querySelectorAll('[data-en][data-fa]').forEach(el => {
    const text = el.getAttribute(`data-${state.lang}`);
    if (!text) return;

    if (el.tagName === 'INPUT') {
      el.placeholder = text;
    } else if (el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });

  if (save) {
    localStorage.setItem('ds-lang', state.lang);
  }
}

function toggleLanguage() {
  state.lang = state.lang === 'en' ? 'fa' : 'en';
  applyLanguage();
}

/* ─── Mobile Menu ────────────────────────────────────────────── */
function openMenu() {
  state.menuOpen = true;
  mobileMenu.classList.remove('mobile-menu-closed');
  mobileMenu.classList.add('mobile-menu-open');
  mobileMenu.removeAttribute('aria-hidden');
  menuToggleBtn.setAttribute('aria-expanded', 'true');
  menuToggleBtn.setAttribute('aria-label', 'Close menu');
  // Hamburger → X
  const bar = menuToggleBtn;
  bar.classList.add('menu-active');
}

function closeMenu() {
  state.menuOpen = false;
  mobileMenu.classList.remove('mobile-menu-open');
  mobileMenu.classList.add('mobile-menu-closed');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggleBtn.setAttribute('aria-expanded', 'false');
  menuToggleBtn.setAttribute('aria-label', 'Toggle menu');
  menuToggleBtn.classList.remove('menu-active');
}

function toggleMenu() {
  state.menuOpen ? closeMenu() : openMenu();
}

/* ─── Scroll Navbar Effect ───────────────────────────────────── */
function initScrollNavEffect() {
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;

        // Compact nav on scroll
        const navInner = $('navInner');
        if (navInner) {
          if (y > 60) {
            navInner.style.paddingTop = '0.6rem';
            navInner.style.paddingBottom = '0.6rem';
          } else {
            navInner.style.paddingTop = '';
            navInner.style.paddingBottom = '';
          }
        }

        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── Reveal on Scroll (IntersectionObserver) ────────────────── */
function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(
        entry.target.parentElement?.children || []
      ).filter(el => el.classList.contains('reveal'));

      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 70, 350);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.06,
  });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ─── Nav Active Highlight ───────────────────────────────────── */
function initNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}

/* ─── Hero Animations ────────────────────────────────────────── */
function initHeroAnimations() {
  // Badge
  const badge = document.querySelector('.hero-badge');
  if (badge) badge.classList.add('animate');

  // Headline lines with stagger
  const lines = document.querySelectorAll('.hero-line');
  lines.forEach((line, i) => {
    line.style.setProperty('--delay', `${0.3 + i * 0.12}s`);
    // Small delay before adding class to ensure CSS picks up
    requestAnimationFrame(() => line.classList.add('animate'));
  });

  // Remaining hero elements
  const elements = [
    '.hero-sub',
    '.hero-cta',
    '.hero-trust',
    '.hero-visual',
    '.hero-stats',
  ];

  elements.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      requestAnimationFrame(() => el.classList.add('animate'));
    }
  });
}

/* ─── Smooth Scroll for Anchors ──────────────────────────────── */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href === '#' || href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    const navH = window.innerWidth >= 768 ? 92 : 76;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
    closeMenu();
  });
}

/* ─── Counter Animations ─────────────────────────────────────── */
function initCounterAnimations() {
  // Target gradient-text elements inside stat cards
  const statCards = $$('.hero-stats .glass-card, #about .glass-card');
  const counters = [];

  statCards.forEach(card => {
    const gradEl = card.querySelector('.gradient-text');
    if (!gradEl) return;
    const raw = gradEl.textContent.trim();
    const numMatch = raw.match(/^(\d+)/);
    if (!numMatch) return;

    counters.push({
      el: gradEl,
      target: parseInt(numMatch[1]),
      suffix: raw.replace(numMatch[0], ''),
      original: raw,
      animated: false,
    });
  });

  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      counters.forEach(c => {
        if (c.animated) return;
        if (!entry.target.contains(c.el)) return;

        c.animated = true;
        animateCount(c.el, c.target, c.suffix, c.original);
        observer.unobserve(entry.target);
      });
    });
  }, { threshold: 0.6 });

  statCards.forEach(card => observer.observe(card));
}

function animateCount(el, end, suffix, original) {
  const duration = 1400;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(eased * end);

    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = original;
    }
  }

  requestAnimationFrame(step);
}

/* ─── Pricing Card Tilt ──────────────────────────────────────── */
function initPricingTilt() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = $$('#pricing .glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 3.5;
      const tiltY = ((cx - x) / cx) * 3.5;

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      card.style.transition = 'transform .1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s ease';
    });
  });
}

/* ─── Contact Form ───────────────────────────────────────────── */


function handleFormSubmit(e) {
  e.preventDefault();

  // Validate form
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  setSubmitLoading(true);

  emailjs.sendForm(
    "service_3zmp4bm",
    "template_i2f6rld",
    contactForm
  )
    .then(() => {
      contactForm.reset();

      successMsg.classList.remove("hidden");

      const p = successMsg.querySelector("p");
      if (p) {
        p.textContent = state.lang === "fa"
          ? "پیام ارسال شد! در عرض ۲۴ ساعت با شما تماس می‌گیرم."
          : "Message sent! I'll get back to you within 24 hours.";
      }

      setTimeout(() => {
        successMsg.classList.add("hidden");
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
      alert(
        state.lang === "fa"
          ? "ارسال پیام ناموفق بود."
          : "Failed to send message."
      );
    })
    .finally(() => {
      setSubmitLoading(false);
    });
}







function setSubmitLoading(loading) {
  if (loading) {
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
    submitText.textContent = state.lang === 'fa' ? 'در حال ارسال...' : 'Sending...';
    submitArrow.classList.add('hidden');
    submitSpinner.classList.remove('hidden');
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    submitText.textContent = state.lang === 'fa' ? 'ارسال پیام' : 'Send Message';
    submitArrow.classList.remove('hidden');
    submitSpinner.classList.add('hidden');
  }
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.style.transform = 'translateX(0)';

  let pos = 0;
  const shakes = [6, -6, 5, -5, 4, -4, 3, -3, 2, -2, 1, 0];
  let i = 0;

  const interval = setInterval(() => {
    if (i >= shakes.length) {
      clearInterval(interval);
      el.style.transform = '';
      return;
    }
    el.style.transform = `translateX(${shakes[i]}px)`;
    i++;
  }, 40);
}

/* ─── Keyboard Navigation ────────────────────────────────────── */
function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    // ESC → close menu
    if (e.key === 'Escape' && state.menuOpen) {
      closeMenu();
      menuToggleBtn.focus();
    }
    // Tab trap inside mobile menu (basic)
    if (e.key === 'Tab' && state.menuOpen) {
      const focusable = Array.from(
        mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.disabled);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ─── Touch Swipe (close menu) ───────────────────────────────── */
function initTouchSwipe() {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = startX - e.changedTouches[0].clientX;
    const dy = Math.abs(startY - e.changedTouches[0].clientY);
    if (dx > 60 && dy < 40 && state.menuOpen) closeMenu();
  }, { passive: true });
}

/* ─── Outside Click ──────────────────────────────────────────── */
function initOutsideClick() {
  document.addEventListener('click', e => {
    if (!state.menuOpen) return;
    const clickedMenu = mobileMenu.contains(e.target);
    const clickedToggle = menuToggleBtn.contains(e.target);
    if (!clickedMenu && !clickedToggle) closeMenu();
  });
}

/* ─── Resize Handler ─────────────────────────────────────────── */
function onResize() {
  if (window.innerWidth >= 768 && state.menuOpen) closeMenu();
}

/* ─── Hero Tab Switcher ──────────────────────────────────────── */
function initHeroTabs() {
  const tabs = $$('.hero-visual button');
  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t, i) => {
        const isActive = i === idx;
        t.classList.toggle('dark:text-white', isActive);
        t.classList.toggle('text-gray-900', isActive);
        t.classList.toggle('dark:bg-white/10', isActive);
        t.classList.toggle('bg-white', isActive);
        t.classList.toggle('shadow-sm', isActive);
        t.classList.toggle('dark:text-gray-500', !isActive);
        t.classList.toggle('text-gray-500', !isActive);
        t.classList.toggle('dark:bg-transparent', !isActive);
        t.classList.toggle('bg-transparent', !isActive);
        t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  });
}

/* ─── Visibility Change (Tab Title) ─────────────────────────── */
function initVisibilityChange() {
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? '👋 Come Back! — DevStudio'
      : originalTitle;
  });
}

/* ─── Debounce Utility ───────────────────────────────────────── */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ─── Bind All Events ────────────────────────────────────────── */
function bindEvents() {
  // Theme toggles
  if (desktopThemeBtn) desktopThemeBtn.addEventListener('click', toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

  // Language toggles
  if (desktopLangBtn) desktopLangBtn.addEventListener('click', toggleLanguage);
  if (mobileLangBtn) mobileLangBtn.addEventListener('click', toggleLanguage);

  // Mobile menu
  if (menuToggleBtn) menuToggleBtn.addEventListener('click', toggleMenu);

  // Mobile nav links → close menu
  $$('.mob-link').forEach(link => link.addEventListener('click', closeMenu));

  // Contact form
  if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

  // Outside click
  initOutsideClick();

  // Resize
  window.addEventListener('resize', debounce(onResize, 180));
}

/* ─── DOMContentLoaded ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  init();
  initHeroTabs();
  initVisibilityChange();
});

/* ─── Font Loading Optimization ──────────────────────────────── */
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

/* ─── Register Service Worker (Production) ───────────────────── */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    // Uncomment in production with a sw.js file:
    // navigator.serviceWorker.register('/sw.js');
  });
}