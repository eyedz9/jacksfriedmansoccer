/* Jackson Friedman — site behavior. No dependencies. */
(function () {
  'use strict';

  /* ---- sticky header state ---- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile nav ---- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    mobileNav.hidden = !open;
  });

  mobileNav.addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') return;
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  });

  /* ---- scroll spy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- video: thumbnail facade -> real iframe on click ----
     Keeps 7 YouTube embeds off the critical path. The page loads
     as images; the player only mounts when a coach asks for it. */
  function mountPlayer(facade) {
    var id = facade.getAttribute('data-yt');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = facade.getAttribute('aria-label') || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    // The iframe covers the facade rather than replacing it, so switching
    // clips can tear the player down and reveal the thumbnail again.
    facade.parentNode.appendChild(iframe);
  }

  document.querySelectorAll('.yt-facade').forEach(function (facade) {
    facade.addEventListener('click', function () { mountPlayer(facade); });
  });

  /* ---- multi-video galleries: buttons switch which clip is staged ----
     Pairing is positional (button N -> item N), so buttons and stage
     items must stay in matching source order. */
  document.querySelectorAll('.video-gallery').forEach(function (gallery) {
    var buttons = gallery.querySelectorAll('.video-btn');
    if (!buttons.length) return;

    var stage = gallery.querySelector('.video-stage');

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        // tear down any mounted player so switching clips stops playback
        var live = stage.querySelector('iframe');
        if (live) live.remove();

        var items = stage.querySelectorAll('.yt-facade');
        items.forEach(function (item, i) { item.classList.toggle('active', i === index); });

        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      });
    });
  });
})();
