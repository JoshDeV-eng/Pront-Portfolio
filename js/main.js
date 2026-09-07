/* ==========================================================================
   Josh_Dev — Site Interactions
   Each feature below runs inside safe(), its own try/catch. If one throws
   (a browser quirk, a blocked API, anything), it's logged but every other
   feature still initializes — no single failure can take the rest of the
   page's interactivity down with it.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  function safe(label, fn) {
    try { fn(); } catch (err) { console.error('[Josh_Dev] ' + label + ' failed to init:', err); }
  }

  // -------- Count-up animation for stat numbers (shared utility) --------
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseInt(el.getAttribute('data-target'), 10);
    var padLen = el.getAttribute('data-target').length;
    if (isNaN(target)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(target).padStart(padLen, '0');
      return;
    }

    var duration = 1200;
    var start = null;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutQuart(progress);
      var value = Math.round(target * eased);
      el.textContent = String(value).padStart(padLen, '0');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // -------- Theme toggle (dark / light) --------
  safe('theme toggle', function () {
    var themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    function storeTheme(theme) {
      try { localStorage.setItem('josh-dev-theme', theme); } catch (e) { /* storage unavailable, session-only */ }
    }
    function currentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    function applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
    }

    // Sync toggle UI to whatever the blocking head-script already set
    applyTheme(currentTheme());

    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storeTheme(next);
    });
  });

  // -------- Custom crosshair cursor (desktop only) --------
  safe('crosshair cursor', function () {
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
  });

  // -------- Cinematic hero: staggered title reveal on load --------
  var heroEl = document.querySelector('.hero');
  safe('hero load reveal', function () {
    if (heroEl) {
      requestAnimationFrame(function () {
        setTimeout(function () { heroEl.classList.add('is-loaded'); }, 80);
      });
      // Count up the hero proof numbers once the reveal has mostly settled
      setTimeout(function () {
        document.querySelectorAll('.hero__proof .stat__num').forEach(animateCount);
      }, 900);
    }
  });

  // -------- Ambient glow follows cursor within hero --------
  safe('hero ambient glow', function () {
    var heroGlow = document.getElementById('heroGlow');
    if (heroEl && heroGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      heroEl.addEventListener('mousemove', function (e) {
        var rect = heroEl.getBoundingClientRect();
        heroGlow.style.left = (e.clientX - rect.left) + 'px';
        heroGlow.style.top = (e.clientY - rect.top) + 'px';
        heroGlow.classList.add('is-active');
      });
      heroEl.addEventListener('mouseleave', function () {
        heroGlow.classList.remove('is-active');
      });
    }
  });

  // -------- Footer year --------
  safe('footer year', function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // -------- Mobile nav toggle --------
  safe('mobile nav toggle', function () {
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
  });

  // -------- Skill stack (generated nodes) --------
  safe('skill stack render', function () {
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
  });

  // -------- Case-file expand toggle --------
  safe('case-file expand toggle', function () {
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
  });

  // -------- 3D tilt on project cards --------
  safe('card tilt', function () {
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
  });

  // -------- Scroll reveal (staggered) --------
  safe('scroll reveal', function () {
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
  });

  // -------- Section headings: idx tracking-fade + title wipe --------
  safe('heading reveal', function () {
    var headingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.section-idx, .section-title, .contact__title').forEach(function (el) {
      // Slight delay on the title so the idx label tracks in just before it, like a title card
      if (el.classList.contains('section-title') || el.classList.contains('contact__title')) {
        el.style.transitionDelay = '150ms';
      }
      headingObserver.observe(el);
    });
  });

  // -------- About stats: count up on scroll into view --------
  safe('stats counter', function () {
    var statsBlock = document.querySelector('.about__stats');
    if (statsBlock) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat__num').forEach(animateCount);
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(statsBlock);
    }
  });

  // -------- Active nav link on scroll --------
  safe('active nav highlight', function () {
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

  // -------- Title block: live sheet number as you scroll --------
  safe('title block sheet tracker', function () {
    var tbSheet = document.getElementById('tbSheet');
    if (tbSheet) {
      var sheetObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var num = entry.target.getAttribute('data-sheet');
            if (num) tbSheet.textContent = num + ' / 06';
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('section[data-sheet]').forEach(function (section) {
        sheetObserver.observe(section);
      });
    }
  });

});
