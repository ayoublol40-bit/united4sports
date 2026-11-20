// Baut die statischen Seiten von United for Sports.
// Aufruf:  node _build/build.js   (im Projektordner)
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(__dirname, '..');
const SCR = __dirname;
const SHOP = 'https://shop.unitedforsports.com';
const DOMAIN = 'https://unitedforsports.com';

const I = {
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
  up: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  ext: '<path d="M7 17 17 7M9 7h8v8"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  talk: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.2c.6-.1 1.3-.2 2-.2 2.8 0 5 2.2 5 5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  hand: '<path d="M3 12h4l3-3h4a2 2 0 0 1 0 4h-3M7 12v6h9l5-5-1.5-1.5L16 14"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  shirt: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c-.3 1.7-1.9 3-4 3s-3.7-1.3-4-3z"/>',
  number: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3c-.3 1.7-1.9 3-4 3s-3.7-1.3-4-3z"/><path d="M10.5 12.5 12 11.5v6"/>',
  jacket: '<path d="M8 3 3 6l1 13h4V9M16 3l5 3-1 13h-4V9"/><path d="M8 3c.5 1.5 2 2.5 4 2.5S15.5 4.5 16 3M12 5.5V21M8 21h8"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="m12 7.5 3.8 2.8-1.5 4.4H9.7l-1.5-4.4zM12 3v4.5M15.8 10.3l4.6-1.6M14.3 14.7l2.8 4M9.7 14.7l-2.8 4M8.2 10.3 3.6 8.7"/>',
  glove: '<path d="M7 21v-5L4.5 12a1.6 1.6 0 0 1 2.6-1.8L8 11.5V5a1.5 1.5 0 0 1 3 0v5V3.8a1.5 1.5 0 0 1 3 0V10V5a1.5 1.5 0 0 1 3 0v6l.6-1.5a1.5 1.5 0 0 1 2.8 1L19 16v5z"/>',
  bag: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2M3 13h18"/>',
  flag: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

const LOGO_SM = { src: 'assets/brand/u4s-logo-sportmanagement.jpg', w: 1600, h: 697, alt: 'United4Sports.com Sportmanagement' };
const LOGO_TS = { src: 'assets/brand/u4s-logo-teamsport.jpg', w: 568, h: 152, alt: 'United4Sports – 100 % Teamsport' };
const plate = (l, cls, eager) => `<figure class="plate ${cls}"><img src="${l.src}" width="${l.w}" height="${l.h}" alt="${l.alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}></figure>`;

const extAttrs = `href="${SHOP}" target="_blank" rel="noopener"`;
const extHint = '<span class="vh"> (externer Shop, öffnet in neuem Tab)</span>';

function head({ title, desc, canon, area, theme = 'dark' }) {
  return `<!doctype html>
<html lang="de" data-area="${area}" data-theme="${theme}">
<head>
<script>try{var t=localStorage.getItem('u4s-theme-${area}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${DOMAIN}${canon}">
<meta name="theme-color" content="#14161a">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="United for Sports">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preload" href="assets/fonts/barlowc-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/main.js" defer></script>
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>`;
}

function header(active, cta) {
  const cur = (k) => (active === k ? ' aria-current="page"' : '');
  return `
<header class="hdr">
  <div class="wrap hdr-in">
    <a class="wm" href="index.html" aria-label="United for Sports – zur Startseite"><span class="wm-bar" aria-hidden="true"><i></i><i></i></span><span><b>United</b> for Sports</span></a>
    <nav class="nav" aria-label="Hauptnavigation">
      <a class="n-sm" href="sportmanagement.html"${cur('sm')}>Sportmanagement</a>
      <a class="n-ts" href="teamsport.html"${cur('ts')}>Teamsport</a>
      <a class="n-ab" href="ueber-uns.html"${cur('ab')}>Über uns</a>
    </nav>
    <button class="tgl" type="button" aria-pressed="false" aria-label="Helles Design einschalten">${ic('sun', 'i-sun')}${ic('moon', 'i-moon')}</button>
    ${cta}
  </div>
  <div class="progress" aria-hidden="true"></div>
</header>`;
}

const ticker = (words, mode) => {
  const dot = (i) => (mode === 'duo' ? `<i class="${i % 2 ? 'c' : 'o'}"></i>` : '<i></i>');
  const run = words.map((w, i) => `<span${i % 2 ? ' class="o"' : ''}>${w}</span>${dot(i)}`).join('');
  return `
  <div class="ticker" aria-hidden="true"><div class="ticker-track">${run}${run}${run}${run}</div></div>`;
};

const footer = `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div class="ftr-brand">
        <a class="wm" href="index.html" aria-label="United for Sports – zur Startseite"><span class="wm-bar" aria-hidden="true"><i></i><i></i></span><span><b>United</b> for Sports</span></a>
        <p>Sportmanagement und Teamsport unter einer gemeinsamen Marke.</p>
      </div>
      <nav aria-labelledby="f-areas">
        <h2 id="f-areas">Bereiche</h2>
        <ul>
          <li><a href="sportmanagement.html" style="--c:var(--orange)"><span class="dot"></span>Sportmanagement</a></li>
          <li><a href="teamsport.html" style="--c:var(--cyan)"><span class="dot"></span>Teamsport</a></li>
          <li><a ${extAttrs}>Teamsport-Shop ${ic('ext')}${extHint}</a></li>
        </ul>
      </nav>
      <nav aria-labelledby="f-co">
        <h2 id="f-co">Unternehmen</h2>
        <ul>
          <li><a href="ueber-uns.html">Über uns</a></li>
          <li><a href="ueber-uns.html#team">Team</a></li>
          <li><a href="kontakt.html">Kontakt</a></li>
        </ul>
      </nav>
      <div>
        <h2>Kontakt</h2>
        <ul>
          <li><span class="ph">[Telefonnummer]</span></li>
          <li><span class="ph">[E-Mail-Adresse]</span></li>
          <li><span class="ph">[Anschrift]</span></li>
        </ul>
      </div>
      <nav aria-labelledby="f-legal">
        <h2 id="f-legal">Rechtliches</h2>
        <ul>
          <li><a href="impressum.html">Impressum</a></li>
          <li><a href="datenschutz.html">Datenschutz</a></li>
        </ul>
      </nav>
    </div>
    <div class="ftr-base">
      <span>&copy; <span data-year>2026</span> United for Sports</span>
      <span>unitedforsports.com</span>
    </div>
  </div>
</footer>
<a class="totop" href="#inhalt" aria-label="Nach oben"><svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><circle class="ring-p" cx="24" cy="24" r="22"/></svg>${ic('up')}</a>
</body>
</html>
`;

const ctaContact = (href = 'kontakt.html') => `<a class="btn btn--ghost btn--sm hdr-cta" href="${href}">Kontakt</a>`;

/* Kontakt-Band für die Bereichsseiten */
const band = (k, title, text, subj) => `
  <section class="band" id="kontakt" aria-labelledby="k-title">
    <div class="wrap band-grid">
      <div>
        <p class="eyebrow">${k}</p>
        <h2 id="k-title" class="split">${title}</h2>
        <p>${text}</p>
      </div>
      <div>
        <dl>
          <div><dt>Telefon</dt><dd><span class="ph">[Telefonnummer folgt]</span></dd></div>
          <div><dt>E-Mail</dt><dd><span class="ph">[E-Mail-Adresse folgt]</span></dd></div>
        </dl>
        <a class="btn btn--dark" href="mailto:?subject=${subj}">E-Mail schreiben ${ic('arrow', 'ic-arrow')}</a>
      </div>
    </div>
  </section>`;

/* ======================= STARTSEITE ======================= */
const index = head({
  title: 'United for Sports – Sportmanagement und Teamsport',
  desc: 'United for Sports ist Ihr Partner rund um Sport, Vereine und Teams: Sportmanagement mit Beratung, Sportmarketing und Sponsoring sowie Teamsportausrüstung mit persönlichem Service.',
  canon: '/', area: 'home',
}) + header('', ctaContact()) + `
<main id="inhalt">
  <section class="hero" aria-labelledby="h-title">
    <div class="hero-media"><img src="assets/header/spiel-d-zagreb-rosenborg-cl-quali-2019-08-21.jpg" width="1490" height="551" alt="" fetchpriority="high"></div>
    <div class="wrap hero-in">
      <p class="eyebrow rv">Sportmanagement · Teamsport</p>
      <h1 id="h-title" class="split" data-acc="3">Ein Partner für Sport, Vereine und Teams.</h1>
      <p class="lead rv" style="--d:.16s">United for Sports bündelt Beratung, Sportmarketing und Sponsoring mit Teamsportausrüstung und persönlichem Service – unter einer gemeinsamen Marke.</p>
      <div class="duo rv" style="--d:.22s" aria-hidden="true"><i></i><i></i></div>
      <nav class="hx rv" style="--d:.28s" aria-label="Schnellwahl Bereiche">
        <a href="sportmanagement.html"><span class="hx-n">01</span><span class="hx-t">Sportmanagement</span><span class="hx-s">Beratung · Sportmarketing · Sponsoring</span>${ic('arrow')}</a>
        <a href="teamsport.html"><span class="hx-n">02</span><span class="hx-t">Teamsport</span><span class="hx-s">Fußball · Ausrüstung · Namen &amp; Nummern</span>${ic('arrow')}</a>
      </nav>
    </div>
  </section>
${ticker(['Sportmanagement', 'Teamsport', 'Beratung', 'Fußball', 'Sponsoring', 'Namen &amp; Nummern'], 'duo')}

  <section class="sec" id="bereiche" aria-labelledby="b-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Unsere Bereiche</p>
          <h2 id="b-title" class="split">Zwei Bereiche. Eine Marke.</h2>
        </div>
        <p class="rv">Sportmanagement und Teamsport sind klar getrennt und doch aus einer Hand. Wählen Sie den Bereich, der zu Ihrem Anliegen passt.</p>
      </div>
      <div class="split-tiles">
        <article class="tile tile--sm rv" aria-labelledby="t-sm">
          <div class="tile-media"><img src="assets/header/allianz-arena-2.jpg" width="1490" height="551" alt="" loading="lazy"></div>
          ${plate(LOGO_SM, 'plate--sm')}
          <div>
            <p class="tile-k">Bereich 01</p>
            <h3 id="t-sm">Sportmanagement</h3>
            <p>Beratung für Vereine, Sportmarketing und Sponsoring – für Vereine, die sich gut aufstellen und sichtbarer werden wollen.</p>
            <ul class="tags"><li>Beratung</li><li>Sportmarketing</li><li>Sponsoring</li></ul>
            <div class="tile-act">
              <a class="btn btn--orange btn--main" href="sportmanagement.html">Zum Sportmanagement ${ic('arrow', 'ic-arrow')}</a>
            </div>
          </div>
        </article>
        <article class="tile tile--ts rv" style="--d:.1s" aria-labelledby="t-ts">
          <div class="tile-media"><img src="assets/header/stadion-kabine-vfb-fichte-bielefeld.jpg" width="1490" height="551" alt="" loading="lazy"></div>
          ${plate(LOGO_TS, 'plate--ts')}
          <div>
            <p class="tile-k">Bereich 02</p>
            <h3 id="t-ts">Teamsport</h3>
            <p>Fußball- und Teamsportausrüstung mit persönlichem Service – individuell veredelt mit Namen, Nummern und Vereinslogo.</p>
            <ul class="tags"><li>Fußball</li><li>Teamsportausrüstung</li><li>Individualisierung</li></ul>
            <div class="tile-act">
              <a class="btn btn--cyan btn--main" href="teamsport.html">Zum Teamsport ${ic('arrow', 'ic-arrow')}</a>
              <a class="tile-sub" ${extAttrs}>Teamsport-Shop ${ic('ext')}${extHint}</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="sec sec--alt" aria-labelledby="a-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Für wen</p>
          <h2 id="a-title" class="split">Für Vereine, Sportler und Unternehmen.</h2>
        </div>
        <p class="rv">Unterschiedliche Anliegen, eine Anlaufstelle – und der passende Bereich für jedes Thema.</p>
      </div>
      <ul class="aud">
        <li class="rv" data-spot><span class="aud-ic">${ic('flag')}</span><h3>Vereine</h3><p>Beratung, Vermarktung und Ausrüstung für Vorstand, Abteilungen und Mannschaften.</p></li>
        <li class="rv" data-spot style="--d:.08s"><span class="aud-ic">${ic('user')}</span><h3>Sportler</h3><p>Teamsportausrüstung mit persönlicher Beratung und individueller Veredelung.</p></li>
        <li class="rv" data-spot style="--d:.16s"><span class="aud-ic">${ic('hand')}</span><h3>Unternehmen</h3><p>Sponsoring-Partnerschaften und Präsenz im Sport – passend zu Ihrer Marke.</p></li>
      </ul>
    </div>
  </section>

  <section class="sec teaser" aria-labelledby="u-title">
    <div class="wrap teaser-grid">
      <div class="teaser-faces rv" aria-hidden="true">
        <span class="face f1">${ic('user')}</span>
        <span class="face f2">${ic('user')}</span>
        <span class="face f3">${ic('user')}</span>
        <span class="face-ring"></span>
      </div>
      <div>
        <p class="eyebrow rv">Über uns</p>
        <h2 id="u-title" class="split">Menschen statt Warteschleife.</h2>
        <p class="lead rv">Bei United for Sports haben Sie feste Ansprechpartner – im Sportmanagement wie im Teamsport. Lernen Sie uns kennen.</p>
        <div class="actions rv">
          <a class="btn btn--line" href="ueber-uns.html">Über uns ${ic('arrow', 'ic-arrow')}</a>
          <a class="btn btn--ghost" href="ueber-uns.html#team">Zum Team</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec contact" id="kontakt" aria-labelledby="k-title">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow rv">Kontakt</p>
        <h2 id="k-title" class="split">Sprechen wir über Ihr Vorhaben.</h2>
        <p class="lead rv">Ob Vereinsberatung, Sponsoring oder Ausrüstung für die ganze Mannschaft: Schreiben Sie uns oder rufen Sie an.</p>
        <p class="rv" style="margin-top:1.5rem"><a class="tlink" href="kontakt.html">Alle Kontaktwege ${ic('arrow')}</a></p>
      </div>
      <div class="cbox rv" style="--d:.1s" data-spot>
        <dl class="clist">
          <div class="crow"><span class="cic">${ic('phone')}</span><div><dt>Telefon</dt><dd><span class="ph">[Telefonnummer folgt]</span></dd></div></div>
          <div class="crow"><span class="cic">${ic('mail')}</span><div><dt>E-Mail</dt><dd><span class="ph">[E-Mail-Adresse folgt]</span></dd></div></div>
          <div class="crow"><span class="cic">${ic('pin')}</span><div><dt>Anschrift</dt><dd><span class="ph">[Straße, PLZ Ort]</span></dd></div></div>
        </dl>
        <p class="cbox-k">Anfrage per E-Mail zu</p>
        <div class="cbox-act">
          <a class="btn btn--line btn--sm" style="--c:var(--orange-t)" href="mailto:?subject=Anfrage%20Sportmanagement">Sportmanagement</a>
          <a class="btn btn--line btn--sm" style="--c:var(--cyan-t)" href="mailto:?subject=Anfrage%20Teamsport">Teamsport</a>
        </div>
      </div>
    </div>
  </section>
</main>` + footer;

/* ======================= SPORTMANAGEMENT ======================= */
const feats = [
  {
    id: 'beratung', n: '01', img: 'assets/header/stadion-lfc.jpg', w: 1490, h: 551, pos: '50% 40%',
    alt: 'Blick über ein leeres Fußballstadion von der Tribüne aus',
    t: 'Beratung für Vereine',
    p: 'Wir unterstützen Vorstände und Abteilungen bei Fragen rund um Organisation, Struktur und Weiterentwicklung des Vereins.',
    ticks: ['Vereinsorganisation und Strukturen', 'Planung von Projekten und Veranstaltungen', 'Begleitung von Vorstand und Abteilungen'],
  },
  {
    id: 'marketing', n: '02', img: 'assets/header/allianz-arena-3.jpg', w: 1490, h: 551, pos: '62% 40%',
    alt: 'Beleuchtete Fassade eines Stadions bei Nacht',
    t: 'Sportmarketing',
    p: 'Wir helfen Vereinen, ihren Auftritt zu schärfen und ihre Themen nach außen zu tragen – vor Ort, in der Presse und online.',
    ticks: ['Vereinsauftritt und Kommunikation', 'Presse- und Öffentlichkeitsarbeit', 'Social Media und Werbemittel'],
  },
  {
    id: 'sponsoring', n: '03', img: 'assets/fotos/werbebanden/werbebandensystem-istrup-1.jpg', w: 657, h: 277, pos: '50% 50%',
    alt: 'Werbebanden mit Sponsorenlogos an einem Fußballplatz',
    t: 'Sponsoring',
    p: 'Wir entwickeln Sponsoring-Konzepte, die für Verein und Partner gleichermaßen funktionieren, und begleiten die Zusammenarbeit.',
    ticks: ['Sponsoring-Konzepte und Partnerpakete', 'Ansprache möglicher Sponsoren', 'Werbeflächen wie Banden und Trikots', 'Betreuung bestehender Partnerschaften'],
  },
];
const featHtml = feats.map((f, i) => `
        <article class="feat" id="${f.id}" aria-labelledby="f-${f.id}">
          <figure class="feat-media rv" data-par><img src="${f.img}" width="${f.w}" height="${f.h}" alt="${f.alt}" loading="lazy" style="object-position:${f.pos}"><span class="feat-n" aria-hidden="true">${f.n}</span></figure>
          <div class="feat-body">
            <p class="feat-k rv">Leistung ${f.n}</p>
            <h3 id="f-${f.id}" class="split">${f.t}</h3>
            <p class="rv">${f.p}</p>
            <ul class="ticks rv" style="--d:.1s">${f.ticks.map((t) => `<li>${t}</li>`).join('')}</ul>
          </div>
        </article>`).join('');

const mosaic = [
  ['assets/fotos/werbebanden/werbebandensystem-istrup-2.jpg', 657, 277, 'Werbebanden an einem Sportplatz', 'Werbeflächen', 'wide'],
  ['assets/fotos/fanartikel/fanartikel-karten.jpg', 460, 345, 'Bedruckte Karten als Fanartikel', 'Werbemittel', ''],
  ['assets/fotos/fanartikel/fanartikel-laserarbeiten-bierglaeser-kaffeetasse.jpg', 460, 460, 'Gläser und Tasse mit Lasergravur', 'Fanartikel', 'tall'],
  ['assets/fotos/werbebanden/werbebandensystem-bruentrup.jpg', 800, 443, 'Werbebandensystem an einem Sportplatz', 'Bandensysteme', ''],
  ['assets/fotos/fanartikel/sgib-fanshirt.jpg', 460, 345, 'Bedrucktes Fanshirt eines Vereins', 'Vereinsauftritt', ''],
  ['assets/fotos/fanartikel/fcl-fanshirt.jpg', 460, 460, 'Bedrucktes Fanshirt', 'Fanshirts', ''],
].map(([src, w, h, alt, cap, cls], i) => `<figure class="mo ${cls} rv" style="--d:${(i * 0.06).toFixed(2)}s" data-par><img src="${src}" width="${w}" height="${h}" alt="${alt}" loading="lazy"><figcaption>${cap}</figcaption></figure>`).join('\n        ');

const sm = head({
  title: 'Sportmanagement – Beratung, Sportmarketing und Sponsoring | United for Sports',
  desc: 'Sportmanagement von United for Sports: Beratung für Vereine, Sportmarketing und Sponsoring – persönlich und aus einer Hand.',
  canon: '/sportmanagement', area: 'sm', theme: 'light',
}) + header('sm', `<a class="btn btn--accent btn--sm hdr-cta" href="#kontakt">Anfrage</a>`) + `
<main id="inhalt">
  <section class="phero" aria-labelledby="h-title">
    <div class="hero-media"><img src="assets/header/allianz-arena-2.jpg" width="1490" height="551" alt="" fetchpriority="high"></div>
    <div class="wrap phero-grid">
      <div class="phero-copy">
        <p class="eyebrow rv">Bereich 01 · Sportmanagement</p>
        <h1 id="h-title" class="split" data-acc="2">Beratung, Marketing und Sponsoring für Vereine.</h1>
        <p class="lead rv" style="--d:.18s">Wir begleiten Vereine dabei, sich organisatorisch gut aufzustellen, sichtbarer zu werden und tragfähige Partnerschaften aufzubauen.</p>
        <div class="actions rv" style="--d:.24s">
          <a class="btn btn--accent" href="#kontakt">Anfrage stellen ${ic('arrow', 'ic-arrow')}</a>
          <a class="btn btn--ghost" href="#leistungen">Leistungen ansehen</a>
        </div>
      </div>
      <aside class="hcard rv" style="--d:.32s" data-tilt aria-label="Sportmanagement im Überblick">
        ${plate(LOGO_SM, 'plate--sm', true)}
        <ul class="hcard-list">
          <li><a href="#beratung"><span>01</span>Beratung für Vereine${ic('arrow')}</a></li>
          <li><a href="#marketing"><span>02</span>Sportmarketing${ic('arrow')}</a></li>
          <li><a href="#sponsoring"><span>03</span>Sponsoring${ic('arrow')}</a></li>
        </ul>
      </aside>
    </div>
    <a class="scroll-cue" href="#leistungen" aria-label="Weiter zu den Leistungen"><span></span></a>
  </section>
${ticker(['Beratung für Vereine', 'Sportmarketing', 'Sponsoring', 'Vereinsentwicklung', 'Partnerschaften'])}

  <section class="sec" id="leistungen" aria-labelledby="l-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Leistungen</p>
          <h2 id="l-title" class="split">Was wir für Ihren Verein tun.</h2>
        </div>
        <p class="rv">Drei Leistungsfelder, die sich gegenseitig ergänzen – von der Struktur im Verein bis zur Partnerschaft mit Sponsoren.</p>
      </div>
      <div class="feats">${featHtml}
      </div>
    </div>
  </section>

  <section class="sec sec--alt" aria-labelledby="p-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Einblicke</p>
          <h2 id="p-title" class="split">Sichtbar auf und neben dem Platz.</h2>
        </div>
        <p class="rv">Banden, Werbemittel und Fanartikel: So wird ein Verein für Mitglieder, Fans und Partner sichtbar.</p>
      </div>
      <div class="mosaic">
        ${mosaic}
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="z-title">
    <div class="wrap flow">
      <figure class="flow-fig rv" data-par>
        <img src="assets/header/berliner-olympiastadion.jpg" width="1490" height="551" alt="Blick in ein großes Stadion mit Laufbahn" loading="lazy">
      </figure>
      <div>
        <p class="eyebrow rv">Zusammenarbeit</p>
        <h2 id="z-title" class="split">So arbeiten wir zusammen.</h2>
        <ol class="steps">
          <li class="rv"><div><h3>Kennenlernen</h3><p>Wir sprechen über Ihre Ausgangslage, Ihre Ziele und das, was Ihren Verein ausmacht.</p></div></li>
          <li class="rv" style="--d:.08s"><div><h3>Konzept</h3><p>Wir entwickeln einen passenden Plan mit klaren Schritten und Zuständigkeiten.</p></div></li>
          <li class="rv" style="--d:.16s"><div><h3>Umsetzung</h3><p>Wir setzen gemeinsam um und bleiben auch danach Ihr Ansprechpartner.</p></div></li>
        </ol>
      </div>
    </div>
  </section>
${band('Kontakt Sportmanagement', 'Lassen Sie uns über Ihren Verein sprechen.', 'Erzählen Sie uns, worum es geht. Wir besprechen gemeinsam die nächsten Schritte.', 'Anfrage%20Sportmanagement')}

  <div class="wrap xlink">
    <a data-spot href="teamsport.html"><span><small>Ausrüstung für Ihre Mannschaft?</small><strong><span class="dot"></span>Bereich Teamsport</strong></span>${ic('arrow')}</a>
  </div>
</main>` + footer;

/* ======================= TEAMSPORT ======================= */
const swatches = [
  ['Anthrazit', '#16181c', '#f4f5f6', true],
  ['Weiß', '#f1f2f3', '#0b0c0e'],
  ['Cyan', '#2ad4e5', '#0b0c0e', false, '#0b0c0e'],
  ['Königsblau', '#1f45b8', '#ffffff'],
].map(([n, f, t, on, k]) => `<button type="button" class="sw" style="--sw:${f}" data-fill="${f}" data-text="${t}"${k ? ` data-trim="${k}"` : ''} aria-pressed="${on ? 'true' : 'false'}" aria-label="Trikotfarbe ${n}"></button>`).join('');

const ts = head({
  title: 'Teamsport – Fußball- und Teamsportausrüstung | United for Sports',
  desc: 'Teamsport von United for Sports: Fußball- und Teamsportausrüstung mit persönlichem Service und individueller Veredelung mit Namen und Nummern.',
  canon: '/teamsport', area: 'ts',
}) + header('ts', `<a class="btn btn--accent btn--sm hdr-cta" ${extAttrs}>Shop ${ic('ext', 'ic-ext')}<span class="vh"> (externer Teamsport-Shop, öffnet in neuem Tab)</span></a>`) + `
<main id="inhalt">
  <section class="phero" aria-labelledby="h-title">
    <div class="hero-media"><img src="assets/header/stadion-kabine-vfb-fichte-bielefeld.jpg" width="1490" height="551" alt="" fetchpriority="high"></div>
    <div class="wrap phero-grid">
      <div class="phero-copy">
        <p class="eyebrow rv">Bereich 02 · Teamsport</p>
        <h1 id="h-title" class="split" data-acc="2">Teamsport mit Namen und Nummer.</h1>
        <p class="lead rv" style="--d:.18s">Fußball- und Teamsportausrüstung für Vereine und Mannschaften – persönlich beraten und individuell veredelt.</p>
        <div class="actions rv" style="--d:.24s">
          <a class="btn btn--accent" ${extAttrs}>Zum Teamsport-Shop ${ic('ext', 'ic-ext')}${extHint}</a>
          <a class="btn btn--ghost" href="#kontakt">Beratung anfragen</a>
        </div>
      </div>
      <aside class="hcard rv" style="--d:.32s" data-tilt aria-label="Teamsport im Überblick">
        ${plate(LOGO_TS, 'plate--ts', true)}
        <ul class="hcard-list">
          <li><a href="#service"><span>01</span>Persönlicher Service${ic('arrow')}</a></li>
          <li><a href="#individualisierung"><span>02</span>Name &amp; Nummer${ic('arrow')}</a></li>
          <li><a href="#ausruestung"><span>03</span>Ausrüstung${ic('arrow')}</a></li>
        </ul>
        <p class="note">${ic('ext')}<span>Externer Shop: <b>shop.unitedforsports.com</b></span></p>
      </aside>
    </div>
    <a class="scroll-cue" href="#service" aria-label="Weiter zum Service"><span></span></a>
  </section>
${ticker(['100 % Teamsport', 'Fußball', 'Name', 'Nummer', 'Vereinslogo', 'Teamsportausrüstung'])}

  <section class="sec" id="service" aria-labelledby="s-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Service</p>
          <h2 id="s-title" class="split">Persönlich statt von der Stange.</h2>
        </div>
        <p class="rv">Bei uns sprechen Sie mit Menschen, die Teamsport kennen – von der ersten Frage bis zur fertigen Ausrüstung.</p>
      </div>
      <div class="cards">
        <article data-spot data-tilt class="card rv"><span class="card-ic">${ic('talk')}</span><h3>Persönliche Beratung</h3><p>Wir besprechen mit Ihnen, was Ihr Team braucht – vom Trikotsatz bis zur Trainingsausrüstung.</p></article>
        <article data-spot data-tilt class="card rv" style="--d:.08s"><span class="card-ic">${ic('team')}</span><h3>Für die ganze Mannschaft</h3><p>Ausrüstung für Spieler, Trainer und Betreuer – abgestimmt auf Ihren Verein.</p></article>
        <article data-spot data-tilt class="card rv" style="--d:.16s"><span class="card-ic">${ic('number')}</span><h3>Individuelle Veredelung</h3><p>Namen, Nummern und Vereinslogo machen die Ausrüstung zu Ihrer eigenen.</p></article>
      </div>
    </div>
  </section>

  <section class="sec sec--alt cfg" id="individualisierung" aria-labelledby="c-title">
    <div class="wrap">
      <div class="cfg-grid">
        <div>
          <p class="eyebrow rv">Individualisierung</p>
          <h2 id="c-title" class="split">Ihr Name. Ihre Nummer.</h2>
          <p class="lead rv">Ob Trikot, Trainingsanzug oder Aufwärmshirt: Wir veredeln Ihre Ausrüstung mit Spielernamen, Rückennummern und Vereinslogo. Probieren Sie es aus.</p>
          <div class="fields rv">
            <div class="field"><label for="j-name-in">Name</label><input id="j-name-in" type="text" maxlength="14" autocomplete="off" spellcheck="false" placeholder="Ihr Name"></div>
            <div class="field"><label for="j-num-in">Nummer</label><input id="j-num-in" type="text" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="10"></div>
          </div>
          <div class="sw-wrap rv"><span class="sw-k" id="sw-k">Trikotfarbe</span><div class="swatches" role="group" aria-labelledby="sw-k">${swatches}</div></div>
        </div>
        <div class="jersey-wrap rv" style="--d:.1s">
          <svg class="jersey" viewBox="0 0 320 360" role="img" aria-labelledby="j-t">
            <title id="j-t">Vorschau einer Trikot-Rückseite mit Name und Nummer</title>
            <path class="j-body" d="M104 18C130 36 190 36 216 18L288 46 316 128 266 148 256 120V336C200 348 120 348 64 336V120L54 148 4 128 32 46Z"/>
            <path class="j-seam" d="M64 120 72 60M256 120 248 60"/>
            <path class="j-trim" d="M8 131 56 150M312 131 264 150"/>
            <path class="j-collar" d="M106 20C132 38 188 38 214 20"/>
            <text class="j-name" x="160" y="106" text-anchor="middle">NAME</text>
            <text class="j-num" x="160" y="262" text-anchor="middle">10</text>
          </svg>
          <p class="jersey-cap">Unverbindliche Vorschau – keine Bestellung.</p>
        </div>
      </div>
      <div class="gal">
        <figure class="rv" data-par><img src="assets/fotos/druck/shirt-veredelung.jpg" width="460" height="324" alt="Cyanfarbenes Shirt in der Transferpresse beim Veredeln" loading="lazy"><figcaption>Veredelung eines Shirts</figcaption></figure>
        <figure class="rv" style="--d:.06s" data-par><img src="assets/fotos/druck/bedruckte-trainingsanzuege.jpg" width="460" height="324" alt="Bedruckte Trainingsanzüge" loading="lazy"><figcaption>Bedruckte Trainingsanzüge</figcaption></figure>
        <figure class="rv" style="--d:.12s" data-par><img src="assets/fotos/druck/bedruckte-teamausruestung.jpg" width="460" height="324" alt="Bedruckte Trikots und Trainingsoberteile" loading="lazy"><figcaption>Bedruckte Teamausrüstung</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="sec" id="ausruestung" aria-labelledby="r-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Ausrüstung</p>
          <h2 id="r-title" class="split">Ausrüstung für Fußball und Teamsport.</h2>
        </div>
        <p class="rv">Von der Spielkleidung bis zum Fanartikel – wir stellen mit Ihnen zusammen, was Ihr Team braucht.</p>
      </div>
      <ul class="range">
        <li class="rv" data-spot>${ic('shirt')}<h3>Trikots &amp; Hosen</h3><p>Spielkleidung für die ganze Mannschaft.</p></li>
        <li class="rv" data-spot>${ic('jacket')}<h3>Trainings- &amp; Präsentationsanzüge</h3><p>Ein einheitlicher Auftritt bei Training und Anreise.</p></li>
        <li class="rv" data-spot>${ic('ball')}<h3>Bälle &amp; Trainingszubehör</h3><p>Für Spiel, Training und Nachwuchs.</p></li>
        <li class="rv" data-spot>${ic('glove')}<h3>Torwartausrüstung</h3><p>Handschuhe und Bekleidung für die Nummer eins.</p></li>
        <li class="rv" data-spot>${ic('bag')}<h3>Taschen &amp; Zubehör</h3><p>Praktisches für Spieltag und Training.</p></li>
        <li class="rv" data-spot>${ic('flag')}<h3>Fan- &amp; Vereinsartikel</h3><p>Für Fans, Mitglieder und Sponsoren.</p></li>
      </ul>
      <p class="range-note rv">Das konkrete Sortiment finden Sie künftig im Teamsport-Shop.</p>
    </div>
  </section>

  <section class="sec" style="padding-top:0" aria-labelledby="shop-title">
    <div class="wrap">
      <div class="shop-panel rv">
        <div>
          <span class="badge">${ic('ext')}Externer Shop-Bereich</span>
          ${plate(LOGO_TS, '')}
          <h2 id="shop-title">Der Teamsport-Shop.</h2>
          <p>Unser Teamsport-Shop ist ein eigener Bereich unter <span class="shop-url">shop.unitedforsports.com</span>. Mit dem Klick wechseln Sie dorthin.</p>
          <div class="actions">
            <a class="btn btn--accent" ${extAttrs}>Zum Teamsport-Shop ${ic('ext', 'ic-ext')}${extHint}</a>
          </div>
          <p class="note">Öffnet in einem neuen Tab.</p>
        </div>
        <div class="ph-grid" aria-label="Platzhalter für Produktbeispiele">
          ${[1, 2, 3, 4].map(() => `<div class="ph-card" aria-hidden="true"><div class="ph-img">Produktbild<br>Platzhalter</div><div class="ph-line"></div><div class="ph-line s"></div></div>`).join('')}
          <p class="ph-note">Platzhalter – Produkte folgen im Shop.</p>
        </div>
      </div>
    </div>
  </section>
${band('Kontakt Teamsport', 'Ausrüstung für Ihr Team? Wir beraten Sie gern.', 'Sagen Sie uns, was Sie brauchen – wir stellen gemeinsam mit Ihnen die passende Ausstattung zusammen.', 'Anfrage%20Teamsport')}

  <div class="wrap xlink">
    <a data-spot class="x-sm" href="sportmanagement.html"><span><small>Beratung, Marketing oder Sponsoring?</small><strong><span class="dot"></span>Bereich Sportmanagement</strong></span>${ic('arrow')}</a>
  </div>
</main>` + footer;

/* ======================= ÜBER UNS ======================= */
const people = [
  ['Sportmanagement', 'var(--orange)'],
  ['Teamsport', 'var(--cyan)'],
  ['[Bereich]', 'var(--text)'],
  ['[Bereich]', 'var(--text)'],
].map(([area, c], i) => `
        <article class="person rv" style="--d:${(i * 0.08).toFixed(2)}s;--c:${c}" data-tilt>
          <div class="person-img" aria-hidden="true">${ic('user')}<span>Foto folgt</span></div>
          <div class="person-body">
            <p class="person-area"><span class="dot"></span>${area}</p>
            <h3><span class="ph">[Name]</span></h3>
            <p class="person-role"><span class="ph">[Funktion]</span></p>
            <p class="person-mail">${ic('mail')}<span class="ph">[E-Mail]</span></p>
          </div>
        </article>`).join('');

const about = head({
  title: 'Über uns – Das Team hinter United for Sports',
  desc: 'Über United for Sports: wer wir sind, wofür wir stehen und wer Ihre Ansprechpartner im Sportmanagement und Teamsport sind.',
  canon: '/ueber-uns', area: 'home',
}) + header('ab', ctaContact()) + `
<main id="inhalt">
  <section class="phero phero--about" aria-labelledby="h-title">
    <div class="hero-media"><img src="assets/header/berliner-olympiastadion.jpg" width="1490" height="551" alt="" fetchpriority="high"></div>
    <div class="wrap phero-grid">
      <div class="phero-copy">
        <p class="eyebrow rv">Über uns</p>
        <h1 id="h-title" class="split" data-acc="3">Wir sind United for Sports.</h1>
        <p class="lead rv" style="--d:.18s">Sportmanagement und Teamsport unter einer Marke – mit festen Ansprechpartnern für Vereine, Sportler und Unternehmen.</p>
        <div class="actions rv" style="--d:.24s">
          <a class="btn btn--accent" href="#team">Das Team ${ic('down', 'ic-arrow')}</a>
          <a class="btn btn--ghost" href="kontakt.html">Kontakt</a>
        </div>
      </div>
      <aside class="hcard hcard--duo rv" style="--d:.32s" data-tilt aria-label="Unsere Bereiche">
        <a class="hduo hduo--sm" href="sportmanagement.html">${plate(LOGO_SM, 'plate--sm', true)}<span>Sportmanagement ${ic('arrow')}</span></a>
        <a class="hduo hduo--ts" href="teamsport.html">${plate(LOGO_TS, 'plate--ts', true)}<span>Teamsport ${ic('arrow')}</span></a>
      </aside>
    </div>
  </section>
${ticker(['Persönlich', 'Aus einer Hand', 'Nah am Verein', 'Sportmanagement', 'Teamsport'], 'duo')}

  <section class="sec" aria-labelledby="w-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Wofür wir stehen</p>
          <h2 id="w-title" class="split">Drei Dinge, auf die Sie zählen können.</h2>
        </div>
        <p class="rv">Egal ob Beratung oder Trikotsatz – so arbeiten wir mit Ihnen zusammen.</p>
      </div>
      <div class="values">
        <article class="value rv" data-spot><span class="value-n">01</span>${ic('heart')}<h3>Persönlich</h3><p>Sie sprechen mit Menschen, nicht mit einer Hotline – und mit denselben Ansprechpartnern von Anfang bis Ende.</p></article>
        <article class="value rv" data-spot style="--d:.08s"><span class="value-n">02</span>${ic('target')}<h3>Aus einer Hand</h3><p>Beratung, Vermarktung und Ausrüstung greifen ineinander. Sie müssen nicht zwischen Anbietern koordinieren.</p></article>
        <article class="value rv" data-spot style="--d:.16s"><span class="value-n">03</span>${ic('flag')}<h3>Nah am Verein</h3><p>Wir kennen die Abläufe im Vereinssport und richten uns nach Ihren Möglichkeiten und Ihrem Tempo.</p></article>
      </div>
    </div>
  </section>

  <section class="sec sec--alt" aria-labelledby="g-title">
    <div class="wrap story">
      <div>
        <p class="eyebrow rv">Unsere Geschichte</p>
        <h2 id="g-title" class="split">Wie alles angefangen hat.</h2>
        <p class="lead rv"><span class="ph">[Platzhalter: Kurze Geschichte von United for Sports – Gründung, Entwicklung, Standort]</span></p>
      </div>
      <ol class="timeline">
        <li class="rv"><span class="tl-y"><span class="ph">[Jahr]</span></span><div><h3><span class="ph">[Meilenstein]</span></h3><p><span class="ph">[Kurze Beschreibung]</span></p></div></li>
        <li class="rv" style="--d:.08s"><span class="tl-y"><span class="ph">[Jahr]</span></span><div><h3><span class="ph">[Meilenstein]</span></h3><p><span class="ph">[Kurze Beschreibung]</span></p></div></li>
        <li class="rv" style="--d:.16s"><span class="tl-y"><span class="ph">[Jahr]</span></span><div><h3>Heute</h3><p>Sportmanagement und Teamsport unter der gemeinsamen Marke United for Sports.</p></div></li>
      </ol>
    </div>
  </section>

  <section class="sec" id="team" aria-labelledby="t-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Team</p>
          <h2 id="t-title" class="split">Ihre Ansprechpartner.</h2>
        </div>
        <p class="rv">Die Menschen hinter United for Sports. Fotos, Namen und Kontaktdaten folgen in Kürze.</p>
      </div>
      <div class="people">${people}
      </div>
      <p class="range-note rv">Platzhalter – Teamfotos und Angaben werden ergänzt.</p>
    </div>
  </section>

  <section class="sec sec--alt" aria-labelledby="j-title">
    <div class="wrap"><div class="join rv" data-spot>
      <div>
        <p class="eyebrow">Mitmachen</p>
        <h2 id="j-title">Lust, Teil des Teams zu werden?</h2>
        <p><span class="ph">[Platzhalter: Hinweis auf offene Stellen oder Initiativbewerbung]</span></p>
      </div>
      <a class="btn btn--line" href="mailto:?subject=Bewerbung%20United%20for%20Sports">Initiativ bewerben ${ic('arrow', 'ic-arrow')}</a>
    </div></div>
  </section>

  <div class="wrap xlink xlink--duo">
    <a data-spot class="x-sm" href="sportmanagement.html"><span><small>Beratung, Marketing, Sponsoring</small><strong><span class="dot"></span>Sportmanagement</strong></span>${ic('arrow')}</a>
    <a data-spot href="teamsport.html"><span><small>Ausrüstung, Name &amp; Nummer</small><strong><span class="dot"></span>Teamsport</strong></span>${ic('arrow')}</a>
  </div>
</main>` + footer;

/* ======================= KONTAKT ======================= */
const kontakt = head({
  title: 'Kontakt | United for Sports',
  desc: 'So erreichen Sie United for Sports – für Anfragen zu Sportmanagement, Teamsport oder allgemeine Fragen.',
  canon: '/kontakt', area: 'home',
}) + header('', `<a class="btn btn--ghost btn--sm hdr-cta" href="kontakt.html" aria-current="page">Kontakt</a>`) + `
<main id="inhalt">
  <section class="khero" aria-labelledby="h-title">
    <div class="wrap">
      <p class="eyebrow rv">Kontakt</p>
      <h1 id="h-title" class="split" data-acc="2">Wir sind für Sie da.</h1>
      <p class="lead rv" style="--d:.16s">Rufen Sie an, schreiben Sie uns oder kommen Sie vorbei. Wir melden uns so schnell wie möglich.</p>
    </div>
    <div class="khero-orbs" aria-hidden="true"><i></i><i></i></div>
  </section>

  <section class="sec" style="padding-top:clamp(1rem,3vw,2rem)" aria-label="Kontaktwege">
    <div class="wrap">
      <div class="kcards">
        <article class="kcard rv" data-spot data-tilt><span class="cic">${ic('phone')}</span><h2>Telefon</h2><p><span class="ph">[Telefonnummer folgt]</span></p></article>
        <article class="kcard rv" data-spot data-tilt style="--d:.06s"><span class="cic">${ic('mail')}</span><h2>E-Mail</h2><p><span class="ph">[E-Mail-Adresse folgt]</span></p></article>
        <article class="kcard rv" data-spot data-tilt style="--d:.12s"><span class="cic">${ic('pin')}</span><h2>Anschrift</h2><p><span class="ph">[Straße, PLZ Ort]</span></p></article>
        <article class="kcard rv" data-spot data-tilt style="--d:.18s"><span class="cic">${ic('clock')}</span><h2>Erreichbarkeit</h2><p><span class="ph">[Zeiten folgen]</span></p></article>
      </div>
    </div>
  </section>

  <section class="sec sec--alt" aria-labelledby="a-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <p class="eyebrow rv">Ihr Anliegen</p>
          <h2 id="a-title" class="split">Worum geht es?</h2>
        </div>
        <p class="rv">Wählen Sie das passende Thema – Ihr E-Mail-Programm öffnet sich mit dem richtigen Betreff.</p>
      </div>
      <div class="topics">
        <a class="topic rv" style="--c:var(--orange)" href="mailto:?subject=Anfrage%20Sportmanagement" data-spot><span class="topic-k"><span class="dot"></span>Sportmanagement</span><strong>Beratung, Marketing oder Sponsoring</strong><span class="topic-go">E-Mail schreiben ${ic('arrow')}</span></a>
        <a class="topic rv" style="--c:var(--cyan);--d:.08s" href="mailto:?subject=Anfrage%20Teamsport" data-spot><span class="topic-k"><span class="dot"></span>Teamsport</span><strong>Ausrüstung, Name &amp; Nummer</strong><span class="topic-go">E-Mail schreiben ${ic('arrow')}</span></a>
        <a class="topic rv" style="--c:var(--text);--d:.16s" href="mailto:?subject=Allgemeine%20Anfrage" data-spot><span class="topic-k"><span class="dot"></span>Allgemein</span><strong>Alles andere</strong><span class="topic-go">E-Mail schreiben ${ic('arrow')}</span></a>
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="m-title">
    <div class="wrap map-grid">
      <div>
        <p class="eyebrow rv">Anfahrt</p>
        <h2 id="m-title" class="split">So finden Sie uns.</h2>
        <p class="lead rv"><span class="ph">[Platzhalter: Anfahrtsbeschreibung, Parkmöglichkeiten]</span></p>
        <p class="rv" style="margin-top:1.5rem"><a class="tlink" ${extAttrs}>Lieber direkt zum Teamsport-Shop ${ic('ext')}${extHint}</a></p>
      </div>
      <div class="map rv" aria-hidden="true">
        <div class="map-grid-lines"></div>
        <span class="map-pin">${ic('pin')}</span>
        <span class="map-label">Karte folgt</span>
      </div>
    </div>
  </section>
</main>` + footer;

/* ======================= RECHTLICHES ======================= */
const legal = (file, title, h1, body, canon) => head({
  title: `${title} | United for Sports`, desc: `${title} von United for Sports.`, canon, area: 'home',
}) + header('', ctaContact()) + `
<main id="inhalt">
  <section class="lhero"><div class="wrap"><p class="eyebrow">Rechtliches</p><h1>${h1}</h1></div></section>
  <section class="sec" style="padding-top:clamp(2.5rem,5vw,4rem)">
    <div class="wrap">${body}</div>
  </section>
</main>` + footer;

const impBody = fs.readFileSync(path.join(SCR, 'impressum-body.html'), 'utf8');
const dsBody = fs.readFileSync(path.join(SCR, 'datenschutz-body.html'), 'utf8');
const impressum = legal('impressum', 'Impressum', 'Impressum', `<article class="prose">\n${impBody}</article>`, '/impressum');
const datenschutz = legal('datenschutz', 'Datenschutz', 'Datenschutz&shy;hinweise', `<div class="legal-grid">\n${dsBody}</div>`, '/datenschutz');

/* ======================= 404 ======================= */
const error = head({ title: 'Seite nicht gefunden | United for Sports', desc: 'Diese Seite wurde nicht gefunden.', canon: '/404', area: 'home' })
  .replace('<link rel="canonical" href="https://unitedforsports.com/404">', '<meta name="robots" content="noindex">')
  + header('', ctaContact()) + `
<main id="inhalt">
  <section class="err"><div class="wrap">
    <p class="err-n" aria-hidden="true">404</p>
    <h1>Diese Seite gibt es nicht.</h1>
    <p>Vielleicht hat sich die Adresse geändert. Wählen Sie einfach einen Bereich.</p>
    <div class="actions">
      <a class="btn btn--orange" href="sportmanagement.html">Sportmanagement</a>
      <a class="btn btn--cyan" href="teamsport.html">Teamsport</a>
      <a class="btn btn--ghost" href="index.html">Zur Startseite</a>
    </div>
  </div></section>
</main>` + footer;

const files = {
  'index.html': index, 'sportmanagement.html': sm, 'teamsport.html': ts,
  'ueber-uns.html': about, 'kontakt.html': kontakt,
  'impressum.html': impressum, 'datenschutz.html': datenschutz, 'error.html': error,
};
for (const [f, html] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), html);

fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/sportmanagement', '/teamsport', '/ueber-uns', '/kontakt', '/impressum', '/datenschutz'].map((u) => `  <url><loc>${DOMAIN}${u}</loc><lastmod>2026-11-20</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /_archiv/\nDisallow: /_build/\nDisallow: /original/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
console.log('ok', Object.keys(files).join(', '));
