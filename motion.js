/* ─── MOTION.JS — Display AI ─────────────────── */

// ── YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// ── GRAIN CANVAS
(function() {
  const canvas = document.getElementById('grain');
  const ctx = canvas.getContext('2d');
  let frame = 0;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function render() {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    frame++;
    if (frame % 3 === 0) requestAnimationFrame(render);
    else requestAnimationFrame(render);
  }
  resize();
  window.addEventListener('resize', resize);
  render();
})();

// ── LOADER
(function() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const count = document.getElementById('loaderCount');
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 4 + 1;
    if (p >= 100) { p = 100; clearInterval(interval); done(); }
    fill.style.width = p + '%';
    count.textContent = String(Math.floor(p)).padStart(3, '0');
  }, 30);
  function done() {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 700);
      triggerHeroReveal();
    }, 200);
  }
})();

// ── HERO REVEAL
function triggerHeroReveal() {
  const img = document.querySelector('.hero-img');
  if (img) img.classList.add('loaded');
  document.querySelectorAll('.rw, .ri').forEach(el => {
    if (el.closest('#hero')) el.classList.add('visible');
  });
  // Trigger counters after hero visible
  setTimeout(startCounters, 1000);
}

// ── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── BURGER
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── INTERSECTION OBSERVER (reveal)
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.ri, .rw').forEach(el => {
  if (!el.closest('#hero')) revealObs.observe(el);
});

// ── COUNTERS
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

function startCounters() {
  document.querySelectorAll('.counter').forEach(el => animateCounter(el));
}

// Also trigger counters when hero stats come into view (fallback)
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      startCounters();
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

// ── CUSTOM CURSOR (desktop only)
if (window.matchMedia('(pointer: fine)').matches) {
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function raf() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    requestAnimationFrame(raf);
  })();
  const hovers = document.querySelectorAll('a, button, .pain-card, .bento-card, .pricing-card, .quote-card');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ── CTA MAGNETIC
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.cta-mag').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.25;
      const dy = (e.clientY - r.top - r.height / 2) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ── PARALLAX HERO
window.addEventListener('scroll', () => {
  const img = document.querySelector('.hero-img');
  if (!img) return;
  const y = window.scrollY;
  img.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
}, { passive: true });

// ── DRAG SCROLL (quotes rail)
const rail = document.getElementById('quotesRail');
if (rail) {
  let isDown = false, startX, scrollLeft;
  rail.addEventListener('mousedown', e => {
    isDown = true; rail.classList.add('dragging');
    startX = e.pageX - rail.offsetLeft; scrollLeft = rail.scrollLeft;
  });
  rail.addEventListener('mouseleave', () => { isDown = false; rail.classList.remove('dragging'); });
  rail.addEventListener('mouseup', () => { isDown = false; rail.classList.remove('dragging'); });
  rail.addEventListener('mousemove', e => {
    if (!isDown) return; e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    rail.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ── FORM SUBMIT
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    let valid = true;
    inputs.forEach(i => { if (!i.value.trim()) { i.style.borderColor = 'rgba(239,68,68,0.6)'; valid = false; } else i.style.borderColor = ''; });
    if (valid) {
      submitBtn.textContent = '✓ Richiesta inviata — ti contatteremo entro 48h';
      submitBtn.style.background = '#059669';
      submitBtn.disabled = true;
    }
  });
}
