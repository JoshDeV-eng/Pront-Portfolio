/* ==========================================================================
   Josh_Dev — Site Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // -------- Custom crosshair cursor (desktop only) --------
  var crosshair = document.getElementById('crosshair');
  if (crosshair && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var shown = false;
    window.addEventListener('mousemove', function (e) {
      crosshair.style.left = e.clientX + 'px';
      crosshair.style.top = e.clientY + 'px';
      if (!shown) { crosshair.classList.add('is-active'); shown = true; }
    }, { passive: true });
    window.addEventListener('mouseleave', function () {
      crosshair.classList.remove('is-active');
      shown = false;
    });
  }

  // -------- Footer year --------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------- Mobile nav toggle --------
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------- Skill stack (generated nodes) --------
  var skills = [
    { name: 'JavaScript / TypeScript', level: 'daily driver' },
    { name: 'Three.js / WebGL', level: 'daily driver' },
    { name: 'React / Next.js', level: 'daily driver' },
    { name: 'Node.js', level: 'proficient' },
    { name: 'GLSL Shaders', level: 'proficient' },
    { name: 'Figma API & Plugins', level: 'proficient' },
    { name: 'PostgreSQL', level: 'comfortable' },
    { name: 'Motion / GSAP', level: 'comfortable' },
    { name: 'Docker & CI/CD', level: 'comfortable' },
    { name: 'Accessibility (WCAG)', level: 'ongoing focus' }
  ];

  var orbit = document.getElementById('skillsOrbit');
  if (orbit) {
    var frag = document.createDocumentFragment();
    skills.forEach(function (skill) {
      var node = document.createElement('div');
      node.className = 'skill-node';
      node.setAttribute('data-reveal', '');

      var name = document.createElement('span');
      name.className = 'skill-node__name';
      name.textContent = skill.name;

      var level = document.createElement('span');
      level.className = 'skill-node__level';
      level.textContent = skill.level;

      node.appendChild(name);
      node.appendChild(level);
      frag.appendChild(node);
    });
    orbit.appendChild(frag);
  }

  // -------- Case-file expand toggle --------
  document.querySelectorAll('[data-expand]').forEach(function (btn) {
    var detail = btn.nextElementSibling;
    if (!detail || !detail.hasAttribute('data-detail')) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      detail.hidden = isOpen;
      btn.querySelector('span').textContent = isOpen ? 'expand case file' : 'collapse case file';
    });
  });

  // -------- 3D tilt on project cards --------
  var tiltCards = document.querySelectorAll('[data-tilt]');
  var supportsHover = window.matchMedia('(hover: hover)').matches;

  if (supportsHover) {
    tiltCards.forEach(function (card) {
      var face = card.querySelector('.card__face');
      var bounds;

      card.addEventListener('mouseenter', function () {
        bounds = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var relX = (e.clientX - bounds.left) / bounds.width;
        var relY = (e.clientY - bounds.top) / bounds.height;
        var rotateY = (relX - 0.5) * 14;
        var rotateX = (0.5 - relY) * 14;
        face.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(6px)';
      });

      card.addEventListener('mouseleave', function () {
        face.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  // -------- Scroll reveal (staggered) --------
  var revealTargets = document.querySelectorAll('.about, .work__grid .card, .skills__orbit, .testimonials__grid .quote-card, .contact__inner');
  revealTargets.forEach(function (el) { el.setAttribute('data-reveal', ''); });

  // Stagger children within grids so items cascade in rather than pop together
  function staggerGroup(selector, step) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = (i * step) + 'ms';
    });
  }
  staggerGroup('.work__grid .card', 70);
  staggerGroup('.testimonials__grid .quote-card', 90);
  staggerGroup('.skill-node', 35);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });

  // -------- Active nav link on scroll --------
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav__link');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.style.opacity = (a.getAttribute('href') === '#' + entry.target.id) ? '1' : '';
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(function (section) { navObserver.observe(section); });

  // -------- Title block: live sheet number as you scroll --------
  var tbSheet = document.getElementById('tbSheet');
  if (tbSheet) {
    var sheetObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var num = entry.target.getAttribute('data-sheet');
          if (num) tbSheet.textContent = num + ' / 05';
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[data-sheet]').forEach(function (section) {
      sheetObserver.observe(section);
    });
  }

});
