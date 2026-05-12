const PROJECTS = window.PROJECTS || [];

let activeProjectId = null;
let activeMediaItems = [];
let activeMediaIndex = 0;
let lastMediaTrigger = null;
let modalTouchStartX = 0;
let modalTouchStartY = 0;

function openProject(id, updateHistory = true) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  activeProjectId = id;
  if (updateHistory) history.pushState({ projectId: id }, '', '#' + id);
  renderModal(p);
  const modalWrap = document.getElementById('modalWrap');
  const modal = document.getElementById('modal');
  document.body.classList.remove('cursor-hover', 'cursor-project', 'cursor-click');
  modalWrap.classList.add('active');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeProject(updateHistory = true) {
  closeMediaViewer({ restoreFocus: false });
  const modalWrap = document.getElementById('modalWrap');
  if (!modalWrap.classList.contains('active')) return;
  modalWrap.classList.remove('active');
  document.body.style.overflow = '';
  activeProjectId = null;
  if (updateHistory) history.pushState({}, '', `${window.location.pathname}${window.location.search}`);
}

function handleProjectBackdropClick(event) {
  if (isMediaViewerOpen()) return;
  if (!event.target.closest('.modal, .modal-controls')) {
    closeProject();
  }
}

function isProjectModalOpen() {
  return document.getElementById('modalWrap').classList.contains('active');
}

function navigateProject(direction) {
  if (isMediaViewerOpen()) {
    navigateMedia(direction);
    return;
  }
  if (!isProjectModalOpen() || PROJECTS.length < 2) return;
  const currentIndex = PROJECTS.findIndex(p => p.id === activeProjectId);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + PROJECTS.length) % PROJECTS.length;
  openProject(PROJECTS[nextIndex].id);
}

function renderModal(p) {
  document.getElementById('modalTitleSm').textContent = p.title;
  const projectIndex = PROJECTS.findIndex(x => x.id === p.id);
  const current = String(projectIndex + 1).padStart(2, '0');
  const total = String(PROJECTS.length).padStart(2, '0');
  document.getElementById('modalCount').textContent = `${current} / ${total}`;
  const mediaItems = getProjectMedia(p);
  activeMediaItems = mediaItems;
  const mediaHTML = mediaItems.length
    ? `<div class="media-board">${mediaItems.map((item, i) => `
        <button class="media-tile" data-media-index="${i}" aria-label="${escapeHTML(`Открыть ${item.label}`)}">
          <img src="${escapeHTML(item.thumb)}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}">
          <span class="media-chip">${String(i + 1).padStart(2, '0')} · ${item.kind === 'video' ? 'Видео' : 'Изображение'}</span>
          ${item.kind === 'video' ? '<span class="media-play">▶</span>' : ''}
        </button>`).join('')}</div>`
    : '<div class="media-empty">Материалы скоро появятся</div>';
  document.getElementById('modalBody').innerHTML = `
    <div class="gallery">
      ${mediaHTML}
    </div>
    <div class="text-blocks">
      ${p.goal ? `<div class="text-block"><div class="text-block-label">Задача</div><p>${formatRichText(p.goal)}</p></div>` : ''}
      ${p.idea ? `<div class="text-block"><div class="text-block-label">Идея</div><p>${formatRichText(p.idea)}</p></div>` : ''}
      ${p.execution ? `<div class="text-block"><div class="text-block-label">Что сделали</div><p>${formatRichText(p.execution)}</p></div>` : ''}
      ${p.result ? `<div class="text-block"><div class="text-block-label">Результат</div><p>${formatRichText(p.result)}</p></div>` : ''}
      <div class="text-block text-block-role"><div class="text-block-label">Роль</div><p>${formatRichText(p.role)}</p></div>
    </div>`;
}

function posterFor(src) {
  return src.replace(/\.mp4$/i, '_poster.jpg');
}

