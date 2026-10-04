/* Shared navigation behaviour: hamburger, scrolled state, smooth anchors, scroll-spy */
(function () {
  var nav = document.getElementById('siteNav');
  if (!nav) return;

  var toggle = nav.querySelector('.site-nav__toggle');
  var menu = document.getElementById('navMenu');
  var mq = window.matchMedia('(max-width: 900px)');
  var root = document.documentElement;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    root.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  var onChange = function () { if (!mq.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else mq.addListener(onChange);

  /* solid background once the page is scrolled */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
      spy();
      ticking = false;
    });
  }

  /* in-page anchors: smooth scroll + close the mobile menu */
  function scrollToHash(hash, smooth) {
    var el = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (!el) return false;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    return true;
  }

  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (nav.classList.contains('is-open')) setOpen(false);
    if (href.charAt(0) === '#' && scrollToHash(href, true)) {
      e.preventDefault();
      if (history.replaceState) history.replaceState(null, '', href);
    }
  });

  /* scroll-spy — only active on the home page, where links carry data-spy */
  var spyLinks = [].slice.call(nav.querySelectorAll('[data-spy]'));
  function spy() {
    if (!spyLinks.length) return;
    var line = window.innerHeight * 0.4, current = null;
    spyLinks.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('data-spy'));
      if (el && el.getBoundingClientRect().top <= line) current = a;
    });
    spyLinks.forEach(function (a) { a.classList.toggle('is-active', a === current); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* arriving from another page with #about etc: re-align after animations set up the layout */
  if (location.hash) {
    window.addEventListener('load', function () {
      setTimeout(function () { scrollToHash(location.hash, false); }, 350);
    });
  }
})();
