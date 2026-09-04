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
  /* Antes esto colgaba de window.load, que espera a las 21 fotos de la portada: hasta
     4,5 segundos de pantalla en blanco para alguien con datos moviles en la ruta, que es
     el visitante tipico. La foto del hero tiene prioridad alta y esta lista mucho antes. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  } else {
    hidePreloader();
  }
  setTimeout(hidePreloader, 1500);

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

  /* ── 12. Paso previo a WhatsApp ────────────────── */
  /* Los botones mandaban a WhatsApp una plantilla con los renglones EN BLANCO
     ("Trabajo que necesito:", "Unidad (marca, modelo y año):") para que la
     persona los completara dentro de WhatsApp. Casi nadie lo hace: llega "hola"
     y el taller pierde el primer intercambio preguntando lo basico.
     Ahora esos datos se piden aca, en dos toques, y WhatsApp abre con el
     mensaje ya redactado. El que prefiere escribir el, tiene el enlace de
     siempre a un toque. Sin JavaScript, todo funciona como antes. */
  (function () {
    /* "Consulta general" va PRIMERA a proposito: ninguna opcion esta marcada, asi que
       el navegador deja la de arriba. Si ahi hubiera un trabajo concreto, todo el que
       pasa sin abrir el desplegable le manda al taller un trabajo que nunca pidio. */
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

    var panel = null, previo = null, enlace = null;

    /* El taller atiende lunes a viernes de 8 a 15: son 43 de las 168 horas de la semana.
       Prometerle a alguien "te contestamos mas rapido" un sabado a las 22:40 es mentira, y
       se lee como una burla. Fuera de hora la promesa honesta es otra, y es mejor: dejalo
       escrito y es lo primero que leemos el lunes. */
    function estaAbierto() {
      var d = new Date(), dia = d.getDay(), hora = d.getHours();
      return dia >= 1 && dia <= 5 && hora >= 8 && hora < 15;
    }

    function textoCabecera() {
      if (estaAbierto()) {
        return {
          titulo: 'Así te contestamos más rápido',
          bajada: 'Completá esto y WhatsApp se abre con el mensaje ya escrito. ' +
                  'El plazo y el presupuesto te los confirmamos viendo la unidad.'
        };
      }
      return {
        titulo: 'Dejanos esto y te contestamos apenas abrimos',
        bajada: 'Ahora el taller está cerrado. Completá esto y tu consulta es lo primero ' +
                'que leemos el próximo día hábil a las 8. El plazo y el presupuesto te los ' +
                'confirmamos viendo la unidad.'
      };
    }

    function textoDe(href) {
      var i = href.indexOf('text=');
      if (i === -1) return '';
      try { return decodeURIComponent(href.slice(i + 5).replace(/\+/g, ' ')); }
      catch (err) { return ''; }
    }

    /* El saludo del enlace ya dice de que trabajo se trata ("...consultar por
       la colocacion de un tercer eje"). Lo reusamos tal cual y descartamos los
       renglones vacios de la plantilla, que son los que venimos a reemplazar. */
    function saludoDe(texto) {
      var l = texto.split('\n');
      return (l[0] || 'Hola, quisiera hacer una consulta.').trim();
    }
    /* Solo se oculta el selector cuando el saludo YA nombra el servicio, que es lo que
       pasa en las 10 paginas internas ("...quisiera consultar por el tercer eje").
       Antes se miraba la plantilla, y el enlace del pie no la lleva: el panel no
       preguntaba el trabajo y el mensaje llegaba sin el. */
    function pideTrabajo(saludo) { return !/consultar por/i.test(saludo); }

    function cerrar() {
      if (!panel) return;
      panel.classList.remove('is-open');
      document.body.classList.remove("no-scroll");
      var p = panel;
      setTimeout(function () { if (p && p.parentNode) p.parentNode.removeChild(p); }, reduced ? 0 : 200);
      panel = null;
      if (previo && previo.focus) previo.focus();
    }

    /* Si el navegador bloquea la ventana (pasa siempre entrando desde Instagram o
       Facebook), antes el panel se cerraba, no pasaba nada, y la conversion se contaba
       igual: Google Ads optimizando hacia contactos que nunca ocurrieron. Ahora el panel
       se queda abierto con un enlace de verdad y la conversion NO se cuenta hasta que la
       persona lo toca. */
    function abrirWhatsapp(mensaje) {
      var url = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(mensaje);
      var v = window.open(url, '_blank', 'noopener');

      if (v) {
        if (window.eysConversion) window.eysConversion('whatsapp');
        cerrar();
        return;
      }

      var form = $('.guia__form', panel);
      if (form) form.hidden = true;
      var saltar = $('.guia__saltar', panel);
      if (saltar) saltar.hidden = true;

      var rescate = document.createElement('div');
      rescate.className = 'guia__rescate';
      rescate.innerHTML =
        '<p>Tu navegador no dejó abrir WhatsApp solo. Tocá acá y se abre con el ' +
        'mensaje ya escrito:</p>';
      var a = document.createElement('a');
      a.className = 'btn btn--wsp guia__enviar';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Abrir WhatsApp';
      a.addEventListener('click', function () {
        if (window.eysConversion) window.eysConversion('whatsapp');
        setTimeout(cerrar, 400);
      });
      rescate.appendChild(a);
      $('.guia__caja', panel).appendChild(rescate);
      a.focus();
    }

    function abrirPanel(a) {
      if (panel) return;
      previo = a;
      enlace = a.getAttribute('href') || '';
      var texto  = textoDe(enlace);
      var saludo = saludoDe(texto);
      var conSel = pideTrabajo(saludo);

      panel = document.createElement('div');
      panel.className = 'guia';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'Preparar la consulta de WhatsApp');

      var opciones = '';
      for (var i = 0; i < TRABAJOS.length; i++) {
        opciones += '<option value="' + TRABAJOS[i] + '">' + TRABAJOS[i] + '</option>';
      }

      panel.innerHTML =
        '<div class="guia__fondo" data-cerrar></div>' +
        '<div class="guia__caja">' +
          '<button type="button" class="guia__x" data-cerrar aria-label="Cerrar">&times;</button>' +
          '<p class="guia__titulo">' + textoCabecera().titulo + '</p>' +
          '<p class="guia__bajada">' + textoCabecera().bajada + '</p>' +
          '<form class="guia__form" novalidate>' +
            (conSel
              ? '<label class="guia__campo"><span>¿Qué trabajo necesitás?</span>' +
                '<select name="trabajo">' + opciones + '</select></label>'
              : '') +
            '<label class="guia__campo"><span>Unidad — marca, modelo y año</span>' +
              '<input name="unidad" type="text" autocomplete="off" placeholder="Ej.: Scania R450 2019" required></label>' +
            '<label class="guia__campo"><span>¿Algo más que quieras contarnos? <em>(opcional)</em></span>' +
              '<textarea name="detalle" rows="2" placeholder="Ej.: la uso para cereal, quiero sumar carga"></textarea></label>' +
            '<p class="guia__error" hidden>Escribinos al menos la marca y el modelo.</p>' +
            '<button type="submit" class="btn btn--wsp guia__enviar">Abrir WhatsApp con mi consulta</button>' +
          '</form>' +
          '<button type="button" class="guia__saltar">Prefiero escribir yo</button>' +
        '</div>';

      document.body.appendChild(panel);
      document.body.classList.add("no-scroll");
      /* Si el panel se abre y se cierra dentro del mismo cuadro de animacion,
         cerrar() ya vacio la variable y esto reventaba con un error de consola. */
      requestAnimationFrame(function () { if (panel) panel.classList.add('is-open'); });

      var form  = $('.guia__form', panel);
      var error = $('.guia__error', panel);
      var campo = $('[name="unidad"]', panel);
      setTimeout(function () { if (campo) campo.focus(); }, reduced ? 0 : 220);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var unidad = (campo.value || '').trim();
        if (unidad.length < 3) {
          error.hidden = false;
          campo.focus();
          return;
        }
        var sel     = $('[name="trabajo"]', panel);
        var detalle = ($('[name="detalle"]', panel).value || '').trim();

        var lineas = [saludo, ''];
        if (sel) lineas.push('Trabajo que necesito: ' + sel.value);
        lineas.push('Unidad: ' + unidad);
        if (detalle) { lineas.push(''); lineas.push(detalle); }
        abrirWhatsapp(lineas.join('\n'));
      });

      campo.addEventListener('input', function () { error.hidden = true; });

      $('.guia__saltar', panel).addEventListener('click', function () {
        window.open(enlace, '_blank', 'noopener');
        if (window.eysConversion) window.eysConversion('whatsapp');
        cerrar();
      });

      $$('[data-cerrar]', panel).forEach(function (el) {
        el.addEventListener('click', cerrar);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (panel && e.key === 'Escape') cerrar();
    });

    /* Este oyente se registra ANTES que el de medicion (que vive en el IIFE de
       abajo), asi que stopImmediatePropagation lo frena: la conversion NO se
       cuenta al abrir el panel, solo cuando WhatsApp abre de verdad. Si se
       contara el toque, Google Ads optimizaria con conversiones que no pasaron. */
    document.addEventListener('click', function (e) {
      var a = (e.target && e.target.closest) ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('wa.me') === -1) return;
      if (a.closest('.guia')) return;
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

    /* El enlace generico de siempre. Al tocarlo lo agarra la seccion 12 y abre
       el panel que pide trabajo y unidad, asi que el mensaje sale completo. */
    var WSP_LINK = 'https://wa.me/' + WSP_NUMBER + '?text=' + encodeURIComponent(
      'Hola, quisiera hacer una consulta.\n\nTrabajo que necesito: \nUnidad (marca, modelo y año): '
    );

    var caja = null, lista = null, entrada = null, historia = [], esperando = false;

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
        .then(function () { esperando = false; entrada.focus(); });
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
      setTimeout(function () { entrada.focus(); }, reduced ? 0 : 220);
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