// Insert paragraph breaks before numbered list markers ("1. ", "2. ", ...)
// so multi-item briefs read as a list rather than one long blob.
function formatRichText(text) {
  if (!text) return '';
  return text.replace(/(\S)\s+(\d+\.\s)/g, '$1<br><br>$2');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function getProjectMedia(p) {
  const videos = (p.videos || (p.video ? [p.video] : [])).map((src, i) => ({
    kind: 'video',
    src,
    thumb: posterFor(src),
    label: `${p.title}, видео ${i + 1}`,
  }));
  const images = (p.images || []).map((src, i) => ({
    kind: 'image',
    src,
    thumb: src,
    label: `${p.title}, изображение ${i + 1}`,
  }));
  return [...videos, ...images];
}

function isMediaViewerOpen() {
  return document.getElementById('mediaViewer').classList.contains('active');
}

function openMediaViewer(index) {
  if (!activeMediaItems.length) return;
  lastMediaTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  activeMediaIndex = Math.max(0, Math.min(index, activeMediaItems.length - 1));
  renderMediaViewer();
  const viewer = document.getElementById('mediaViewer');
  viewer.classList.add('active');
  viewer.setAttribute('aria-hidden', 'false');
  document.querySelector('.media-viewer-close').focus();
}

function closeMediaViewer({ restoreFocus = true } = {}) {
  const viewer = document.getElementById('mediaViewer');
  if (!viewer.classList.contains('active')) return;
  viewer.classList.remove('active');
  viewer.setAttribute('aria-hidden', 'true');
  document.getElementById('mediaViewerStage').innerHTML = '';
  if (restoreFocus && lastMediaTrigger && document.contains(lastMediaTrigger)) {
    lastMediaTrigger.focus();
  }
  lastMediaTrigger = null;
}

function handleMediaViewerBackdropClick(event) {
  if (!event.target.closest('.media-viewer-stage img, .media-viewer-stage video, .media-viewer-top, .media-viewer-bottom')) {
    closeMediaViewer();
  }
}

function navigateMedia(direction) {
  if (!isMediaViewerOpen() || activeMediaItems.length < 2) return;
  activeMediaIndex = (activeMediaIndex + direction + activeMediaItems.length) % activeMediaItems.length;
  renderMediaViewer();
}

function renderMediaViewer() {
  const item = activeMediaItems[activeMediaIndex];
  if (!item) return;
  document.getElementById('mediaViewerTitle').textContent = PROJECTS.find(p => p.id === activeProjectId)?.title || '';
  document.getElementById('mediaViewerType').textContent = item.kind === 'video' ? 'Видео' : 'Изображение';
  document.getElementById('mediaViewerCount').textContent = `${String(activeMediaIndex + 1).padStart(2, '0')} / ${String(activeMediaItems.length).padStart(2, '0')}`;
  document.getElementById('mediaViewerStage').innerHTML = item.kind === 'video'
    ? `<video controls autoplay playsinline poster="${escapeHTML(item.thumb)}" aria-label="${escapeHTML(item.label)}"><source src="${escapeHTML(item.src)}" type="video/mp4"></video>`
    : `<img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.label)}">`;
}

window.addEventListener('load', () => {
  // window.initPaletteSwitcher?.(); // hidden — re-enable to bring back the palette UI
  initAll();
  openProjectFromHash();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Tab' && isMediaViewerOpen()) {
    trapMediaViewerFocus(e);
    return;
  }
  if (e.key === 'Escape') {
    if (isMediaViewerOpen()) closeMediaViewer();
    else closeProject();
  }
  if (e.key === 'ArrowLeft') {
    if (isMediaViewerOpen()) navigateMedia(-1);
    else navigateProject(-1);
  }
  if (e.key === 'ArrowRight') {
    if (isMediaViewerOpen()) navigateMedia(1);
    else navigateProject(1);
  }
});

