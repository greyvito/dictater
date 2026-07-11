/** @param {boolean} active */
export function applyPrekTheme(active) {
  document.body.classList.toggle('prek-mode', active);
  const hero = document.querySelector('.site-hero');
  if (hero) hero.classList.toggle('prek-hero', active);
}
