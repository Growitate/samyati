/**
 * Reusable 3D Tilt & Cursor Spotlight utility for interactive cards.
 */

/**
 * Handles mouse movement over a card to calculate 3D tilt angles & mouse spotlight coordinates.
 * @param {React.MouseEvent|MouseEvent} e 
 * @param {number} maxTilt - Maximum tilt angle in degrees (default: 8)
 */
export function handleCardMouseMove(e, maxTilt = 8) {
  const card = e.currentTarget;
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Calculate tilt in degrees
  const rotateX = ((centerY - y) / centerY) * maxTilt;
  const rotateY = ((x - centerX) / centerX) * maxTilt;

  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
}

/**
 * Resets 3D tilt transformation when mouse leaves the card.
 * @param {React.MouseEvent|MouseEvent} e 
 */
export function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  if (!card) return;

  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
}