function trapMediaViewerFocus(e) {
  const viewer = document.getElementById('mediaViewer');
  const focusable = [...viewer.querySelectorAll('button, video[controls], [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!focusable.length) {
    viewer.focus();
    e.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
}
function openProjectFromHash() {
  const id = location.hash.slice(1);
  if (id && PROJECTS.find(p => p.id === id)) {
    openProject(id, false);
  } else {
    closeProject(false);
  }
}

window.addEventListener('popstate', openProjectFromHash);

function smoothScroll(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
}

function initAll() {
  initInteractions();
  initActiveNav();
  initCursor();
  initTilt();
  initScrollReveal();
  initCoverVideos();
  initDragScroll();
  initStripProgress();
  initBadgeSway();
}

function initInteractions() {
  document.querySelectorAll('[data-scroll-target]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setActiveNav(link.dataset.scrollTarget);
      smoothScroll(link.dataset.scrollTarget);
    });
  });

  document.querySelectorAll('.project-card[data-id]').forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.id));
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openProject(card.dataset.id);
    });
  });

  document.querySelectorAll('[data-project-nav]').forEach(button => {
    button.addEventListener('click', () => navigateProject(Number(button.dataset.projectNav)));
  });

  document.querySelector('[data-close-project]')?.addEventListener('click', () => closeProject());
  document.querySelector('[data-close-media]')?.addEventListener('click', () => closeMediaViewer());

  document.querySelectorAll('[data-media-nav]').forEach(button => {
    button.addEventListener('click', () => navigateMedia(Number(button.dataset.mediaNav)));
  });

  document.getElementById('modalWrap')?.addEventListener('click', handleProjectBackdropClick);
  document.getElementById('mediaViewer')?.addEventListener('click', handleMediaViewerBackdropClick);
  document.getElementById('modalBody')?.addEventListener('click', event => {
    const mediaTile = event.target.closest('[data-media-index]');
    if (mediaTile) openMediaViewer(Number(mediaTile.dataset.mediaIndex));
  });

  const modal = document.getElementById('modal');
  modal?.addEventListener('touchstart', e => {
    if (e.target.closest('button')) return;
    const touch = e.changedTouches[0];
    modalTouchStartX = touch.clientX;
    modalTouchStartY = touch.clientY;
  }, { passive: true });

  modal?.addEventListener('touchend', e => {
    if (e.target.closest('button')) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - modalTouchStartX;
    const deltaY = touch.clientY - modalTouchStartY;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    navigateProject(deltaX < 0 ? 1 : -1);
  }, { passive: true });
}

function setActiveNav(id) {
  document.querySelectorAll('[data-scroll-target]').forEach(link => {
    const active = link.dataset.scrollTarget === id;
    if (active) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initActiveNav() {
  const links = [...document.querySelectorAll('[data-scroll-target]')];
  const sections = links
    .map(link => document.getElementById(link.dataset.scrollTarget))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNav(visible.target.id);
    }
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0.08, 0.2, 0.4, 0.6] });

  sections.forEach(section => observer.observe(section));
}

// ── 1. CUSTOM CURSOR ──────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const label = document.getElementById('cursor-label');
  if (!dot || !matchMedia('(pointer: fine)').matches) return;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    if (label) {
      label.style.left = e.clientX + 'px';
      label.style.top = e.clientY + 'px';
    }
  });

  const hovers = 'a, button, .project-card, #badge-wrap, .close-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hovers)) document.body.classList.add('cursor-hover');
    if (e.target.closest('.project-card')) document.body.classList.add('cursor-project');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hovers)) document.body.classList.remove('cursor-hover');
    if (e.target.closest('.project-card')) document.body.classList.remove('cursor-project');
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

