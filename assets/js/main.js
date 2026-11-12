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

  /* ── Marca de origen (G-036) ───────────────────────────────────────────────────────
     Quien llega desde un anuncio de Google trae un codigo en la direccion (gclid, gbraid,
     wbraid o gad_source). Se recuerda mientras dura la visita (sessionStorage, sin cookies) y
     el mensaje de WhatsApp lleva la palabra (anuncio) al final. Asi se ve en WhatsApp que
     consultas vienen de la publicidad. Quien llega por otro camino no ve ningun cambio.
     A-024: cada campana de Google Ads agrega un codigo corto con el "sufijo de URL final"
     (eys=b1 a b4 para Busqueda, eys=m para Maximo rendimiento) y el mensaje dice, por ejemplo,
     (anuncio B1). Solo se aceptan esos 5 codigos: cualquier otro queda como (anuncio). */
  var TAG_ORIGEN = '(anuncio)';
  var ES_ANUNCIO = false;
  var CODIGOS_CAMPANA = { b1: 'B1', b2: 'B2', b3: 'B3', b4: 'B4', m: 'M' };
  function codigoCampana(valor) {
    return Object.prototype.hasOwnProperty.call(CODIGOS_CAMPANA, valor) ? CODIGOS_CAMPANA[valor] : '';
  }
  var mCodigo = /[?&]eys=([a-z0-9]{1,3})(?:&|$)/i.exec(location.search);
  var CODIGO_URL = mCodigo ? codigoCampana(mCodigo[1].toLowerCase()) : '';
  var CODIGO = '';
  try {
    if (/[?&](gclid|gbraid|wbraid|gad_source)=/.test(location.search)) {
      sessionStorage.setItem('eys-origen', 'anuncio');
      if (CODIGO_URL) sessionStorage.setItem('eys-campana', CODIGO_URL);
    }
    ES_ANUNCIO = sessionStorage.getItem('eys-origen') === 'anuncio';
    CODIGO = codigoCampana(String(sessionStorage.getItem('eys-campana') || '').toLowerCase());
  } catch (e) {
    ES_ANUNCIO = /[?&](gclid|gbraid|wbraid|gad_source)=/.test(location.search);
    CODIGO = ES_ANUNCIO ? CODIGO_URL : '';
  }
  if (ES_ANUNCIO && CODIGO) TAG_ORIGEN = '(anuncio ' + CODIGO + ')';

  /* ── Codigo de referencia (A-028) ──────────────────────────────────────────────────
     Si el anuncio trae el identificador de clic de Google (gclid, gbraid o wbraid), se arma un
     codigo corto (ref 4F7K) que va dentro de la marca: "(anuncio B1 · ref 4F7K)". Al abrir
     WhatsApp, el codigo y el identificador se mandan al intermediario de Cloudflare, que los
     guarda 90 dias (sin nombre ni telefono). Cuando Leandro marca un chat como cliente de
     verdad, con ese codigo se le avisa a Google Ads ("Consulta calificada") que ese clic sirvio.
     Esta en la politica de privacidad. Si algo falla, el mensaje sale igual, sin codigo. */
  var REF = '', CLIC = '';
  try {
    var mClic = /[?&](gclid|gbraid|wbraid)=([A-Za-z0-9_\-]{10,200})(?:&|$)/.exec(location.search);
    if (mClic) {
      sessionStorage.setItem('eys-clic', mClic[1] + ':' + mClic[2]);
      if (!sessionStorage.getItem('eys-ref') && window.crypto && crypto.getRandomValues) {
        var LETRAS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', nums = new Uint8Array(4), r = '';
        crypto.getRandomValues(nums);
        for (var i = 0; i < 4; i++) r += LETRAS.charAt(nums[i] % LETRAS.length);
        sessionStorage.setItem('eys-ref', r);
      }
    }
    CLIC = sessionStorage.getItem('eys-clic') || '';
    REF = CLIC ? (sessionStorage.getItem('eys-ref') || '') : '';
  } catch (e) { REF = ''; }
  if (ES_ANUNCIO && REF) TAG_ORIGEN = TAG_ORIGEN.replace(')', ' · ref ' + REF + ')');
  // Una sola vez por visita, en el momento en que se abre WhatsApp (lo llama eysConversion)
  window.eysEnviarRef = function () {
    if (!REF || !CLIC || !navigator.sendBeacon) return;
    try {
      if (sessionStorage.getItem('eys-ref-enviado') === REF) return;
      var p = CLIC.indexOf(':');
      navigator.sendBeacon('https://eys-asistente.leandrobertainariver.workers.dev/ref', JSON.stringify({
        ref: REF, tipo: CLIC.slice(0, p), id: CLIC.slice(p + 1), campana: CODIGO || ''
      }));
      sessionStorage.setItem('eys-ref-enviado', REF);
    } catch (e) {}
  };
  function marcarEnlace(a) {
    if (!ES_ANUNCIO || !a || !a.getAttribute) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('wa.me/' + WSP_NUMBER + '?text=') === -1) return;      // solo chats con mensaje; no el catalogo
    var etiqueta = encodeURIComponent(' ' + TAG_ORIGEN);
    if (h.indexOf(etiqueta) !== -1) return;                               // ya marcado
    a.setAttribute('href', h + etiqueta);
  }
  if (ES_ANUNCIO) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), marcarEnlace);
    // Enlaces que se crean despues (el del asistente): se marcan al tocarlos
    document.addEventListener('click', function (e) {
      marcarEnlace(e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null);
    }, true);
  }

  /* Safari en iPhone no aplica :active a un boton tocado salvo que la pagina escuche
     el toque. Este oyente vacio alcanza para que la reaccion al apretar (G-017) exista
     tambien en iOS. Pasivo: no frena el scroll. */
  document.addEventListener('touchstart', function () {}, { passive: true });

  /* ── 1. (Sin preloader) ────────────────────────── */
  /* La pantalla de carga se saco el 05/10/2026 (G-049): aun esperando solo a DOMContentLoaded,
     con datos moviles el texto del hero tardaba 6-7 s en verse. Ver la nota en styles.css. */

  /* ── 2. Año en el footer ───────────────────────── */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 3. Header + progreso de scroll + parallax ─── */
  var header    = $('#header');
  var progress  = $('#scrollProgress');
  /* La barra de progreso y el parallax del hero los hace el CSS (seccion 34) cuando el navegador
     soporta animation-timeline; el JS solo mueve la barra si no lo soporta. */
  var scrollCSS = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'));
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
    if (progress && !scrollCSS) progress.style.transform = 'scaleX(' + (maxScroll > 0 ? (y / maxScroll) : 0) + ')';
    if (wspFloat) wspFloat.classList.toggle('is-visible', y > 420);

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
        /* Las secciones sin enlace en el menu (ej. "Que necesita tu unidad", "Como
           trabajamos") no deben apagar el resaltado: que siga la del bloque anterior. */
        var tieneEnlace = navLinks.some(function (l) { return l.getAttribute('href') === '#' + id; });
        if (!tieneEnlace) return;
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
        b.setAttribute("aria-pressed", String(on));
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

  /* ── 8b. Ver todos los trabajos (celular) y Seguir leyendo (Empresa) · G-031 ── */
  var worksBox = $('#works');
  function expandirTrabajos() { if (worksBox) worksBox.classList.add('is-expandido'); }
  var verMasBtn = $('#verMas');
  if (verMasBtn) verMasBtn.addEventListener('click', expandirTrabajos);
  filters.forEach(function (b) { b.addEventListener('click', expandirTrabajos); });
  var masEmpresa = $('.about__mas');
  if (masEmpresa && window.matchMedia('(min-width:900px)').matches) masEmpresa.open = true;

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
    // Los navegadores viejos que no entienden webp vuelven al jpg original.
    lbImg.onerror = function () { this.onerror = null; this.src = this.src.replace(/.webp$/, '.jpg'); };
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

    // El email es opcional (G-049): por WhatsApp no hace falta y por correo sale del propio cliente
    // de correo. Antes era obligatorio y frenaba al que solo queria mandar el WhatsApp.
    var mail = v('email');
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { setError('email', 'Revisá el email.'); ok = false; }
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
      'Nombre: ' + v('nombre')
    ];
    if (v('email')) lines.push('Email: ' + v('email'));
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

      var url = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(buildMessage() + (ES_ANUNCIO ? ' ' + TAG_ORIGEN : ''));
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

  /* ── 12. Paso previo a WhatsApp, SOLO para Maximo rendimiento (A-027) ── */
  /* Los que llegan desde Maximo rendimiento (eys=m) tocan el boton de WhatsApp sin querer y
     mandan el mensaje armado sin una consulta real. Google cuenta cada toque como conversion
     y aprende a traer mas gente asi. Para ESAS visitas, antes de abrir WhatsApp se piden el
     trabajo y la unidad, y la conversion se cuenta recien cuando WhatsApp se abre de verdad.
     Busqueda (B1-B4), organico y quien no tiene JavaScript siguen igual: un toque y a WhatsApp.
     Base: el panel de G-007 (commits 5d64cc0 y 61602c9), sin la parte de horario. */
  if (ES_ANUNCIO && CODIGO === 'M') (function () {
    /* Los mismos 11 motivos del desplegable "Motivo" del formulario (#contactForm). */
    var TRABAJOS = [
      'Consulta general',
      'Colocación de 3er eje',
      'Escalabilidad / modificación de chasis',
      'Cambio de chasis a tractor',
      'Carrocerías y semirremolques',
      'Sistema de freno ABS',
      'Fabricación de ejes autodireccionales',
      'Ejes trunnion / carretones',
      'Suspensiones neumáticas',
      'Trenes rodantes agrícolas',
      'Repuestos y componentes'
    ];
    var SALUDO_GENERICO = 'Hola, quiero consultar por un trabajo en mi unidad.';
    var panel = null, previo = null;

    function esChat(href) {
      if (href.indexOf('wa.me/c/') !== -1) return false;           // el catalogo es una vidriera, no un chat
      return href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com/') !== -1;
    }

    /* Primer renglon del mensaje del enlace, sin la marca (anuncio M) que le pego marcarEnlace:
       la marca se vuelve a poner una sola vez al final del mensaje completo. */
    function saludoDe(href) {
      var m = /[?&]text=([^&]*)/.exec(href), t = '';
      if (m) { try { t = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (err) { t = ''; } }
      t = (t.split('\n')[0] || '').replace(' ' + TAG_ORIGEN, '').trim();
      return t || SALUDO_GENERICO;
    }
    /* Las paginas internas ya nombran el servicio ("...consultar por la colocacion de un tercer
       eje."): ahi no se pregunta el trabajo. El generico, la visita o un enlace sin texto, si. */
    function pideTrabajo(saludo) {
      return !/consultar por/i.test(saludo) || /un trabajo en mi unidad/i.test(saludo);
    }

    function cerrar() {
      if (!panel) return;
      var p = panel;
      panel = null;
      p.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, reduced ? 0 : 200);
      if (previo && previo.focus) previo.focus();
    }

    /* Si el navegador bloquea la ventana (pasa entrando desde apps), el panel queda abierto con
       un enlace de verdad. Ese enlace lo cuenta el oyente de medicion de abajo, una sola vez. */
    function abrirWhatsapp(mensaje) {
      var url = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(mensaje);
      var v = window.open(url, '_blank', 'noopener');
      if (v) {
        if (window.eysConversion) window.eysConversion('whatsapp');
        cerrar();
        return;
      }
      $('.guia__form', panel).hidden = true;
      var rescate = document.createElement('div');
      rescate.className = 'guia__rescate';
      var p = document.createElement('p');
      p.textContent = 'Tu navegador no dejó abrir WhatsApp solo. Tocá acá y se abre con el mensaje ya escrito:';
      var a = document.createElement('a');
      a.className = 'btn btn--wsp guia__enviar';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Abrir WhatsApp';
      a.addEventListener('click', function () { setTimeout(cerrar, 400); });
      rescate.appendChild(p);
      rescate.appendChild(a);
      $('.guia__caja', panel).appendChild(rescate);
      a.focus();
    }

    function abrirPanel(a) {
      if (panel) return;
      previo = a;
      var saludo = saludoDe(a.getAttribute('href') || '');
      var conSel = pideTrabajo(saludo);

      var opciones = '<option value="" selected disabled>Elegí una opción</option>';
      for (var i = 0; i < TRABAJOS.length; i++) {
        opciones += '<option value="' + TRABAJOS[i] + '">' + TRABAJOS[i] + '</option>';
      }

      panel = document.createElement('div');
      panel.className = 'guia';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-labelledby', 'guia-titulo');
      panel.setAttribute('aria-describedby', 'guia-bajada');
      panel.innerHTML =
        '<div class="guia__fondo" data-cerrar></div>' +
        '<div class="guia__caja">' +
          '<button type="button" class="guia__x" data-cerrar aria-label="Cerrar">&times;</button>' +
          '<h2 class="guia__titulo" id="guia-titulo">Contanos qué necesitás</h2>' +
          '<p class="guia__bajada" id="guia-bajada">Así te respondemos con lo que buscás. ' +
            'El plazo y el presupuesto te los confirmamos viendo la unidad.</p>' +
          '<form class="guia__form" novalidate>' +
            (conSel
              ? '<label class="guia__campo"><span>Trabajo</span>' +
                  '<select name="trabajo" required aria-describedby="guia-error-trabajo">' + opciones + '</select></label>' +
                '<p class="guia__error" id="guia-error-trabajo" hidden>Elegí el trabajo que necesitás.</p>'
              : '') +
            '<label class="guia__campo"><span>Tu unidad (marca, modelo y año)</span>' +
              '<input name="unidad" type="text" autocomplete="off" required minlength="3" ' +
              'placeholder="Ej.: Scania R450 2019" aria-describedby="guia-error-unidad"></label>' +
            '<p class="guia__error" id="guia-error-unidad" hidden>Escribinos al menos la marca y el modelo.</p>' +
            '<button type="submit" class="btn btn--wsp guia__enviar">Abrir WhatsApp</button>' +
          '</form>' +
        '</div>';

      document.body.appendChild(panel);
      document.body.classList.add('no-scroll');
      requestAnimationFrame(function () { if (panel) panel.classList.add('is-open'); });

      var form  = $('.guia__form', panel);
      var sel   = $('[name="trabajo"]', panel);
      var campo = $('[name="unidad"]', panel);
      var errSel = $('#guia-error-trabajo', panel);
      var errUni = $('#guia-error-unidad', panel);
      var primero = sel || campo;
      // Sin esperar a la animacion: el foco entra apenas se abre (el panel ya esta en el DOM)
      primero.focus({ preventScroll: true });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var unidad = (campo.value || '').trim();
        var malSel = sel && !sel.value;
        var malUni = unidad.length < 3;
        if (errSel) errSel.hidden = !malSel;
        errUni.hidden = !malUni;
        if (sel) sel.setAttribute('aria-invalid', malSel ? 'true' : 'false');
        campo.setAttribute('aria-invalid', malUni ? 'true' : 'false');
        if (malSel) { sel.focus(); return; }
        if (malUni) { campo.focus(); return; }

        var lineas = [saludo];
        if (sel) lineas.push('Trabajo: ' + sel.value);
        lineas.push('Unidad: ' + unidad);
        abrirWhatsapp(lineas.join('\n') + ' ' + TAG_ORIGEN);
      });
      if (sel) sel.addEventListener('change', function () { errSel.hidden = true; sel.removeAttribute('aria-invalid'); });
      campo.addEventListener('input', function () { errUni.hidden = true; campo.removeAttribute('aria-invalid'); });

      $$('[data-cerrar]', panel).forEach(function (el) { el.addEventListener('click', cerrar); });
    }

    document.addEventListener('keydown', function (e) {
      if (!panel) return;
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
      if (e.key !== 'Tab') return;
      // El foco no se escapa del panel mientras esta abierto (aria-modal)
      var f = $$('button, select, input, a[href]', panel).filter(function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      if (!f.length) return;
      var ini = f[0], fin = f[f.length - 1];
      if (e.shiftKey && document.activeElement === ini) { e.preventDefault(); fin.focus(); }
      else if (!e.shiftKey && document.activeElement === fin) { e.preventDefault(); ini.focus(); }
    });

    /* Se registra ANTES que el oyente de medicion (al final del archivo), asi que
       stopImmediatePropagation lo frena: el toque que abre el panel NO cuenta conversion. */
    document.addEventListener('click', function (e) {
      var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
      if (!a || a.closest('.guia')) return;
      if (!esChat(a.getAttribute('href') || '')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      abrirPanel(a);
    }, true);
  })();

  /* ── 13. Asistente del sitio ───────────────────── */
  /* El taller atiende lunes a viernes de 8 a 15. Todas las tardes, las noches y
     los fines de semana el sitio recibe visitas y no hay nadie del otro lado.
     Este asistente contesta lo que ya esta publicado y empuja a WhatsApp.

     La clave de la IA NO esta aca: el navegador le habla a un intermediario en
     Cloudflare (asistente/worker.js) y ese guarda la clave. Es la SEGUNDA
     excepcion a "cero recursos externos", despues de la etiqueta de Google Ads.
     Si el intermediario no contesta, el asistente no se rompe: avisa y ofrece
     el WhatsApp de siempre. */
  (function () {
    var CEREBRO = 'https://eys-asistente.leandrobertainariver.workers.dev';

    var SALUDO = 'Hola. Soy el asistente de EyS. Puedo contarte qué trabajos hacemos, ' +
                 'dónde estamos y cómo seguir con tu consulta. ¿Qué necesitás?';

    var SUGERIDAS = [
      '¿Hacen colocación de tercer eje?',
      '¿Cuánto tardan?',
      '¿Dónde están?'
    ];

    /* Misma frase generica que los botones de la portada (G-018): abre WhatsApp
       directo, sin panel previo. */
    var WSP_LINK = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(
      'Hola, quiero consultar por un trabajo en mi unidad.'
    );

    var caja = null, lista = null, entrada = null, historia = [], esperando = false;

    /* Tope de 5 preguntas por visita (A-029, pedido de Leandro). Se cuenta en
       sessionStorage, asi que vale para toda la visita aunque se cierre el chat o se
       cambie de pagina; al cerrar el navegador vuelve a cero. Al llegar al tope, el
       chat deja de aceptar preguntas y queda el enlace de WhatsApp. */
    var TOPE = 5, usadasMem = 0;
    var AVISO_TOPE = 'Llegaste al máximo de 5 preguntas por visita. Para seguir, ' +
                     'escribinos por WhatsApp y te respondemos apenas abrimos ' +
                     '(lunes a viernes de 8 a 15).';
    function usadas() {
      try { return parseInt(sessionStorage.getItem('eys-chat-n'), 10) || 0; }
      catch (e) { return usadasMem; }
    }
    function sumarUsada() {
      usadasMem = usadas() + 1;
      try { sessionStorage.setItem('eys-chat-n', String(usadasMem)); } catch (e) {}
    }
    function cerrarEntrada() {
      if (!caja) return;
      var f = $('.chat__form', caja), s = $('.chat__sugeridas', caja);
      if (f) f.remove();
      if (s) s.remove();
      burbuja('asistente', AVISO_TOPE);
    }

    function nodoTexto(t) { return document.createTextNode(t); }

    function burbuja(quien, texto) {
      var d = document.createElement('div');
      d.className = 'chat__msg chat__msg--' + quien;
      /* Sin innerHTML: lo que vuelve de la IA se trata como texto, nunca como
         marcado. Asi no hay forma de que una respuesta inyecte nada en la pagina. */
      texto.split('\n').forEach(function (linea, i) {
        if (i) d.appendChild(document.createElement('br'));
        d.appendChild(nodoTexto(linea));
      });
      lista.appendChild(d);
      lista.scrollTop = lista.scrollHeight;
      return d;
    }

    function pensando() {
      var d = document.createElement('div');
      d.className = 'chat__msg chat__msg--asistente chat__msg--pensando';
      d.innerHTML = '<span></span><span></span><span></span>';
      lista.appendChild(d);
      lista.scrollTop = lista.scrollHeight;
      return d;
    }

    function preguntar(texto) {
      if (esperando || !texto) return;
      if (usadas() >= TOPE) { cerrarEntrada(); return; }
      sumarUsada();
      esperando = true;
      var sug = $('.chat__sugeridas', caja);
      if (sug) sug.remove();
      burbuja('yo', texto);
      historia.push({ rol: 'yo', texto: texto });
      entrada.value = '';
      var espera = pensando();

      fetch(CEREBRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: texto, history: historia.slice(0, -1) })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          espera.remove();
          var t = (d && d.reply) ||
                  'No pude contestarte ahora. Escribinos por WhatsApp y te respondemos ' +
                  'apenas abrimos (lunes a viernes de 8 a 15).';
          burbuja('asistente', t);
          historia.push({ rol: 'asistente', texto: t });
        })
        .catch(function () {
          espera.remove();
          burbuja('asistente',
            'Se me cortó la conexión. Escribinos por WhatsApp al 0341 685-5469 y ' +
            'te contestamos apenas abrimos.');
        })
        .then(function () {
          esperando = false;
          if (!caja) return;
          if (usadas() >= TOPE) cerrarEntrada();
          else entrada.focus();
        });
    }

    function cerrarChat() {
      if (!caja) return;
      caja.classList.remove('is-open');
      var c = caja;
      setTimeout(function () { if (c && c.parentNode) c.parentNode.removeChild(c); },
                 reduced ? 0 : 200);
      caja = null;
      var b = $('.chat-lanzador');
      if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    }

    function abrirChat() {
      if (caja) { cerrarChat(); return; }

      caja = document.createElement('div');
      caja.className = 'chat';
      caja.setAttribute('role', 'dialog');
      caja.setAttribute('aria-label', 'Asistente de EyS');

      var sug = '';
      for (var i = 0; i < SUGERIDAS.length; i++) {
        sug += '<button type="button" class="chat__sug">' + SUGERIDAS[i] + '</button>';
      }

      caja.innerHTML =
        '<div class="chat__barra">' +
          '<span class="chat__nombre">Asistente de EyS</span>' +
          '<button type="button" class="chat__x" aria-label="Cerrar">&times;</button>' +
        '</div>' +
        '<div class="chat__lista"></div>' +
        '<div class="chat__sugeridas">' + sug + '</div>' +
        '<form class="chat__form">' +
          '<input class="chat__entrada" type="text" autocomplete="off" ' +
                 'placeholder="Escribí tu consulta" aria-label="Tu consulta" maxlength="500">' +
          '<button type="submit" class="chat__enviar" aria-label="Enviar">&rarr;</button>' +
        '</form>' +
        '<a class="chat__wsp" href="' + WSP_LINK + '">o escribinos directo por WhatsApp</a>';

      document.body.appendChild(caja);
      lista   = $('.chat__lista', caja);
      entrada = $('.chat__entrada', caja);
      requestAnimationFrame(function () { if (caja) caja.classList.add('is-open'); });

      burbuja('asistente', SALUDO);
      historia.push({ rol: 'asistente', texto: SALUDO });

      $('.chat__x', caja).addEventListener('click', cerrarChat);
      $('.chat__form', caja).addEventListener('submit', function (e) {
        e.preventDefault();
        preguntar((entrada.value || '').trim());
      });
      $$('.chat__sug', caja).forEach(function (b) {
        b.addEventListener('click', function () { preguntar(b.textContent); });
      });

      var lanz = $('.chat-lanzador');
      if (lanz) lanz.setAttribute('aria-expanded', 'true');
      if (usadas() >= TOPE) { cerrarEntrada(); return; }
      setTimeout(function () { if (caja) entrada.focus(); }, reduced ? 0 : 220);
    }

    /* El boton flotante se arma desde aca: los 11 HTML no se tocan. */
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'chat-lanzador';
    boton.setAttribute('aria-expanded', 'false');
    boton.innerHTML = '<span class="chat-lanzador__txt">¿Dudas?</span>';
    boton.addEventListener('click', abrirChat);
    document.body.appendChild(boton);

    document.addEventListener('keydown', function (e) {
      if (caja && e.key === 'Escape') cerrarChat();
    });
  })();

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
    if (tipo !== 'telefono' && window.eysEnviarRef) window.eysEnviarRef();
    if (tipo === 'telefono') enviar(TEL, { value: 1.0, currency: 'ARS' });
    else if (tipo === 'formulario') enviar(FORM, { value: 1.0, currency: 'ARS' });
    else enviar(WSP);
  };

  // Un solo oyente cubre los 66 botones de WhatsApp y los 3 de telefono
  document.addEventListener('click', function (e) {
    var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    // El catalogo (wa.me/c/) abre una vidriera, no un chat: no es una conversion
    if (href.indexOf('wa.me') !== -1 && href.indexOf('wa.me/c/') === -1) window.eysConversion('whatsapp');
    else if (href.lastIndexOf('tel:', 0) === 0) window.eysConversion('telefono');
  }, true);

  /* ── Aviso de cookies (G-034) ───────────────────────────────────────────────
     Solo informa y se cierra: no bloquea la etiqueta de Google, que ya mide los anuncios.
     Recuerda el cierre con una marca en localStorage; si el navegador lo impide, se vuelve a ver. */
  (function () {
    var CLAVE = 'eys-aviso-cookies';
    try { if (localStorage.getItem(CLAVE) === '1') return; } catch (e) {}
    var caja = document.createElement('div');
    caja.className = 'aviso-cookies';
    caja.setAttribute('role', 'region');
    caja.setAttribute('aria-label', 'Aviso de cookies');
    caja.innerHTML = '<p>Usamos la etiqueta de Google Ads para medir los anuncios, y esa etiqueta puede guardar cookies. ' +
      '<a href="/politica-de-privacidad/">Más información</a>.</p><button type="button">Entendido</button>';
    function ajustar() { document.documentElement.style.setProperty('--aviso-h', (caja.offsetHeight + 8) + 'px'); }
    function cerrar() {
      try { localStorage.setItem(CLAVE, '1'); } catch (e) {}
      document.body.classList.remove('con-aviso');
      caja.parentNode && caja.parentNode.removeChild(caja);
    }
    caja.querySelector('button').addEventListener('click', cerrar);
    setTimeout(function () {
      document.body.appendChild(caja);
      document.body.classList.add('con-aviso');
      ajustar();
      requestAnimationFrame(function () { caja.classList.add('is-in'); });
      window.addEventListener('resize', ajustar, { passive: true });
    }, 1400);
  })();

  /* ── Comparador antes/después (G-041) ──────────────
     Sin JS quedan las dos fotos lado a lado. Con JS se superponen y la barra se mueve
     arrastrando, tocando la foto o con las flechas del teclado (un <input type="range">
     invisible, que es lo que leen los lectores de pantalla). */
  var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('[data-cmp]'), function (cmp) {
    var despues = cmp.querySelector('.cmp__fig--despues');
    if (!despues) return;
    // Arranca en 40 para que se lea entera la marca EyS estampada en el travesano.
    var MIN = 8, MAX = 92, INICIO = 40, pos = INICIO, cuadro = 0, usado = false;

    var rango = document.createElement('input');
    rango.type = 'range'; rango.min = MIN; rango.max = MAX; rango.step = 1; rango.value = INICIO;
    rango.className = 'cmp__rango';
    rango.setAttribute('aria-label', 'Comparar antes y después');
    var asa = document.createElement('span');
    asa.className = 'cmp__asa';
    asa.setAttribute('aria-hidden', 'true');
    asa.innerHTML = '<span class="cmp__perilla"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-5 6 5 6M15 6l5 6-5 6"/></svg></span>';
    cmp.appendChild(rango);
    cmp.appendChild(asa);
    cmp.classList.add('cmp--on');

    function pintar() {
      cuadro = 0;
      var recorte = 'inset(0 0 0 ' + pos + '%)';
      despues.style.webkitClipPath = recorte;
      despues.style.clipPath = recorte;
      asa.style.transform = 'translate3d(' + pos + '%,0,0)';
    }
    function poner(p, suave) {
      pos = Math.max(MIN, Math.min(MAX, p));
      cmp.classList.toggle('cmp--suave', !!suave);
      var n = Math.round(pos);
      rango.value = n;
      rango.setAttribute('aria-valuetext', 'Antes ' + n + ' %, después ' + (100 - n) + ' %');
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    }
    function enPorciento(x) {
      var r = cmp.getBoundingClientRect();
      return (x - r.left) / r.width * 100;
    }

    // Con el dedo no se mueve nada hasta que el gesto es claramente horizontal:
    // asi pasar la pagina hacia abajo por encima de la foto no corre la barra.
    var activo = false, movio = false, x0 = 0;
    cmp.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      activo = true; movio = false; x0 = e.clientX;
      if (e.pointerType === 'mouse') {
        e.preventDefault();
        movio = true; usado = true;
        try { cmp.setPointerCapture(e.pointerId); } catch (err) {}
        cmp.classList.add('cmp--arrastra');
        poner(enPorciento(e.clientX), false);
      }
    });
    cmp.addEventListener('pointermove', function (e) {
      if (!activo) return;
      if (!movio) {
        if (Math.abs(e.clientX - x0) < 6) return;
        movio = true; usado = true;
        try { cmp.setPointerCapture(e.pointerId); } catch (err) {}
        cmp.classList.add('cmp--arrastra');
      }
      poner(enPorciento(e.clientX), false);
    });
    function soltar(e) {
      if (!activo) return;
      activo = false;
      cmp.classList.remove('cmp--arrastra');
      // Un toque sin arrastrar lleva la barra hasta ahi.
      if (!movio && e.type === 'pointerup') { usado = true; poner(enPorciento(e.clientX), true); }
    }
    cmp.addEventListener('pointerup', soltar);
    cmp.addEventListener('pointercancel', soltar);
    rango.addEventListener('input', function () { usado = true; poner(+rango.value, true); });

    pintar();

    // Una sola vez, al entrar en pantalla: la barra va y vuelve para mostrar que se mueve.
    if (!sinMovimiento && 'IntersectionObserver' in window) {
      var aviso = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        aviso.disconnect();
        [[450, 68], [1250, 22], [2050, INICIO]].forEach(function (paso) {
          setTimeout(function () { if (!usado) poner(paso[1], true); }, paso[0]);
        });
      }, { threshold: 0.35 });
      aviso.observe(cmp);
    }
  });

})();
