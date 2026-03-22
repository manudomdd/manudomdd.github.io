/* =========================================================
   Portfolio Script – Manu Domínguez
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. CANVAS – Animated particle network
  -------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = 70;
  const LINK_DIST      = 130;
  const SPEED          = 0.35;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,0.7)';
      ctx.fill();
    }
  }

  function initCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6,182,212,${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawFrame);
  }

  initCanvas();
  drawFrame();
  window.addEventListener('resize', initCanvas);

  /* --------------------------------------------------
     2. NAVBAR – scroll effect + active link scrollspy
  -------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Scrollspy
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
    // Animate skill bars when stack section is visible
    animateSkillBars();
  });

  /* --------------------------------------------------
     3. HAMBURGER menu
  -------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  /* --------------------------------------------------
     4. SCROLL REVEAL – IntersectionObserver
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* --------------------------------------------------
     5. SKILL BARS – animate on reveal
  -------------------------------------------------- */
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    const stackSection = document.getElementById('stack');
    if (!stackSection) return;
    const rect = stackSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      skillsAnimated = true;
    }
  }
  animateSkillBars();

  /* --------------------------------------------------
     6. CARD TILT – 3D perspective on mouse move
  -------------------------------------------------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX =  ((y - cy) / cy) * 6;
      const rotY = -((x - cx) / cx) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* --------------------------------------------------
     7. TYPEWRITER – hero role cycling
  -------------------------------------------------- */
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    const roles = ['Engineer', 'Specialist', 'Architect', 'Developer'];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused   = false;

    function type() {
      const current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; }, 2000);
        }
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting  = false;
          roleIdx   = (roleIdx + 1) % roles.length;
        }
      }
      if (!paused) setTimeout(type, deleting ? 60 : 90);
    }
    setTimeout(type, 800);
  }

  /* --------------------------------------------------
     8. INTERACTIVE TERMINAL
  -------------------------------------------------- */
  const termInput  = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  if (!termInput || !termOutput) return;

  const COMMANDS = {
    help: `Comandos disponibles:
  whoami    →  Información sobre Manu
  skills    →  Lista de habilidades técnicas
  stack     →  Tecnologías principales
  projects  →  Proyectos destacados
  contact   →  Datos de contacto
  github    →  Abre el perfil de GitHub
  clear     →  Limpia la terminal`,

    whoami: `Manu Domínguez — Backend Engineer
  Especializado: Java 17 / Spring Boot / Python / Django
  También: Docker · Git · REST APIs · SQL
  Disponible para: Trabajo remoto o presencial (España)`,

    skills: `→ Lenguajes:    Java 17, Python, Bash, SQL
  → Frameworks:   Spring Boot, Spring Security, Django, DRF
  → DevOps:       Docker, Docker Compose, Git, GitHub Actions
  → Bases de datos: PostgreSQL, MySQL, H2
  → Herramientas: Maven, IntelliJ IDEA, Postman, JUnit`,

    stack: `STACK PRINCIPAL
  ┌─────────────────────────────────────────────┐
  │  Java 17 / Spring Boot   ████████████  92%  │
  │  Git & GitHub            ████████████  88%  │
  │  Docker                  ██████████░░  85%  │
  │  Python / Django         ██████████░░  80%  │
  └─────────────────────────────────────────────┘`,

    projects: `PROYECTOS DESTACADOS
  [1] GymTrack API      — Spring Boot + JWT + PostgreSQL
  [2] Django Pipeline   — Python + Celery + REST API
  [3] DevOps Toolkit    — Bash + Docker Compose + Git
  → Más proyectos en: github.com/manudomdd`,

    contact: `DATOS DE CONTACTO
  📧 Email:    manu@example.com
  🐙 GitHub:   github.com/manudomdd
  💼 LinkedIn: linkedin.com/in/manudomdd`,

    github: '__open_github__',

    clear: '__clear__',
  };

  function appendLine(prompt, cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">manu@portfolio:~$</span><span class="term-cmd">${escHtml(cmd)}</span>`;
    termOutput.appendChild(line);
  }

  function appendResponse(text, type = '') {
    const el = document.createElement('div');
    el.className = `term-response${type ? ' ' + type : ''}`;
    el.textContent = text;
    termOutput.appendChild(el);
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  termInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const raw = termInput.value.trim();
    termInput.value = '';
    if (!raw) return;

    appendLine('manu@portfolio:~$', raw);

    const cmd = raw.toLowerCase();
    if (COMMANDS[cmd] !== undefined) {
      const val = COMMANDS[cmd];
      if (val === '__clear__') {
        termOutput.innerHTML = '';
      } else if (val === '__open_github__') {
        appendResponse('Abriendo perfil de GitHub...', 'success');
        setTimeout(() => window.open('https://github.com/manudomdd', '_blank'), 500);
      } else {
        appendResponse(val);
      }
    } else {
      appendResponse(`comando no encontrado: '${raw}'. Escribe 'help' para ver los comandos.`, 'error');
    }

    // Keep cursor prompt at bottom
    termOutput.scrollTop = termOutput.scrollHeight;
  });

  // Focus terminal on click
  document.querySelector('.terminal-window')?.addEventListener('click', () => termInput.focus());
});