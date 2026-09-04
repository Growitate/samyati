/**
 * Smooth Section Scroll & Load Reveal Utility.
 * Watches sections across the site and triggers smooth slide-up + fade-in animations on load and scroll.
 */

let observerInstance = null;
let mutationObserverInstance = null;

export function initScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {};

  // Clean up any existing observer instances
  if (observerInstance) observerInstance.disconnect();
  if (mutationObserverInstance) mutationObserverInstance.disconnect();

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.05,
  };

  observerInstance = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Once revealed, keep revealed
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const scanAndObserve = () => {
    const targets = document.querySelectorAll(
      'section, .reveal-section, .contact-channels-grid, .contact-form-card, .contact-faq-section'
    );

    targets.forEach((target) => {
      if (!target.classList.contains('reveal-init')) {
        target.classList.add('reveal-init');

        const rect = target.getBoundingClientRect();
        // If section is in current viewport on load, reveal smoothly
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          requestAnimationFrame(() => {
            target.classList.add('is-revealed');
          });
        }
      }
      observerInstance.observe(target);
    });
  };

  // Initial scan
  scanAndObserve();

  // Observe DOM changes for SPA view switching
  mutationObserverInstance = new MutationObserver(() => {
    scanAndObserve();
  });

  mutationObserverInstance.observe(document.body, { childList: true, subtree: true });

  return () => {
    if (observerInstance) observerInstance.disconnect();
    if (mutationObserverInstance) mutationObserverInstance.disconnect();
  };
}