// ── 2. CARD TILT ON HOVER ────────────────────────────────────
// Tilt now writes to CSS variables (--tilt-x / --tilt-y) so it composes with
// scroll-driven thumb focus, bend, and lean instead of clobbering them.
function initTilt() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.setProperty('--tilt-x', `${-y * 8}deg`);
      card.style.setProperty('--tilt-y', `${x * 8}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

// ── 3. SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── 4. COVER VIDEOS ─────────────────────────────────────────
function initCoverVideos() {
  const videos = document.querySelectorAll('.project-thumb video');
  if (!videos.length) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videos.forEach(video => video.pause());
    return;
  }

  videos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '0px', threshold: 0.25 });

  videos.forEach(video => observer.observe(video));
}

// ── 5. BADGE SWAY — smooth JS sine, lerp on hover/leave ──────
function initBadgeSway() {
  const wrap = document.getElementById('badge-wrap');
  if (!wrap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let amp   = 4,  ampT   = 4;
  let speed = 1.0, speedT = 1.0;

  let t = 0;
  let last = performance.now();

  wrap.addEventListener('mouseenter', () => { ampT = 8; speedT = 2.0; });
  wrap.addEventListener('mouseleave', () => { ampT = 4; speedT = 1.0; });

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    amp   += (ampT   - amp)   * dt * 3;
    speed += (speedT - speed) * dt * 3;

    t += speed * dt;
    // Write only the sway angle — scale lives in CSS so a media query
    // can drop it on mobile without JS branching.
    wrap.style.setProperty('--badge-sway', `${Math.sin(t) * amp}deg`);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── DRAG TO SCROLL ───────────────────────────────────────────

// Click-and-drag horizontal scroll for mouse users. No inertia — release
// stops the scroll cold. Custom rAF loops modifying scrollLeft were
// fighting native scroll input, so we keep this strictly synchronous
// with mouse events.
function initDragScroll() {
  const el = document.getElementById('strip');
  if (!el) return;
  let down = false, startX, startScrollLeft;
  el.addEventListener('mousedown', e => {
    down = true;
    el.classList.add('is-dragging');
    startX = e.pageX;
    startScrollLeft = el.scrollLeft;
  });
  el.addEventListener('mousemove', e => {
    if (!down) return;
    e.preventDefault();
    el.scrollLeft = startScrollLeft - (e.pageX - startX) * 1.4;
  });
  const release = () => {
    if (!down) return;
    down = false;
    el.classList.remove('is-dragging');
  };
  el.addEventListener('mouseup', release);
  el.addEventListener('mouseleave', release);
}

function initStripProgress() {
  const strip = document.getElementById('strip');
  const progress = document.getElementById('stripProgress');
  const rail = progress?.querySelector('.strip-progress-rail');
  const current = document.getElementById('stripCurrent');
  const total = document.getElementById('stripTotal');
  if (!strip || !progress || !rail || !current || !total) return;

  total.textContent = String(PROJECTS.length).padStart(2, '0');

  const cards = [...strip.querySelectorAll('.project-card')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerFine = matchMedia('(pointer: fine)').matches;
  let progressMarks = [];

  let progressIndex = -1;
  let activeCardIndex = -1;
  let rafId = 0;
  let pointerX = null;
  // Lean: smoothed scroll velocity expressed as a small rotateZ.
  // Reads scrollLeft only, never writes — safe alongside native scroll.
  let lastScrollLeft = strip.scrollLeft;
  let lastT = performance.now();
  let lean = 0;
  let settleTimer = 0;

  function buildProgressMarks() {
    const step = matchMedia('(max-width: 640px)').matches ? 7 : 11;
    const count = Math.max(22, Math.floor(rail.clientWidth / step));
    if (progressMarks.length === count) return;

    rail.replaceChildren();
    progressMarks = Array.from({ length: count }, (_, index) => {
      const mark = document.createElement('span');
      mark.className = 'strip-progress-mark';
      mark.style.setProperty('--mark-height', 12);
      rail.append(mark);
      return mark;
    });
  }

  function syncProgress(ratio) {
    progress.style.setProperty('--scroll-progress', ratio.toFixed(4));

    if (!progressMarks.length) return;
    const filled = ratio * progressMarks.length;
    const rampCount = 3;
    const lastMarkIndex = Math.max(progressMarks.length - 1, 1);
    progressMarks.forEach((mark, index) => {
      const markFill = Math.min(Math.max(filled - index, 0), 1);
      const phase = ((index / lastMarkIndex) * rampCount) % 1;
      const ramp = Math.sin(phase * Math.PI);
      mark.style.setProperty('--mark-fill', markFill.toFixed(3));
      mark.style.setProperty('--mark-height', (12 + markFill * ramp * 8).toFixed(2));
    });
  }

  function syncProgressVisibility() {
    const rect = strip.getBoundingClientRect();
    const isProjectStripVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    progress.classList.toggle('is-outside-projects', !isProjectStripVisible);
  }

  function update() {
    rafId = 0;

    const maxScroll = Math.max(strip.scrollWidth - strip.clientWidth, 1);
    const ratio = Math.min(Math.max(strip.scrollLeft / maxScroll, 0), 1);
    syncProgressVisibility();

    // Velocity (px/ms). Exponential smoothing keeps it from spiking from
    // a single high-delta scroll event. Clamped to ±2° for taste.
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);
    const dx = strip.scrollLeft - lastScrollLeft;
    lastScrollLeft = strip.scrollLeft;
    lastT = now;
    lean = lean * 0.7 + (dx / dt) * 0.3;
    const leanDeg = reduceMotion ? 0 : Math.max(-2, Math.min(2, lean * -0.6));
    syncProgress(ratio);

    const stripCenter = strip.scrollLeft + strip.clientWidth / 2;

    let focalIdx = -1;
    if (pointerFine && pointerX !== null) {
      let best = Infinity;
      cards.forEach((card, i) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - pointerX);
        if (d < best) { best = d; focalIdx = i; }
      });
    } else if (!pointerFine) {
      let best = Infinity;
      cards.forEach((card, i) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - stripCenter);
        if (d < best) { best = d; focalIdx = i; }
      });
    }

    let centeredIdx = 0;
    let centeredDist = Infinity;
    cards.forEach((card, i) => {
      const c = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(c - stripCenter);
      if (d < centeredDist) { centeredDist = d; centeredIdx = i; }
    });

    cards.forEach((card, i) => {
      card.style.setProperty('--card-focus', !reduceMotion && i === focalIdx ? '1' : '0');
      card.style.setProperty('--card-lean', `${leanDeg.toFixed(2)}deg`);
    });

    const nextProgressIndex = Math.min(cards.length - 1, Math.max(0, Math.round(ratio * (cards.length - 1))));
    if (nextProgressIndex !== progressIndex) {
      progressIndex = nextProgressIndex;
      current.textContent = String(progressIndex + 1).padStart(2, '0');
    }

    if (centeredIdx !== activeCardIndex) {
      activeCardIndex = centeredIdx;
      cards.forEach((card, i) => card.classList.toggle('is-active', i === activeCardIndex));
      if (!reduceMotion && !pointerFine) navigator.vibrate?.(6);
    }
  }

  function schedule() {
    if (rafId) return;
    rafId = requestAnimationFrame(update);
  }

  function onScroll() {
    schedule();
    // After scroll stops, relax lean back to 0 so cards return to upright.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      lean = 0;
      schedule();
    }, 140);
  }

  strip.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', syncProgressVisibility, { passive: true });
  window.addEventListener('resize', () => {
    buildProgressMarks();
    syncProgressVisibility();
    schedule();
  });

  if (pointerFine && !reduceMotion) {
    strip.addEventListener('mousemove', e => {
      if (strip.classList.contains('is-dragging')) return;
      const rect = strip.getBoundingClientRect();
      pointerX = e.clientX - rect.left + strip.scrollLeft;
      schedule();
    });
    strip.addEventListener('mouseleave', () => {
      pointerX = null;
      schedule();
    });
  }

  buildProgressMarks();
  syncProgressVisibility();
  update();
}
