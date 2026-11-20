/* United for Sports – kleine Helfer, ohne externe Bibliotheken */
(function () {
  var doc = document.documentElement;
  var area = doc.dataset.area || 'home';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  doc.classList.add('js');

  /* ---------- Hell / Dunkel ---------- */
  var KEY = 'u4s-theme-' + area;
  var tgl = document.querySelector('.tgl');
  var meta = document.querySelector('meta[name="theme-color"]');

  function syncToggle() {
    var light = doc.dataset.theme === 'light';
    if (tgl) {
      tgl.setAttribute('aria-pressed', light ? 'true' : 'false');
      tgl.setAttribute('aria-label', light ? 'Dunkles Design einschalten' : 'Helles Design einschalten');
    }
    if (meta) meta.setAttribute('content', getComputedStyle(doc).getPropertyValue('--bg').trim() || '#14161a');
  }
  function setTheme(t) {
    doc.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch (e) {}
    syncToggle();
  }
  syncToggle();

  if (tgl) {
    tgl.addEventListener('click', function () {
      var next = doc.dataset.theme === 'light' ? 'dark' : 'light';
      if (!document.startViewTransition || reduce) { setTheme(next); return; }
      var r = tgl.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      doc.classList.add('theme-vt');
      var vt = document.startViewTransition(function () { setTheme(next); });
      vt.ready.then(function () {
        doc.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
      vt.finished.then(function () { doc.classList.remove('theme-vt'); });
    });
  }

  /* ---------- Überschriften Wort für Wort (letzte Wörter farbig) ---------- */
  document.querySelectorAll('.split').forEach(function (h) {
    var text = h.textContent.trim();
    var words = text.split(/\s+/);
    var acc = parseInt(h.dataset.acc || '0', 10);
    h.setAttribute('aria-label', text);
    h.textContent = '';
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--i', i);
      if (acc && i >= words.length - acc) inner.className = 'acc';
      outer.appendChild(inner);
      h.appendChild(outer);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Kopfzeile, Lesefortschritt, Parallaxe, Nach-oben ---------- */
  var hdr = document.querySelector('.hdr');
  var bar = document.querySelector('.progress');
  var media = document.querySelector('.hero .hero-media, .phero .hero-media');
  var top = document.querySelector('.totop');
  var pars = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  var RING = 138.2;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = doc.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, y / max) : 0;
    if (hdr) hdr.classList.toggle('is-scrolled', y > 8);
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (top) {
      top.classList.toggle('show', y > innerHeight * 0.8);
      top.style.setProperty('--ring', (RING * (1 - p)).toFixed(1));
    }
    if (media && !reduce && y < innerHeight * 1.2) media.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
    for (var i = 0; i < pars.length; i++) {
      var r = pars[i].getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) continue;
      var off = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1 … 1
      pars[i].style.setProperty('--py', (off * -7).toFixed(2) + '%');
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Inhalte sanft einblenden ---------- */
  var items = document.querySelectorAll('.rv, .split');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  if (!reduce && fine) {
    /* ---------- Lichtkegel, der der Maus folgt ---------- */
    document.querySelectorAll('[data-spot]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });

    /* ---------- Karten neigen sich zur Maus ---------- */
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = el.classList.contains('hcard') ? 5 : 4;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('is-tilting');
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' + (px * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
      });
    });

    /* ---------- Haupt-Buttons ziehen leicht zur Maus ---------- */
    document.querySelectorAll('.btn--accent:not(.btn--sm), .btn--orange:not(.btn--main), .btn--cyan:not(.btn--main), .btn--dark').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
        b.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () {
        b.style.removeProperty('--tx');
        b.style.removeProperty('--ty');
      });
    });
  }

  /* ---------- E-Mail-Adressen erst im Browser zusammensetzen (Spam-Schutz) ---------- */
  document.querySelectorAll('.js-mail').forEach(function (el) {
    var addr = el.textContent.replace(/\s*\[at\]\s*/i, '@').trim();
    var a = document.createElement('a');
    a.href = 'mailto:' + addr;
    a.textContent = addr;
    el.replaceWith(a);
  });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Trikot-Vorschau (Teamsport) ---------- */
  var jersey = document.querySelector('.jersey');
  if (jersey) {
    var nameIn = document.getElementById('j-name-in');
    var numIn = document.getElementById('j-num-in');
    var nameOut = jersey.querySelector('.j-name');
    var numOut = jersey.querySelector('.j-num');

    var pop = function (el) {
      if (reduce) return;
      el.classList.remove('pop');
      void el.getBBox();
      el.classList.add('pop');
    };
    var setName = function () {
      var v = nameIn.value.replace(/[^A-Za-zÄÖÜäöüß .\-']/g, '').slice(0, 14);
      if (nameIn.value !== v) nameIn.value = v;
      var text = v.trim().toUpperCase() || 'NAME';
      nameOut.textContent = text;
      nameOut.style.fontSize = (text.length <= 8 ? 30 : Math.max(17, Math.round(30 * 8 / text.length))) + 'px';
    };
    var setNum = function () {
      var v = numIn.value.replace(/\D/g, '').slice(0, 2);
      if (numIn.value !== v) numIn.value = v;
      var next = v === '' ? '10' : v;
      if (numOut.textContent !== next) { numOut.textContent = next; pop(numOut); }
    };
    nameIn.addEventListener('input', setName);
    numIn.addEventListener('input', setNum);
    setName(); setNum();

    document.querySelectorAll('.sw').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.sw').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        jersey.style.setProperty('--jf', btn.dataset.fill);
        jersey.style.setProperty('--jt', btn.dataset.text);
        jersey.style.setProperty('--jk', btn.dataset.trim || '#2ad4e5');
        pop(numOut);
      });
    });
  }
})();
