/* ===========================
   main.js — Portfolio Scripts
=========================== */

/* ---- Nav: scroll behaviour & active section ---- */
(function () {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Mobile hamburger ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ---- Terminal animation ---- */
(function () {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: '$ whoami' },
    { type: 'out',    text: '  atmadeep arya' },
    { type: 'empty' },
    { type: 'prompt', text: '$ cat role.txt' },
    { type: 'out',    text: '  computer vision & robotics engineer' },
    { type: 'empty' },
    { type: 'prompt', text: '$ ls skills/' },
    { type: 'out',    text: '  ROS1  ROS2  OpenCV  C++14  Python3' },
    { type: 'out',    text: '  TensorFlow  ONNX  TensorRT  Gazebo' },
    { type: 'empty' },
    { type: 'prompt', text: '$ echo $MISSION' },
    { type: 'out',    text: '  building machines that see & navigate' },
    { type: 'out',    text: '  the real world' },
    { type: 'empty' },
    { type: 'cursor' },
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let currentEl = null;

  const CHAR_DELAY  = 32;
  const LINE_PAUSE  = 120;
  const BLOCK_PAUSE = 260;

  function appendLine(type, text) {
    const span = document.createElement('span');
    span.className = 't-line';

    if (type === 'prompt') {
      span.innerHTML = '<span class="t-prompt">$ </span><span class="t-cmd"></span>';
    } else if (type === 'out') {
      span.innerHTML = '<span class="t-out"></span>';
    } else if (type === 'empty') {
      span.innerHTML = '<br>';
      body.appendChild(span);
      return null;
    } else if (type === 'cursor') {
      span.innerHTML = '<span class="t-prompt">$ </span><span class="t-cursor">█</span>';
      body.appendChild(span);
      return null;
    }

    body.appendChild(span);
    return span;
  }

  function typeNext() {
    if (lineIdx >= lines.length) return;

    const line = lines[lineIdx];

    if (line.type === 'empty') {
      appendLine('empty');
      lineIdx++;
      setTimeout(typeNext, LINE_PAUSE);
      return;
    }

    if (line.type === 'cursor') {
      appendLine('cursor');
      return;
    }

    if (!currentEl) {
      currentEl = appendLine(line.type, line.text);
    }

    const textEl = currentEl.querySelector('.t-cmd, .t-out');
    const fullText = line.type === 'prompt' ? line.text.slice(2) : line.text.trimStart();

    if (charIdx < fullText.length) {
      textEl.textContent += fullText[charIdx];
      charIdx++;
      body.scrollTop = body.scrollHeight;

      const delay = line.type === 'prompt'
        ? CHAR_DELAY + Math.random() * 20
        : CHAR_DELAY * 0.7;

      setTimeout(typeNext, delay);
    } else {
      charIdx = 0;
      currentEl = null;
      lineIdx++;

      const isAfterPrompt = lineIdx > 0 && lines[lineIdx - 1].type === 'prompt';
      const pause = isAfterPrompt ? BLOCK_PAUSE * 0.5 : LINE_PAUSE;
      setTimeout(typeNext, pause);
    }
  }

  // Start after a short initial delay
  setTimeout(typeNext, 800);
})();

/* ---- Hero role typewriter ---- */
(function () {
  const el = document.getElementById('role-text');
  if (!el) return;

  const roles = [
    'Computer Vision Engineer',
    'Robotics Engineer',
    'Autonomous Systems Developer',
    'MAV & UGV Specialist',
  ];

  let rIdx = 0;
  let cIdx = 0;
  let deleting = false;

  const TYPE_SPEED   = 75;
  const DELETE_SPEED = 40;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 300;

  function tick() {
    const current = roles[rIdx];

    if (!deleting) {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 1200);
})();

/* ---- Scroll reveal via IntersectionObserver ---- */
(function () {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(entry.target.parentElement.children)
            .filter(el => el.hasAttribute('data-reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

/* ---- Project filter tabs ---- */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.split(' ').includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();
