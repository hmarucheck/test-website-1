/* Veyloro — small, dependency-free progressive enhancement. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header shadow ------------------------------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile navigation ---------------------------------------------------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* Scroll reveals ------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var delay = Math.min(i * 70, 280);
        setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Count-up stats ------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var format = function (value, target) {
      if (target >= 1000) return value.toLocaleString('en-US');
      return String(value);
    };
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var duration = 1400;
        var tick = function (now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(Math.round(target * eased), target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* Newsletter form (front-end only — nothing is transmitted) ------------- */
  var form = document.querySelector('[data-signup]');
  if (form) {
    var note = form.querySelector('[data-signup-note]');
    var input = form.querySelector('input[type="email"]');
    var defaultNote = note ? note.innerHTML : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = input.value.trim() !== '' && /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(input.value.trim());
      input.setAttribute('aria-invalid', String(!valid));
      if (!note) return;
      if (!valid) {
        note.classList.remove('is-success');
        note.textContent = 'That email doesn’t look right — mind checking it?';
        input.focus();
        return;
      }
      note.classList.add('is-success');
      note.textContent = 'You’re on the list. Look for eight new shops on Thursday.';
      form.reset();
      setTimeout(function () {
        note.classList.remove('is-success');
        note.innerHTML = defaultNote;
      }, 8000);
    });
    input.addEventListener('input', function () { input.removeAttribute('aria-invalid'); });
  }

  /* Footer year ---------------------------------------------------------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
