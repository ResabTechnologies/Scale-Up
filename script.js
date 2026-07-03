/* ============================================================
   SCALEUP BUSINESS CLUB — script.js
   Animations, Interactions, Countdown, Particles
============================================================ */

'use strict';

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.remove(); }, 700);
    }
  }, 2600);
});

/* ===== AOS INIT ===== */
AOS.init({
  duration: 700,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic'
});

/* ===== NAVBAR SCROLL ===== */
const mainNav = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar
  if (scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }

  // Back to top
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link highlight
  updateActiveNavLink();
});

/* ===== ACTIVE NAV LINK ===== */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  let currentSection = '';

  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 120) currentSection = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/* ===== BACK TO TOP ===== */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== COUNTDOWN TIMER ===== */
function updateCountdown() {
  const eventDate = new Date('2026-07-09T08:30:00');
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('count-days').textContent    = '00';
    document.getElementById('count-hours').textContent   = '00';
    document.getElementById('count-minutes').textContent = '00';
    document.getElementById('count-seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setCountNum('count-days',    days);
  setCountNum('count-hours',   hours);
  setCountNum('count-minutes', minutes);
  setCountNum('count-seconds', seconds);
}

function setCountNum(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const newVal = String(val).padStart(2, '0');
  if (el.textContent !== newVal) {
    el.style.transform = 'translateY(-6px)';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'all 0.3s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }, 150);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target')) || 0;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num').forEach(el => counterObserver.observe(el));

/* ===== PARTICLE SYSTEM ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    initParticlesList();
  });

  const PARTICLE_COUNT = Math.min(Math.floor(W / 20), 60);
  let particles = [];
  let mouse = { x: W / 2, y: H / 2 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size    = Math.random() * 2 + 0.5;
      this.speedX  = (Math.random() - 0.5) * 0.4;
      this.speedY  = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color   = Math.random() > 0.5
        ? `rgba(201, 162, 39, ${this.opacity})`
        : `rgba(61, 139, 104, ${this.opacity})`;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticlesList() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = 'rgba(201, 162, 39, 0.6)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  initParticlesList();
  animate();
})();

/* ===== SMOOTH SCROLL FOR ANCHORS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();

    // Close navbar if open
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) toggler.click();
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== REGISTER FORM ===== */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('reg-name');
    const email   = document.getElementById('reg-email');
    const phone   = document.getElementById('reg-phone');

    let valid = true;

    [name, email, phone].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.15)';
        valid = false;
      } else {
        field.style.borderColor = 'var(--gold)';
        field.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.15)';
      }
    });

    if (!valid) return;

    // Simulate submission
    const btn = document.getElementById('submit-register-btn');
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Registered!';
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

      // Show toast
      const toastEl = document.getElementById('successToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
        toast.show();
      }

      registerForm.reset();

      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Register Now';
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    }, 2000);
  });

  // Live field validation clear
  registerForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow = '';
    });
  });
}

/* ===== GALLERY FILTER TABS ===== */
(function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gfilter-btn');
  const galleryItems = document.querySelectorAll('.gallery-mosaic .gitem');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Show / hide items
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.classList.add('visible');
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });
    });
  });

  // Init all visible
  galleryItems.forEach(item => item.classList.add('visible'));
})();

/* ===== GALLERY LIGHTBOX (via zoom button or item click) ===== */
function openGalleryLightbox(imgSrc, imgAlt) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes lbFadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes lbZoomIn { from { transform: scale(0.82); opacity:0; } to { transform: scale(1); opacity:1; } }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.96);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; cursor: zoom-out;
    animation: lbFadeIn 0.3s ease;
    backdrop-filter: blur(12px);
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.src = imgSrc;
  lightboxImg.alt = imgAlt || '';
  lightboxImg.style.cssText = `
    max-width: 90vw; max-height: 88vh; object-fit: contain;
    border-radius: 14px;
    border: 2px solid rgba(201,162,39,0.45);
    box-shadow: 0 0 80px rgba(201,162,39,0.2), 0 30px 80px rgba(0,0,0,0.9);
    animation: lbZoomIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.style.cssText = `
    position: absolute; top: 20px; right: 20px;
    background: rgba(201,162,39,0.18); border: 1.5px solid rgba(201,162,39,0.55);
    color: #f0c040; border-radius: 50%; width: 46px; height: 46px;
    font-size: 1.1rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: all 0.22s ease; backdrop-filter: blur(6px);
  `;
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(201,162,39,0.55)'; closeBtn.style.color = '#0d1f17'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(201,162,39,0.18)'; closeBtn.style.color = '#f0c040'; });

  overlay.appendChild(lightboxImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      overlay.remove();
      style.remove();
      document.body.style.overflow = '';
    }, 300);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
}

// Wire zoom buttons
document.querySelectorAll('.gitem-zoom-btn').forEach(zBtn => {
  zBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const img = this.closest('.gitem-inner').querySelector('img');
    if (img) openGalleryLightbox(img.src, img.alt);
  });
});

// Wire clicking the entire gitem
document.querySelectorAll('.gallery-mosaic .gitem').forEach(item => {
  item.addEventListener('click', function(e) {
    // Avoid double-firing if zoom btn clicked
    if (e.target.closest('.gitem-zoom-btn')) return;
    const img = this.querySelector('img');
    if (img) openGalleryLightbox(img.src, img.alt);
  });
});

/* ===== NAVBAR ACTIVE LINK STYLE ===== */
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
  .navbar-nav .nav-link.active {
    color: var(--gold-light) !important;
  }
  .navbar-nav .nav-link.active::after {
    transform: scaleX(1) !important;
  }
`;
document.head.appendChild(navLinkStyle);

/* ===== MAGNETIC BUTTON EFFECT ===== */
document.querySelectorAll('.btn-gold, .btn-outline-gold').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ===== SCROLL REVEAL FOR NAV ===== */
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 300) {
    mainNav.style.transform = 'translateY(-100%)';
  } else {
    mainNav.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

// Add CSS for nav hide transition
const navStyle = document.createElement('style');
navStyle.textContent = `#mainNav { transition: transform 0.4s ease, background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease; }`;
document.head.appendChild(navStyle);

console.log('%cScaleUp Business Club 🚀', 'color: #c9a227; font-size: 20px; font-weight: bold;');
console.log('%cBusiness Networking Hub — July 9, 2026', 'color: #9abba5; font-size: 12px;');
