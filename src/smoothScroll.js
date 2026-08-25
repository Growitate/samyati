/**
 * Lightweight smooth-scroll polyfill for low-CPU / low-end devices.
 * Uses requestAnimationFrame with an ease-out curve.
 * Falls back to native scroll-behavior:smooth on capable browsers.
 */

const DURATION = 500; // ms — fast enough to feel snappy, slow enough to feel smooth

function easeOutQuad(t) {
  return t * (2 - t);
}

function smoothScrollTo(targetY) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (diff === 0) return;

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const ease = easeOutQuad(progress);
    window.scrollTo(0, startY + diff * ease);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * Intercepts all anchor (#hash) clicks and applies our smooth scroll.
 * Works on any device regardless of CSS scroll-behavior support.
 */
export function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - 80; // 80px navbar offset
    smoothScrollTo(targetY);
  }, { passive: true });
}
