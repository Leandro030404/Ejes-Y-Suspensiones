/* ═══════════════════════════════════════════════════
   EyS · Ejes y Suspensiones — main.js
   Sin dependencias externas.
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var WSP_NUMBER = '5493416855469';
  var MAIL       = 'info@ejesysuspensiones.com.ar';
  var reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Preloader ──────────────────────────────── */
  var preloader = $('#preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-done');
    setTimeout(function () { preloader.remove(); }, 700);
  }
  window.addEventListener('load', function () { setTimeout(hidePreloader, 320); });
  // Red de seguridad: si algún recurso queda colgado, se oculta igual.
  setTimeout(hidePreloader, 4500);

  /* ── 2. Año en el footer ───────────────────────── */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 3. Header + progreso de scroll + parallax ─── */
  var header    = $('#header');
  var progress  = $('#scrollProgress');
  var heroImg   = $('#heroImg');
  var wspFloat  = $('#wspFloat');
  var ticking   = false;

  // El alto de la página y del viewport se guardan en cache.
  // Leerlos dentro del scroll, después de haber movido el hero, obligaba al
  // navegador a recalcular la maquetación en cada cuadro (redistribución forzada).
  var maxScroll = 0;
  var altoVista = 0;

  function medir() {
    altoVista = window.innerHeight;
    maxScroll = document.documentElement.scrollHeight - altoVista;
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 40);
    if (progress) progress.style.width = (maxScroll > 0 ? (y / maxScroll) * 100 : 0) + '%';
    if (wspFloat) wspFloat.classList.toggle('is-visible', y > 420);

    // Parallax suave del hero (sólo cuando está a la vista)
    if (heroImg && !reduced && y < altoVista * 1.2) {
      heroImg.style.transform = 'translate3d(0,' + (y * 0.28) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', function () { medir(); onScroll(); }, { passive: true });

  // El alto de la página cambia al aparecer las imágenes diferidas o al
  // desplegarse las preguntas frecuentes. Un ResizeObserver vuelve a medir
  // sólo cuando eso pasa, en vez de hacerlo en cada cuadro del scroll.
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { medir(); });
    ro.observe(document.body);
  } else {
    window.addEventListener('load', medir);
  }

  medir();
  onScroll();

  /* ── 4. Menú móvil ─────────────────────────────── */
  var burger = $('#burger');
  var nav    = $('#nav');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (burger) {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    }
    document.body.classList.remove('no-scroll');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('no-scroll', open);
    });

    $$('.nav__link, .nav__cta', nav).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ── 5. Reveal on scroll ───────────────────────── */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });

    // Red de seguridad: si por algún motivo el observer no dispara
    // (pestaña en segundo plano al cargar, etc.), mostramos todo igual.
    setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── 6. Contadores animados ────────────────────── */
  function animateCount(el) {
    var target = parseFloat(el.dataset.target || '0');
    var suffix = el.dataset.suffix || '';
    var dur    = 1600;
    var start  = null;

    if (reduced) { el.textContent = format(target) + suffix; return; }

    function format(n) {
      return Math.round(n).toLocaleString('es-AR');
    }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('.count');
  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); countObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObs.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ── 7. Nav activo según sección ───────────────── */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ── 8. Filtros de trabajos ────────────────────── */
  var filters = $$('.filter');
  var works   = $$('.work');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filter;

      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      works.forEach(function (w, i) {
        var show = cat === 'all' || w.dataset.cat === cat;
        if (show) {
          w.classList.remove('is-hidden');
          w.style.opacity = '0';
          w.style.transform = 'translateY(22px)';
          setTimeout(function () {
            w.style.transition = 'opacity .45s ease, transform .45s cubic-bezier(.16,1,.3,1)';
            w.style.opacity = '1';
            w.style.transform = 'none';
          }, 30 + i * 55);
        } else {
          w.classList.add('is-hidden');
        }
      });
    });
  });

  /* ── 9. Lightbox ───────────────────────────────── */
  var lb        = $('#lightbox');
  var lbImg     = $('#lbImg');
  var lbCaption = $('#lbCaption');
  var lbClose   = $('#lbClose');
  var lbPrev    = $('#lbPrev');
  var lbNext    = $('#lbNext');
  var triggers  = $$('[data-lightbox]');
  var current   = 0;
  var lastFocus = null;
  var BLANK     = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function visibleTriggers() {
    return triggers.filter(function (t) {
      var card = t.closest('.work');
      return !card || !card.classList.contains('is-hidden');
    });
  }

  function showAt(index) {
    var list = visibleTriggers();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var t = list[current];
    lbImg.src = t.dataset.img;
    lbImg.alt = t.dataset.caption || '';
    lbCaption.textContent = t.dataset.caption || '';
  }

  function openLightbox(trigger) {
    if (!lb) return;
    lastFocus = document.activeElement;
    var list = visibleTriggers();
    showAt(list.indexOf(trigger));
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () {
      lb.hidden = true;
      lbImg.src = BLANK;
      if (lastFocus) lastFocus.focus();
    }, 340);
  }

  triggers.forEach(function (t) {
    t.addEventListener('click', function () { openLightbox(t); });
  });

  if (lb) {
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showAt(current - 1); });
    lbNext.addEventListener('click', function () { showAt(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showAt(current - 1);
      if (e.key === 'ArrowRight') showAt(current + 1);
    });

    // Swipe en móvil
    var touchX = 0;
    lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) showAt(dx > 0 ? current - 1 : current + 1);
    }, { passive: true });
  }

  /* ── 10. Formulario de contacto ────────────────── */
  var form   = $('#contactForm');
  var status = $('#formStatus');

  function setError(name, msg) {
    var input = form.elements[name];
    var field = input ? input.closest('.field') : null;
    var slot  = $('[data-error-for="' + name + '"]', form);
    if (field) field.classList.toggle('has-error', !!msg);
    if (slot)  slot.textContent = msg || '';
  }

  function validate() {
    var ok = true;
    var v = function (n) { return (form.elements[n].value || '').trim(); };

    if (v('nombre').length < 2) { setError('nombre', 'Ingresá tu nombre.'); ok = false; }
    else setError('nombre', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) { setError('email', 'Ingresá un email válido.'); ok = false; }
    else setError('email', '');

    var tel = v('telefono');
    if (tel && tel.replace(/[^\d]/g, '').length < 6) { setError('telefono', 'Revisá el teléfono.'); ok = false; }
    else setError('telefono', '');

    if (v('mensaje').length < 10) { setError('mensaje', 'Contanos un poco más (mínimo 10 caracteres).'); ok = false; }
    else setError('mensaje', '');

    return ok;
  }

  function buildMessage() {
    var v = function (n) { return (form.elements[n].value || '').trim(); };
    var lines = [
      'Consulta desde la web de EyS',
      '',
      'Nombre: ' + v('nombre'),
      'Email: ' + v('email')
    ];
    if (v('telefono')) lines.push('Teléfono: ' + v('telefono'));
    lines.push('Motivo: ' + v('motivo'));
    if (v('unidad')) lines.push('Unidad: ' + v('unidad'));
    lines.push('');
    lines.push('Mensaje:');
    lines.push(v('mensaje'));
    return lines.join('\n');
  }

  function fail() {
    form.classList.add('shake');
    setTimeout(function () { form.classList.remove('shake'); }, 500);
    var firstErr = $('.field.has-error input, .field.has-error textarea', form);
    if (firstErr) firstErr.focus();
    if (status) { status.style.color = '#d9261c'; status.textContent = 'Revisá los campos marcados.'; }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { fail(); return; }

      var url = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(buildMessage());
      window.open(url, '_blank', 'noopener');
      if (window.eysConversion) window.eysConversion('formulario');
      if (status) { status.style.color = '#12813f'; status.textContent = '¡Listo! Se abrió WhatsApp con tu consulta. Confirmá el envío allí.'; }
    });

    var mailBtn = $('#sendMail');
    if (mailBtn) {
      mailBtn.addEventListener('click', function () {
        if (!validate()) { fail(); return; }
        var subject = 'Consulta web — ' + (form.elements['motivo'].value || 'Consulta general');
        window.location.href = 'mailto:' + MAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body='    + encodeURIComponent(buildMessage());
        if (status) { status.style.color = '#12813f'; status.textContent = 'Se abrió tu cliente de correo con la consulta redactada.'; }
      });
    }

    // Limpiar el error apenas el usuario corrige
    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.closest('.field').classList.contains('has-error')) setError(el.name, '');
      });
    });
  }

  /* ── 11. Scroll suave con offset (fallback) ────── */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY -
                (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 78) - 10;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

})();

