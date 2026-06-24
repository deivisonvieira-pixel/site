// ════════ ENGAGE — comportamento compartilhado ════════
document.documentElement.classList.add('js'); // enables reveal animations; absence keeps content visible
(function () {
  // mobile menu
  var menu = document.querySelector('.mobile-menu');
  document.querySelectorAll('[data-menu-open]').forEach(function (b) {
    b.addEventListener('click', function () { if (menu) menu.classList.add('open'); });
  });
  document.querySelectorAll('[data-menu-close]').forEach(function (b) {
    b.addEventListener('click', function () { if (menu) menu.classList.remove('open'); });
  });
  if (menu) menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });

  // scroll-aware fixed nav: transparent over dark hero, translucent light when scrolled
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // reveal on scroll (robust: ends visible even if transitions are throttled)
  var reveal = function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  };
  requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  window.addEventListener('load', reveal);
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal);
  window.__engageReveal = reveal; // expose for dynamically-added content
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < (window.innerHeight || 0)) el.classList.add('in');
    });
  }, 1400);
})();
