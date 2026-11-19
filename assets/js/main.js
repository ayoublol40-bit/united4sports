/* United for Sports – kleine Helfer, ohne externe Bibliotheken */
(function () {
  var doc = document.documentElement;
  var area = doc.dataset.area || 'home';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (meta) meta.setAttribute('content', getComputedStyle(doc).getPropertyValue('--bg').trim() || '#0b0c0e');
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
      document.startViewTransition(function () { setTheme(next); }).ready.then(function () {
        doc.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
    });
  }

  /* ---------- Überschriften Wort für Wort ---------- */
  document.querySelectorAll('.split').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.textContent = '';
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.textContent = w;
      inner.style.setProperty('--i', i);
      outer.appendChild(inner);
      h.appendChild(outer);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Kopfzeile, Lesefortschritt, Parallaxe ---------- */
  var hdr = document.querySelector('.hdr');
  var bar = document.querySelector('.progress');
  var media = document.querySelector('.hero .hero-media, .phero .hero-media');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-scrolled', y > 8);
    if (bar) {
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    if (media && !reduce && y < innerHeight * 1.2) media.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Inhalte sanft einblenden ---------- */
  var items = document.querySelectorAll('.rv');
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

  /* ---------- Lichtkegel, der der Maus folgt ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
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
