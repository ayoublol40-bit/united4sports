/* UNITED4SPORTS – gemeinsame Funktionen für alle Seiten */
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Jahr im Footer */
  $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* E-Mail-Adresse erst im Browser zusammensetzen (Spam-Schutz wie auf der alten Seite) */
  var mail = "detmold" + String.fromCharCode(64) + "united4sports.com";
  $$(".js-mail").forEach(function (el) {
    var a = document.createElement("a");
    a.href = "mai" + "lto:" + mail;
    a.textContent = mail;
    if (el.dataset.class) a.className = el.dataset.class;
    el.replaceWith(a);
  });
  $$(".js-mail-btn").forEach(function (el) { el.href = "mai" + "lto:" + mail; });

  /* Header-Schatten + Nach-oben-Button */
  var header = $(".header"), toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobiles Menü */
  var btn = $(".menu-btn"), mnav = $("#mobile-nav");
  function setMenu(open) {
    if (!btn) return;
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    mnav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (btn) {
    btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 960) setMenu(false); });
  }

  /* Slider (Kundenstimmen) */
  var slider = $(".slider");
  if (slider) {
    var bar = $(".slider-progress i");
    var step = function () { var c = $(".quote", slider); return c ? c.getBoundingClientRect().width + 16 : 300; };
    $(".js-prev").addEventListener("click", function () { slider.scrollBy({ left: -step(), behavior: "smooth" }); });
    $(".js-next").addEventListener("click", function () { slider.scrollBy({ left: step(), behavior: "smooth" }); });
    var progress = function () {
      var max = slider.scrollWidth - slider.clientWidth, vis = slider.clientWidth / slider.scrollWidth;
      var p = max > 0 ? slider.scrollLeft / max : 1;
      if (bar) bar.style.width = (vis + (1 - vis) * p) * 100 + "%";
    };
    slider.addEventListener("scroll", progress, { passive: true }); window.addEventListener("resize", progress); progress();
  }

  /* Bild-Großansicht */
  var zooms = $$(".zoom");
  if (zooms.length && window.HTMLDialogElement) {
    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Bildansicht");
    dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><p></p>';
    document.body.appendChild(dlg);
    var dCap = $("p", dlg), dImg = document.createElement("img");
    dlg.insertBefore(dImg, dCap);
    zooms.forEach(function (z) {
      z.addEventListener("click", function () {
        var img = $("img", z);
        dImg.src = z.dataset.full || img.currentSrc || img.src;
        dImg.alt = img.alt;
        dCap.textContent = img.alt;
        dlg.showModal();
      });
    });
    $(".lb-close", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* Leistungen: Sprungmenü markiert aktuellen Bereich */
  var chips = $$(".chips a");
  if (chips.length && "IntersectionObserver" in window) {
    var map = {};
    chips.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chips.forEach(function (a) { a.classList.remove("active"); });
        var a = map[en.target.id];
        if (a) {
          a.classList.add("active");
          var ul = a.closest("ul");
          ul.scrollTo({ left: a.offsetLeft - ul.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Kontaktformular – gleiche Logik wie bisher (FormMail + Spam-Falle "automarke") */
  var form = $("#kontaktformular");
  if (form) {
    form.addEventListener("submit", function (e) {
      var err = $(".form-error", form);
      var hp = form.elements["automarke"];
      if (hp && hp.value) { e.preventDefault(); form.action = "https://www.zyx-pech.de/mis.html"; return; }
      if (!form.checkValidity()) {
        e.preventDefault();
        if (err) { err.classList.add("show"); }
        var first = form.querySelector(":invalid");
        if (first) first.focus();
        return;
      }
      form.action = "https://www.united4sports.com/cgi-bin/FormMail.pl";
    });
  }

  /* ---------- GSAP-Animationen ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var ease = "power3.out";

    if ($(".hero h1 .line")) {
      gsap.timeline({ defaults: { ease: ease } })
        .from(".hero .hero-media img", { scale: 1.12, duration: 1.8, ease: "power2.out" }, 0)
        .from(".hero .eyebrow", { y: 16, autoAlpha: 0, duration: .6 }, .15)
        .from(".hero h1 .line > span", { yPercent: 105, duration: .9, stagger: .1 }, .25)
        .from(".hero .lead", { y: 20, autoAlpha: 0, duration: .7 }, .7)
        .from(".hero-actions", { y: 20, autoAlpha: 0, duration: .7 }, .82)
        .from(".js-fact", { y: 24, autoAlpha: 0, duration: .7, stagger: .1 }, .95);
    }
    if ($(".page-hero")) {
      gsap.timeline({ defaults: { ease: ease } })
        .from(".page-hero .hero-media img", { scale: 1.1, duration: 1.6, ease: "power2.out" }, 0)
        .from(".page-hero .crumbs, .page-hero .eyebrow", { y: 14, autoAlpha: 0, duration: .6 }, .1)
        .from(".page-hero h1", { y: 36, autoAlpha: 0, duration: .9 }, .2)
        .from(".page-hero .lead", { y: 20, autoAlpha: 0, duration: .7 }, .45);
    }
    if ($(".status")) {
      gsap.from(".status .wrap > *", { y: 24, autoAlpha: 0, duration: .8, ease: ease, stagger: .1 });
    }
    $$(".hero, .page-hero").forEach(function (h) {
      var img = $(".hero-media img", h);
      if (img) gsap.to(img, { yPercent: 10, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
    });

    $$(".js-reveal").forEach(function (el) {
      gsap.from(el, { y: 32, autoAlpha: 0, duration: .9, ease: ease, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    ScrollTrigger.batch(".js-card", { start: "top 90%", once: true, onEnter: function (els) { gsap.from(els, { y: 40, autoAlpha: 0, duration: .8, ease: ease, stagger: .1 }); } });
    ScrollTrigger.batch(".js-logo, .gallery > *", { start: "top 92%", once: true, onEnter: function (els) { gsap.from(els, { y: 24, autoAlpha: 0, duration: .6, ease: ease, stagger: .06 }); } });
    $$(".block-num").forEach(function (n) {
      gsap.from(n, { xPercent: -12, autoAlpha: 0, duration: 1, ease: ease, scrollTrigger: { trigger: n, start: "top 85%", once: true } });
    });
    $$(".post").forEach(function (p) {
      gsap.from(p, { y: 40, autoAlpha: 0, duration: .9, ease: ease, scrollTrigger: { trigger: p, start: "top 85%", once: true } });
    });
    if ($(".quote")) {
      gsap.from(".quote", { x: 60, autoAlpha: 0, duration: .9, ease: ease, stagger: .08, scrollTrigger: { trigger: ".slider", start: "top 85%", once: true } });
    }
  });
});
