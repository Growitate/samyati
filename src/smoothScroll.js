import Lenis from '@studio-freight/lenis';

let lenisInstance = null;
let rafId = null;
let anchorClickListener = null;

/**
 * Exponential ease-out curve as configured:
 * (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
 */
const exponentialEaseOut = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Initializes Lenis globally so it applies site-wide with exact config values.
 */
export function initSmoothScroll() {
  // Clean up existing instance if re-initializing to avoid duplicate listeners
  destroySmoothScroll();

  // 1. Initialize Lenis globally with requested config
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: exponentialEaseOut,
    smoothWheel: true,
    smoothTouch: false, // keep native scroll on mobile
    touchMultiplier: 2,
  });

  // 2. Drive Lenis with requestAnimationFrame synced with browser paint cycle
  function raf(time) {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }

  rafId = requestAnimationFrame(raf);

  // 3. Update in-page anchor links to use Lenis's scrollTo() method
  anchorClickListener = (e) => {
    const anchor = e.target.closest('a[href^="#"], [data-scroll-to]');
    if (!anchor) return;

    let target = null;
    const href = anchor.getAttribute('href');
    const dataTarget = anchor.getAttribute('data-scroll-to');

    if (dataTarget) {
      target = dataTarget;
    } else if (href && href.startsWith('#')) {
      if (href === '#') {
        target = 0; // Scroll to top
      } else {
        target = href;
      }
    }

    if (target !== null) {
      if (typeof target === 'string' && target.startsWith('#')) {
        const targetEl = document.querySelector(target);
        if (!targetEl) return;
      }

      e.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(target, { offset: -80 });
      } else {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  document.addEventListener('click', anchorClickListener);

  return destroySmoothScroll;
}

/**
 * Returns active Lenis instance
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * Programmatically scroll to a target using Lenis scrollTo method.
 * @param {number|string|HTMLElement} target
 * @param {Object} options
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: options.offset !== undefined ? options.offset : 0,
      immediate: options.immediate || false,
      duration: options.duration,
      easing: options.easing,
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: options.immediate ? 'auto' : 'smooth',
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' });
    }
  }
}

/**
 * Destroys the Lenis instance and cleans up RAF loop and listeners on unmount/route change.
 */
export function destroySmoothScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (anchorClickListener) {
    document.removeEventListener('click', anchorClickListener);
    anchorClickListener = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
