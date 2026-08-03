/* Progressive enhancement only — the page is fully readable without this. */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Theme toggle ----------------------------------------------------- */

  var toggle = document.getElementById('theme-toggle');

  function syncToggleLabel() {
    if (!toggle) return;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  syncToggleLabel();

  if (toggle) {
    toggle.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      syncToggleLabel();
    });
  }

  // Follow the OS until the visitor picks a side.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (stored) return;
    root.dataset.theme = e.matches ? 'light' : 'dark';
    syncToggleLabel();
  });

  /* --- Header border on scroll ------------------------------------------ */

  var header = document.querySelector('.site-header');
  var ticking = false;

  function updateHeader() {
    header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    ticking = false;
  }

  if (header) {
    updateHeader();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }, { passive: true });
  }

  /* --- Reveal on scroll -------------------------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Stagger siblings entering together so groups cascade rather than pop.
        entry.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* --- Footer year ------------------------------------------------------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
