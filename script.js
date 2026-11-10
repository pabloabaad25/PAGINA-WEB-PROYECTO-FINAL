// ==========================================
// PC PIXEL STUDIO · ENTRE DOS MONS — SCRIPT PRINCIPAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // 2. Marcar la página actual en el menú
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // 3. Sombra en la barra al hacer scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 4. Aparición suave de secciones
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // 5. Cambio entre Nil y Volt (botón o tecla Q), como en el juego
  const worldBtn = document.getElementById('world-toggle');
  const worlds = document.querySelectorAll('.world');
  const status = document.getElementById('world-status');
  if (worldBtn && worlds.length) {
    let current = 'nil';
    const setWorld = (who) => {
      current = who;
      worlds.forEach(w => w.classList.toggle('is-active', w.dataset.world === who));
      const other = who === 'nil' ? 'Volt' : 'Nil';
      worldBtn.innerHTML = `<span class="key" aria-hidden="true">Q</span> Cambiar a ${other}`;
      worldBtn.setAttribute('aria-pressed', String(who === 'volt'));
      status.innerHTML = `Ahora controlas a <strong>${who === 'nil' ? 'Nil' : 'Volt'}</strong>`;
    };
    worldBtn.addEventListener('click', () => setWorld(current === 'nil' ? 'volt' : 'nil'));
    worlds.forEach(w => w.addEventListener('click', () => setWorld(w.dataset.world)));
    document.addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'q' || e.key === 'Q') setWorld(current === 'nil' ? 'volt' : 'nil');
    });
  }

  // 6. Visor de capturas
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('p');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let lastFocus = null;
    const close = () => { lightbox.classList.remove('open'); if (lastFocus) lastFocus.focus(); };
    document.querySelectorAll('.gallery button').forEach(btn => {
      btn.addEventListener('click', () => {
        const thumb = btn.querySelector('img');
        lastFocus = btn;
        img.src = btn.dataset.full;
        img.alt = thumb.alt;
        caption.textContent = btn.parentElement.querySelector('figcaption')?.textContent || '';
        lightbox.classList.add('open');
        closeBtn.focus();
      });
    });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
  }

  // 7. Partículas de "anomalía dimensional" en la portada
  const canvas = document.getElementById('anomaly-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const colors = ['#FFD34E', '#4B89A6', '#EE6C2F', '#62B56B'];
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.floor(Math.random() * 3 + 2);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.1; // suben como luciérnagas
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random();
        this.fade = Math.random() * 0.015 + 0.004;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fade;
        if (this.opacity >= 1 || this.opacity <= 0.15) this.fade = -this.fade;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
      }
      draw() {
        ctx.globalAlpha = Math.abs(this.opacity);
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
      }
    }

    const count = window.innerWidth < 600 ? 35 : 70;
    for (let i = 0; i < count; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    animate();
  }
});
