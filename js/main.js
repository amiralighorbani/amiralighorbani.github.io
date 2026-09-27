/* ═══════════════════════════════════════════════════════
   main.js — UI logic: preloader · typing · reveal ·
   counters · tilt · magnetic · cursor · nav · language
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = s => String(s).replace(/\d/g, d => FA_DIGITS[d]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ═══════════ PRELOADER ═══════════ */
  const preloader = document.getElementById('preloader');
  let bootFinished = false;

  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    if (preloader) {
      preloader.classList.add('done');
      setTimeout(() => preloader.remove(), 800);
    }
    document.body.classList.add('loaded');
    setTimeout(startTyping, REDUCE ? 0 : 500);
  }

  (async function runBoot() {
    const lines = document.querySelectorAll('.boot-line');
    const fill = document.getElementById('boot-bar-fill');
    setTimeout(finishBoot, 5200);                       // hard safety
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i].dataset.line || '';
      if (REDUCE) { lines[i].textContent = text; continue; }
      for (let ch = 1; ch <= text.length; ch++) {
        lines[i].textContent = text.slice(0, ch);
        await sleep(5 + Math.random() * 12);
        if (bootFinished) return;
      }
      if (fill) fill.style.width = Math.round((i + 1) / lines.length * 92) + '%';
      await sleep(80);
    }
    if (fill) fill.style.width = '100%';
    await sleep(REDUCE ? 80 : 380);
    finishBoot();
  })();

  /* ═══════════ TYPING EFFECT ═══════════ */
  let typeTimer = null;
  function startTyping() {
    clearTimeout(typeTimer);
    const el = document.getElementById('typed');
    if (!el) return;
    const roles = (I18N[CURRENT_LANG] && I18N[CURRENT_LANG].hero.roles) || [];
    if (REDUCE || !roles.length) { el.textContent = roles[0] || ''; return; }
    let rIdx = 0, cIdx = 0, del = false;
    (function tick() {
      const word = roles[rIdx];
      if (!del) {
        cIdx++;
        el.textContent = word.slice(0, cIdx);
        if (cIdx === word.length) { del = true; typeTimer = setTimeout(tick, 1900); return; }
        typeTimer = setTimeout(tick, 65 + Math.random() * 55);
      } else {
        cIdx--;
        el.textContent = word.slice(0, cIdx);
        if (cIdx === 0) { del = false; rIdx = (rIdx + 1) % roles.length; typeTimer = setTimeout(tick, 420); return; }
        typeTimer = setTimeout(tick, 34);
      }
    })();
  }

  /* ═══════════ REVEAL ON SCROLL ═══════════ */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => {
    const d = el.dataset.delay;
    if (d) el.style.setProperty('--d', d);
  });
  if ('IntersectionObserver' in window && !REDUCE) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ═══════════ COUNTERS ═══════════ */
  function renderCounter(el, val) {
    el.textContent = CURRENT_LANG === 'fa' ? toFa(val) : String(val);
  }
  function animateCounter(el) {
    const target = +el.dataset.count || 0;
    if (REDUCE) { renderCounter(el, target); el.dataset.done = '1'; return; }
    const t0 = performance.now(), dur = 1500;
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      renderCounter(el, Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.dataset.done = '1';
    })(t0);
  }
  const counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(es => {
      es.forEach(en => {
        if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else counters.forEach(animateCounter);

  window.__refreshCounters = function () {
    counters.forEach(el => {
      if (el.dataset.done) renderCounter(el, +el.dataset.count || 0);
    });
  };

  /* ═══════════ 3D TILT CARDS ═══════════ */
  if (FINE_POINTER && !REDUCE) {
    document.querySelectorAll('.tilt').forEach(card => {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);

      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const flip = document.documentElement.dir === 'rtl' ? -1 : 1;
        card.style.setProperty('--ry', (nx * 9 * flip).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-ny * 9).toFixed(2) + 'deg');
        card.style.setProperty('--gx', ((nx + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', ((ny + 0.5) * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ═══════════ MAGNETIC BUTTONS ═══════════ */
  if (FINE_POINTER && !REDUCE) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = `${dx * 0.22}px ${dy * 0.28}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = '0px 0px'; });
    });
  }

  /* ═══════════ CUSTOM CURSOR ═══════════ */
  if (FINE_POINTER && !REDUCE) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot && ring) {
      let rx = -100, ry = -100, tx = -100, ty = -100, shown = false;
      document.addEventListener('pointermove', e => {
        tx = e.clientX; ty = e.clientY;
        dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
        if (!shown) { shown = true; document.body.classList.add('cursor-on'); }
      });
      (function ringLoop() {
        rx += (tx - rx) * 0.16;
        ry += (ty - ry) * 0.16;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(ringLoop);
      })();
      const HOVER_SEL = 'a, button, .tilt, .lang-toggle, .tag';
      document.addEventListener('mouseover', e => {
        if (e.target.closest && e.target.closest(HOVER_SEL)) ring.classList.add('hovering');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest && e.target.closest(HOVER_SEL)) ring.classList.remove('hovering');
      });
      document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
      document.addEventListener('mouseenter', () => shown && document.body.classList.add('cursor-on'));
    }
  }

  /* ═══════════ NAV ═══════════ */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');

  const burgerLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = !burger.classList.contains('open');
      burger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    burgerLinks.forEach(a => a.addEventListener('click', closeMenu));
  }

  /* scrollspy */
  const spyLinks = document.querySelectorAll('.nav-link');
  const spyMap = new Map();
  spyLinks.forEach(l => spyMap.set(l.getAttribute('href').slice(1), l));
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver(es => {
      es.forEach(en => {
        if (en.isIntersecting) {
          spyLinks.forEach(l => l.classList.remove('active'));
          const l = spyMap.get(en.target.id);
          if (l) l.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyMap.forEach((_, id) => {
      const sec = document.getElementById(id);
      if (sec) sio.observe(sec);
    });
  }

  /* scroll state: navbar bg · progress bar · back-to-top */
  const progress = document.getElementById('scroll-progress');
  const backTop = document.getElementById('back-top');
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 24);
      if (backTop) backTop.classList.toggle('show', y > 640);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
      scrollTicking = false;
    });
  }, { passive: true });

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ═══════════ HERO TITLE SPLIT (letters EN / words FA) ═══════════ */
  function splitTitle() {
    const h = document.querySelector('.hero-title');
    if (!h) return;
    const txt = h.textContent.replace(/\s+/g, ' ').trim();
    h.textContent = '';
    let i = 0;
    const put = (t, cls) => {
      const s = document.createElement('span');
      s.className = cls;
      s.style.setProperty('--i', i++);
      s.textContent = t;
      h.appendChild(s);
    };
    const words = txt.split(' ');
    words.forEach((w, ix) => {
      if (CURRENT_LANG === 'fa') {
        put(w, 'w');
      } else {
        for (const c of w) put(c, 'chr');
      }
      if (ix < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  }

  /* ═══════════ SCRAMBLE DECODE — section paths ═══════════ */
  (function initScramble() {
    const els = document.querySelectorAll('.section-path');
    els.forEach(el => { el.dataset.final = el.textContent; });
    if (REDUCE || !('IntersectionObserver' in window)) return;
    const POOL = '!<>-_\\/[]{}—=+*^?#$01';
    const io = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(el => io.observe(el));
    function run(el) {
      const fin = el.dataset.final;
      const total = Math.max(16, Math.round(fin.length * 1.5));
      let frame = 0;
      (function step() {
        frame++;
        const p = frame / total;
        let out = '';
        for (let k = 0; k < fin.length; k++) {
          out += k < p * fin.length ? fin[k]
               : fin[k] === ' ' ? ' '
               : POOL[(Math.random() * POOL.length) | 0];
        }
        el.textContent = out;
        if (frame < total) requestAnimationFrame(step);
        else el.textContent = fin;
      })();
    }
  })();

  /* ═══════════ HERO PARALLAX + MOUSE TILT ═══════════ */
  const heroInner = document.querySelector('.hero-inner');
  const heroPhoto = document.querySelector('.hero-photo');
  const heroText = document.querySelector('.hero-text');
  const heroSec = document.querySelector('.hero');

  /* extend the existing scroll handler via a second rAF-throttled listener */
  let parallaxTick = false;
  window.addEventListener('scroll', () => {
    if (parallaxTick) return;
    parallaxTick = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.3 && heroInner) {
        const sp = Math.min(y / window.innerHeight, 1);
        heroInner.style.transform = `translateY(${(sp * 70).toFixed(1)}px)`;
        heroInner.style.opacity = (1 - sp * 0.85).toFixed(2);
        if (heroPhoto) heroPhoto.style.setProperty('--pfy', (sp * 90).toFixed(1) + 'px');
      }
      parallaxTick = false;
    });
  }, { passive: true });

  if (FINE_POINTER && !REDUCE && heroSec && heroText) {
    heroSec.addEventListener('pointermove', e => {
      const r = heroSec.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      heroText.style.setProperty('--try', (nx * 3).toFixed(2) + 'deg');
      heroText.style.setProperty('--trx', (-ny * 2.4).toFixed(2) + 'deg');
    });
    heroSec.addEventListener('pointerleave', () => {
      heroText.style.setProperty('--try', '0deg');
      heroText.style.setProperty('--trx', '0deg');
    });
  }

  /* ═══════════ MARQUEE — duplicate track for seamless loop ═══════════ */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  /* ═══════════ LANGUAGE ═══════════ */
  let saved = 'en';
  try { saved = localStorage.getItem('resume-lang') || 'en'; } catch (e) { /* private mode */ }
  if (saved !== 'fa' && saved !== 'en') saved = 'en';
  applyLanguage(saved);
  splitTitle();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => {
    applyLanguage(CURRENT_LANG === 'fa' ? 'en' : 'fa');
  });

  window.__onLanguageChange = function () {
    startTyping();
    window.__refreshCounters();
    splitTitle();
  };
})();
