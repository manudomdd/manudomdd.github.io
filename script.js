/* =====================================================
   SCRIPT.JS — Manuel Domínguez Portfolio
   Interactividad, animaciones y efectos dinámicos
   ===================================================== */

// ---- NAVBAR: scroll effect + hamburger ----
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const menu     = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Lock/unlock scroll on both html and body (fixes mobile scroll-bleed)
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    lockScroll();
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    unlockScroll();
  }

  // Hamburger toggle
  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click (clicking outside the nav-list)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();


// ---- ACTIVE NAV LINK: highlight on scroll ----
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();


// ---- FADE-UP ANIMATION ON SCROLL ----
(function initFadeUp() {
  // Add fade-up class to elements
  const targets = [
    '.section-header',
    '.about-text',
    '.about-card-group',
    '.skill-category',
    '.timeline-item',
    '.project-card',
    '.contact-card',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-up');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if in a grid
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Add stagger delays for grid items
  document.querySelectorAll('.skill-category').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });

  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.dataset.delay = i * 120;
  });

  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.dataset.delay = i * 150;
  });

  document.querySelectorAll('.info-card').forEach((el, i) => {
    el.dataset.delay = i * 70;
  });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();


// ---- SMOOTH ANCHOR SCROLL ----
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ---- TYPING EFFECT on hero subtitle ----
(function initTyping() {
  const el = document.getElementById('hero-subtitle');
  if (!el) return;

  const phrases = [
    'Java Backend Developer',
    'Spring Boot Specialist',
    'Arquitecturas Escalables',
    'Clean Code Advocate',
  ];

  let pi = 0, ci = 0, deleting = false;
  const DELAY_TYPE = 90;
  const DELAY_DEL  = 50;
  const DELAY_PAUSE = 2000;

  function type() {
    const phrase = phrases[pi];

    if (!deleting) {
      el.textContent = phrase.substring(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, DELAY_PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? DELAY_DEL : DELAY_TYPE);
  }

  // Add blinking cursor
  el.style.borderRight = '2px solid var(--pink)';
  el.style.paddingRight = '2px';

  setTimeout(type, 1000);
})();


// ---- CURSOR GLOW EFFECT (desktop only) ----
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '0',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,61,180,0.07) 0%, transparent 70%)',
    transform: 'translate(-50%,-50%)',
    transition: 'opacity 0.3s ease',
    top: '0', left: '0',
  });
  document.body.appendChild(glow);

  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


// ---- STATS COUNTER ANIMATION ----
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const suffix = raw.replace(String(num), '');
      const decimals = raw.includes('.') ? 1 : 0;

      let start = 0;
      const step = num / 40;
      const tick = () => {
        start = Math.min(start + step, num);
        el.textContent = start.toFixed(decimals) + suffix;
        if (start < num) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


// ---- ACTIVE NAV STYLE ----
(function addActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--teal) !important;
    }
  `;
  document.head.appendChild(style);
})();


// ---- PHOTO placeholder hover ----
(function initPhotoHover() {
  const frame = document.getElementById('photo-frame');
  if (!frame) return;

  frame.addEventListener('mouseenter', () => {
    frame.style.transform = 'scale(1.02) rotate(1deg)';
    frame.style.transition = 'transform 0.4s ease';
  });

  frame.addEventListener('mouseleave', () => {
    frame.style.transform = 'scale(1) rotate(0deg)';
  });
})();
