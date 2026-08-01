/*
 * Global Founder Atlas: shared page behaviour + ambient hero canvas.
 * Progressive enhancement only; every page is complete without this file.
 * Pattern inherited from the grain-by-grain / infinity-engine cinematic family.
 */
(() => {
  document.documentElement.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll + kintsugi seams ----------
     Deliberately NOT IntersectionObserver. Content visibility must never
     depend on an observer callback arriving: browsers throttle or delay IO
     in background tabs, prerendered pages and low-power modes, and the old
     version also used a fractional threshold that a block taller than the
     viewport could never meet, leaving whole sections at opacity 0 forever.
     A plain geometry sweep on scroll/resize gives the same staggered effect
     with nothing that can strand content. The scan hooks stay, so pages that
     inject cards (the atlas filters) still fade them in. */
  const pending = new Set();
  const show = (el) => el.classList.add(el.classList.contains('kintsugi-seam') ? 'is-drawn' : 'is-visible');
  const sweep = () => {
    if (!pending.size) { return; }
    /* Only the top edge is tested, so anything scrolled past stays revealed:
       an anchor jump or a restored scroll position cannot skip a block. */
    const line = window.innerHeight * 0.92;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < line) { show(el); pending.delete(el); }
    });
  };
  const collect = (root, selector) => {
    [...root.querySelectorAll(selector)].forEach((el) => {
      if (reduced) { show(el); } else { pending.add(el); }
    });
    sweep();
  };
  const scanReveals = (root = document) => collect(root, '.reveal:not(.is-visible)');
  const scanSeams = (root = document) => collect(root, '.kintsugi-seam:not(.is-drawn)');
  window.gfaScanReveals = scanReveals;
  window.gfaScanSeams = scanSeams;
  scanReveals();
  scanSeams();
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep, { passive: true });
  window.addEventListener('load', sweep);
  /* Late-layout safety net (fonts/images shifting geometry after first paint). */
  setTimeout(sweep, 400);
  setTimeout(sweep, 1500);

  /* ---------- Mark current page in nav (runs after app.js injects the header) ---------- */
  const markNav = () => {
    const here = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.site-nav a').forEach((link) => {
      if (link.getAttribute('href') === here) {
        link.setAttribute('aria-current', 'page');
        const menu = link.closest('.nav-menu');
        if (menu) { const s = menu.querySelector('summary'); if (s) s.setAttribute('data-active', ''); }
      }
    });
  };
  window.gfaMarkNav = markNav;
  markNav();

  /* ---------- To-top ---------- */
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<span aria-hidden="true">&uarr;</span>';
  document.body.appendChild(toTop);
  const toggleTop = () => toTop.classList.toggle('is-visible', window.scrollY > 640);
  toggleTop();
  window.addEventListener('scroll', toggleTop, { passive: true });
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const target = document.getElementById('main') || document.body;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Condensing header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-condensed', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Ambient hero canvas: drifting motes (gold / teal / violet) ---------- */
  const canvas = document.querySelector('[data-sand-canvas]');
  if (!canvas || !canvas.getContext) { return; }
  const ctx = canvas.getContext('2d');
  const GOLD = [255, 207, 110], BAY = [43, 227, 194], DUSK = [177, 151, 252];
  let w = 0, h = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const COUNT = 150;
  const motes = [];
  let seed = 11;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < COUNT; i++) {
    const tint = rand();
    motes.push({
      x: rand(), y: rand(),
      r: 0.6 + rand() * 1.6,
      speed: 0.00012 + rand() * 0.0004,
      sway: 0.4 + rand() * 1.3,
      phase: rand() * Math.PI * 2,
      col: tint < 0.6 ? GOLD : (tint < 0.85 ? BAY : DUSK),
      alpha: 0.12 + rand() * 0.45,
    });
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    motes.forEach((g) => {
      const gx = ((g.x - t * g.speed) % 1 + 1) % 1;
      const drift = Math.sin(t * 0.0011 * g.sway + g.phase) * 0.014;
      const gy = Math.min(0.99, g.y + drift);
      const [r, gr, b] = g.col;
      ctx.globalAlpha = g.alpha * (0.5 + 0.5 * Math.sin(t * 0.002 + g.phase));
      ctx.fillStyle = `rgb(${r}, ${gr}, ${b})`;
      ctx.beginPath();
      ctx.arc(gx * w, gy * h, g.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  let t = 300;
  frame(t);
  if (reduced) { return; }
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0] ? entries[0].isIntersecting : true; }).observe(canvas);
  }
  window.addEventListener('resize', () => { resize(); frame(t); }, { passive: true });
  const loop = () => {
    requestAnimationFrame(loop);
    if (!visible) { return; }
    if (canvas.clientWidth !== w || canvas.clientHeight !== h) { resize(); }
    t += 1;
    frame(t);
  };
  requestAnimationFrame(loop);
})();
