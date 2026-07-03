/* ============================================================
   SCALEUP BUSINESS CLUB — script.js
   Defensive, GitHub Pages safe version
============================================================ */

(function () {
  'use strict';

  /* ===== PRELOADER ===== */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(function () { preloader.remove(); }, 700);
      }
    }, 2600);
  });

  /* ===== AOS INIT (guarded) ===== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  /* ===== NAVBAR SCROLL ===== */
  var mainNav  = document.getElementById('mainNav');
  var backToTop = document.getElementById('backToTop');
  var lastScrollY = 0;

  // Inject nav transition style
  var navTransStyle = document.createElement('style');
  navTransStyle.textContent = '#mainNav { transition: transform 0.4s ease, background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease; }';
  document.head.appendChild(navTransStyle);

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY || window.pageYOffset;

    if (mainNav) {
      // Scrolled style
      if (scrollY > 60) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }

      // Hide on scroll down, show on scroll up
      if (scrollY > lastScrollY && scrollY > 300) {
        mainNav.style.transform = 'translateY(-100%)';
      } else {
        mainNav.style.transform = 'translateY(0)';
      }
      lastScrollY = scrollY;
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active nav link
    updateActiveNavLink();
  }, { passive: true });

  /* ===== ACTIVE NAV LINK ===== */
  function updateActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    var currentSection = '';

    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 120) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  /* ===== NAVBAR ACTIVE LINK STYLE ===== */
  var navLinkStyle = document.createElement('style');
  navLinkStyle.textContent =
    '.navbar-nav .nav-link.active { color: var(--gold-light) !important; }' +
    '.navbar-nav .nav-link.active::after { transform: scaleX(1) !important; }';
  document.head.appendChild(navLinkStyle);

  /* ===== BACK TO TOP ===== */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== COUNTDOWN TIMER ===== */
  function updateCountdown() {
    var eventDate = new Date('2026-07-09T08:30:00');
    var now  = new Date();
    var diff = eventDate - now;

    if (diff <= 0) {
      setCountNum('count-days',    0);
      setCountNum('count-hours',   0);
      setCountNum('count-minutes', 0);
      setCountNum('count-seconds', 0);
      return;
    }

    var days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountNum('count-days',    days);
    setCountNum('count-hours',   hours);
    setCountNum('count-minutes', minutes);
    setCountNum('count-seconds', seconds);
  }

  function setCountNum(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    var newVal = String(val).padStart(2, '0');
    if (el.textContent !== newVal) {
      el.style.transform = 'translateY(-6px)';
      el.style.opacity   = '0';
      setTimeout(function () {
        el.textContent     = newVal;
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'translateY(0)';
        el.style.opacity   = '1';
      }, 150);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 2000;
    var step     = target / (duration / 16);
    var current  = 0;

    var timer = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-num').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ===== PARTICLE SYSTEM ===== */
  (function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var W   = window.innerWidth;
    var H   = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    var PARTICLE_COUNT = Math.min(Math.floor(W / 20), 60);
    var particles = [];
    var mouse     = { x: W / 2, y: H / 2 };

    window.addEventListener('resize', function () {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      initList();
    });

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    function Particle(initial) {
      this.reset(initial);
    }

    Particle.prototype.reset = function (initial) {
      this.x       = Math.random() * W;
      this.y       = initial ? Math.random() * H : H + 10;
      this.size    = Math.random() * 2 + 0.5;
      this.speedX  = (Math.random() - 0.5) * 0.4;
      this.speedY  = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color   = Math.random() > 0.5
        ? 'rgba(201,162,39,' + this.opacity + ')'
        : 'rgba(61,139,104,' + this.opacity + ')';
      this.life    = 0;
      this.maxLife = Math.random() * 300 + 150;
    };

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      var dx   = this.x - mouse.x;
      var dy   = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    };

    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    function initList() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(true));
      }
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx   = particles[i].x - particles[j].x;
          var dy   = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = 'rgba(201,162,39,0.6)';
            ctx.lineWidth   = 0.5;
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
      particles.forEach(function (p) { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    initList();
    animate();
  }());

  /* ===== SMOOTH SCROLL FOR ANCHORS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      var navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        var toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== REGISTER FORM ===== */
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = document.getElementById('reg-name');
      var email = document.getElementById('reg-email');
      var phone = document.getElementById('reg-phone');

      var valid = true;
      [name, email, phone].forEach(function (field) {
        if (!field || !field.value.trim()) {
          if (field) {
            field.style.borderColor = '#e74c3c';
            field.style.boxShadow   = '0 0 0 3px rgba(231,76,60,0.15)';
          }
          valid = false;
        } else {
          field.style.borderColor = 'var(--gold)';
          field.style.boxShadow   = '0 0 0 3px rgba(201,162,39,0.15)';
        }
      });

      if (!valid) return;

      var btn = document.getElementById('submit-register-btn');
      if (btn) {
        btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
        btn.disabled  = true;
      }

      setTimeout(function () {
        if (btn) {
          btn.innerHTML    = '<i class="bi bi-check-circle-fill me-2"></i>Registered!';
          btn.style.background = 'linear-gradient(135deg,#27ae60,#2ecc71)';
        }

        var toastEl = document.getElementById('successToast');
        if (toastEl && typeof bootstrap !== 'undefined') {
          var toast = new bootstrap.Toast(toastEl, { delay: 5000 });
          toast.show();
        }

        registerForm.reset();

        setTimeout(function () {
          if (btn) {
            btn.innerHTML    = '<i class="bi bi-send-fill me-2"></i>Register Now';
            btn.style.background = '';
            btn.disabled     = false;
          }
        }, 5000);
      }, 2000);
    });

    registerForm.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
        this.style.boxShadow   = '';
      });
    });
  }

  /* ===== GALLERY FILTER TABS ===== */
  (function initGalleryFilters() {
    var filterBtns   = document.querySelectorAll('.gfilter-btn');
    var galleryItems = document.querySelectorAll('.gallery-mosaic .gitem');

    if (!filterBtns.length || !galleryItems.length) return;

    // Init all visible
    galleryItems.forEach(function (item) { item.classList.add('visible'); });

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        galleryItems.forEach(function (item) {
          var cat = item.getAttribute('data-cat');
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
  }());

  /* ===== GALLERY LIGHTBOX ===== */
  function openGalleryLightbox(imgSrc, imgAlt) {
    var lbStyle = document.createElement('style');
    lbStyle.textContent =
      '@keyframes lbFadeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes lbZoomIn{from{transform:scale(0.82);opacity:0}to{transform:scale(1);opacity:1}}';
    document.head.appendChild(lbStyle);

    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.96);' +
      'display:flex;align-items:center;justify-content:center;' +
      'z-index:9999;cursor:zoom-out;animation:lbFadeIn 0.3s ease;' +
      'backdrop-filter:blur(12px);';

    var img = document.createElement('img');
    img.src = imgSrc;
    img.alt = imgAlt || '';
    img.style.cssText =
      'max-width:90vw;max-height:88vh;object-fit:contain;' +
      'border-radius:14px;border:2px solid rgba(201,162,39,0.45);' +
      'box-shadow:0 0 80px rgba(201,162,39,0.2),0 30px 80px rgba(0,0,0,0.9);' +
      'animation:lbZoomIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94);';

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText =
      'position:absolute;top:20px;right:20px;' +
      'background:rgba(201,162,39,0.18);border:1.5px solid rgba(201,162,39,0.55);' +
      'color:#f0c040;border-radius:50%;width:46px;height:46px;' +
      'font-size:1.5rem;cursor:pointer;display:flex;align-items:center;' +
      'justify-content:center;transition:all 0.22s ease;';

    closeBtn.addEventListener('mouseenter', function () {
      this.style.background = 'rgba(201,162,39,0.55)';
      this.style.color = '#0d1f17';
    });
    closeBtn.addEventListener('mouseleave', function () {
      this.style.background = 'rgba(201,162,39,0.18)';
      this.style.color = '#f0c040';
    });

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function close() {
      overlay.style.opacity    = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(function () {
        if (overlay.parentNode) overlay.remove();
        if (lbStyle.parentNode) lbStyle.remove();
        document.body.style.overflow = '';
      }, 300);
    }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
    });
  }

  document.querySelectorAll('.gitem-zoom-btn').forEach(function (zBtn) {
    zBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var img = this.closest('.gitem-inner') && this.closest('.gitem-inner').querySelector('img');
      if (img) openGalleryLightbox(img.src, img.alt);
    });
  });

  document.querySelectorAll('.gallery-mosaic .gitem').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.gitem-zoom-btn')) return;
      var img = this.querySelector('img');
      if (img) openGalleryLightbox(img.src, img.alt);
    });
  });

  /* ===== MAGNETIC BUTTON EFFECT ===== */
  document.querySelectorAll('.btn-gold, .btn-outline-gold').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x    = e.clientX - rect.left - rect.width  / 2;
      var y    = e.clientY - rect.top  - rect.height / 2;
      this.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px) translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  console.log('%cScaleUp Business Club', 'color:#c9a227;font-size:18px;font-weight:bold;');
  console.log('%cBusiness Networking Hub — July 9, 2026', 'color:#9abba5;font-size:12px;');

}());
