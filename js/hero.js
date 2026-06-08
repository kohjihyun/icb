/* ================================================================
   Hero — text reveal on load + GNB hover sub-panel
================================================================ */
(function () {
  /* ---- Title reveal on load ---- */
  const titleWrap = document.querySelector('.hero-title-wrap');
  if (titleWrap) {
    const reveal = () => titleWrap.classList.add('is-visible');
    if (document.readyState === 'complete') {
      requestAnimationFrame(reveal);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(reveal), { once: true });
    }
  }

  /* ---- GNB hover sub-panel ---- */
  const gnbWrap = document.querySelector('.hero-gnb-wrap');
  if (!gnbWrap) return;

  const items = gnbWrap.querySelectorAll('.hero-gnb__menu-item[data-menu]');
  const subs  = gnbWrap.querySelectorAll('.hero-gnb__sub[data-sub]');

  let closeTimer = null;
  const CLOSE_DELAY = 120;

  const open = (key) => {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    gnbWrap.setAttribute('data-active', key);
    subs.forEach((s) => {
      s.setAttribute('aria-hidden', s.getAttribute('data-sub') === key ? 'false' : 'true');
    });
  };

  const close = () => {
    gnbWrap.removeAttribute('data-active');
    subs.forEach((s) => s.setAttribute('aria-hidden', 'true'));
  };

  const scheduleClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  };

  /* Hover on primary menu items */
  items.forEach((item) => {
    const key = item.getAttribute('data-menu');
    item.addEventListener('mouseenter', () => open(key));
    item.addEventListener('focus',      () => open(key));
  });

  /* Keep open while pointer is over a sub-panel */
  subs.forEach((sub) => {
    sub.addEventListener('mouseenter', () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    });
    sub.addEventListener('mouseleave', scheduleClose);
  });

  /* Schedule close when leaving the whole GNB wrap */
  gnbWrap.addEventListener('mouseleave', scheduleClose);

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