/* ---------- Medicion de conversiones (Google Ads) ---------- */
(function () {
  var WSP  = 'AW-18384322870/Ce0DCLWOyeYcELaCqr5E';   // Clic en WhatsApp
  var TEL  = 'AW-18384322870/qlJcCLiOyeYcELaCqr5E';   // Clic en telefono
  var FORM = 'AW-18384322870/KAwDCPnq1-YcELaCqr5E';   // Envio del formulario

  function enviar(destino, extra) {
    if (typeof window.gtag !== 'function') return;
    var datos = { send_to: destino };
    if (extra) { for (var k in extra) datos[k] = extra[k]; }
    window.gtag('event', 'conversion', datos);
  }

  // Lo usa el formulario, que abre WhatsApp sin pasar por un enlace
  window.eysConversion = function (tipo) {
    if (tipo === 'telefono') enviar(TEL, { value: 1.0, currency: 'ARS' });
    else if (tipo === 'formulario') enviar(FORM, { value: 1.0, currency: 'ARS' });
    else enviar(WSP);
  };

  // Un solo oyente cubre los 66 botones de WhatsApp y los 3 de telefono
  document.addEventListener('click', function (e) {
    var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) window.eysConversion('whatsapp');
    else if (href.lastIndexOf('tel:', 0) === 0) window.eysConversion('telefono');
  }, true);
})();
