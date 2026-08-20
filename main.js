/* ==========================================================================
   Josh_Dev — Site Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

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

  // -------- Scroll reveal --------
  var revealTargets = document.querySelectorAll('.about, .work__grid .card, .skills__orbit, .contact__inner');
  revealTargets.forEach(function (el) { el.setAttribute('data-reveal', ''); });

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

});
