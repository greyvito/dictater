/** @type {HTMLElement | null} */
let modalMask = null;

/** @type {HTMLElement | null} */
let lastFocus = null;

/** @type {string | null} */
let openSelector = null;

function onModalKeydown(e) {
  if (e.key === 'Escape' && openSelector) {
    closeModal(openSelector);
    return;
  }
  if (e.key !== 'Tab' || !openSelector) return;
  const modal = document.querySelector(openSelector);
  if (!modal) return;
  const focusable = [...modal.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((el) => el.offsetParent !== null);
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

function ensureMask() {
  if (modalMask) return modalMask;
  modalMask = document.createElement('div');
  modalMask.className = 'modal-open-mask hidden';
  modalMask.addEventListener('click', () => {
    if (openSelector) closeModal(openSelector);
  });
  document.body.appendChild(modalMask);
  return modalMask;
}

/**
 * @param {string} selector
 */
export function openModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal) return;

  if (openSelector && openSelector !== selector) {
    closeModal(openSelector, { restoreFocus: false });
  }

  lastFocus = /** @type {HTMLElement | null} */ (document.activeElement);
  openSelector = selector;

  const mask = ensureMask();
  mask.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-modal', 'true');

  const focusable = modal.querySelector(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );
  (/** @type {HTMLElement | null} */ (focusable))?.focus();

  document.addEventListener('keydown', onModalKeydown);
  document.body.classList.add('modal-open');
}

/**
 * @param {string} selector
 * @param {{ restoreFocus?: boolean }} [opts]
 */
export function closeModal(selector, opts = {}) {
  const { restoreFocus = true } = opts;
  const modal = document.querySelector(selector);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.removeAttribute('aria-modal');

  if (openSelector === selector) openSelector = null;

  const anyOpen = document.querySelector('[role="dialog"]:not(.hidden), .settings-dropdown:not(.hidden)');
  if (!anyOpen) {
    modalMask?.classList.add('hidden');
    document.removeEventListener('keydown', onModalKeydown);
    document.body.classList.remove('modal-open');
  }

  if (restoreFocus && lastFocus?.focus) {
    lastFocus.focus();
    lastFocus = null;
  }
}

export function toggleModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal) return;
  if (modal.classList.contains('hidden')) openModal(selector);
  else closeModal(selector);
}
