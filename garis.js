// Tarik Garis: ikuti jalur, kumpulkan 8 bintang = nada Do Re Mi Fa Sol La Si Do, jejak pelangi.
(function () {
  const N = 240;
  const TEMA = {
    // 2-4 th: garis tegak, datar, lingkaran, lengkung lembut. Jalur lebar, sangat toleran.
    kecil: { tol: 30, lebar: 46, ukuran: 40, pola: [
      { d: 'M150 45 V255', c: '🐝', g: '🌻' },
      { d: 'M40 150 H260', c: '🚗', g: '🏠' },
      { d: 'M150 50 A100 100 0 1 1 150 250 A100 100 0 1 1 150 50', c: '🦋' },
      { d: 'M30 150 C75 70 105 70 150 150 S225 230 270 150', c: '🐟', g: '🌊' }
    ]},
    // 5-7 th: kotak, segitiga, zigzag, ular, bintang, spiral. Jalur sempit.
    jago: { tol: 17, lebar: 26, ukuran: 30, pola: [
      { d: 'M70 70 H230 V230 H70 Z', c: '🐞' },
      { d: 'M150 55 L240 230 H60 Z', c: '🚀' },
      { d: 'M30 200 L75 100 L120 200 L165 100 L210 200 L255 100', c: '🐜', g: '🍎' },
      { d: 'M40 70 H230 A30 30 0 0 1 230 130 H70 A30 30 0 0 0 70 190 H230 A30 30 0 0 1 230 250', c: '🐌', g: '🍃' },
      { d: 'M150 50 L209 231 L55 119 L245 119 L91 231 Z', c: '🛸' },
      { d: 'M40 150 A110 110 0 0 1 260 150 A90 90 0 0 1 80 150 A75 75 0 0 1 230 150 A60 60 0 0 1 110 150 A45 45 0 0 1 200 150 A33 33 0 0 1 134 150', c: '🐢' }
    ]}
  };

  let tab = 'warna', gi = 0, S = null;
  const kat = () => document.body.dataset.umur || 'jago';
  let selesai = new Set();
  try { selesai = new Set(JSON.parse(localStorage.getItem('garis-selesai') || '[]')); } catch (e) {}

  const mk = (svg, tag, at, teks) => {
    const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]);
    if (teks) e.textContent = teks;
    svg.appendChild(e); return e;
  };
  const TX = { 'text-anchor': 'middle', 'dominant-baseline': 'central' };

  // ---- Tab Warna / Garis
  const tabEl = document.createElement('nav');
  tabEl.id = 'tab';
  tabEl.innerHTML = '<button data-t="warna" aria-pressed="true">🎨 Warna</button>' +
                    '<button data-t="garis" aria-pressed="false">✏️ Garis <b id="bt"></b></button>';
  document.querySelector('.bar').after(tabEl);
  document.body.dataset.tab = 'warna';
  tabEl.querySelectorAll('button').forEach(b => b.onclick = () => pilihTab(b.dataset.t));
  function perbaruiTab() { document.getElementById('bt').textContent = selesai.size ? '⭐' + selesai.size : ''; }
  perbaruiTab();

  function pilihTab(t) {
    if (t === tab) return;
    if (tab === 'warna') simpan();
    tab = t; document.body.dataset.tab = t;
    tabEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
    if (t === 'garis') mulai(); else { S = null; tampil(); }
    bunyi(t === 'garis' ? 4 : 0);
  }

  // Tombol ◀ ▶ ↺ ikut berfungsi untuk Garis
  ['prev', 'next', 'ulang'].forEach(id => {
    const b = document.getElementById(id), o = b.onclick;
    b.onclick = e => {
      if (tab !== 'garis') return o && o.call(b, e);
      const n = TEMA[kat()].pola.length;
      if (id !== 'ulang') gi = (gi + (id === 'next' ? 1 : -1) + n) % n;
      mulai();
    };
  });

  // Ganti umur -> mulai lagi dari pola pertama
  new MutationObserver(() => { gi = 0; if (tab === 'garis') mulai(); })
    .observe(document.body, { attributes: true, attributeFilter: ['data-umur'] });

  // ---- Bangun satu pola
  function mulai() {
    const T = TEMA[kat()], P = T.pola[gi % T.pola.length];
    stage.innerHTML = '<svg viewBox="0 0 300 300" role="img" aria-label="Tarik garis">' +
      `<path id="jalan" d="${P.d}" fill="none" stroke="#E4ECF7" stroke-width="${T.lebar}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${P.d}" fill="none" stroke="#2A2550" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 13"/></svg>`;
    const svg = stage.firstElementChild, jalan = svg.querySelector('#jalan');
    const L = jalan.getTotalLength(), pts = [];
    for (let i = 0; i <= N; i++) { const q = jalan.getPointAtLength(L * i / N); pts.push([q.x, q.y]); }

    const segs = [];
    for (let k = 0; k < 8; k++) segs.push(mk(svg, 'path', { d: P.d, fill: 'none', stroke: WARNA[k % WARNA.length],
      'stroke-width': T.lebar * .62, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': 0 }));

    const idx = [], bint = [];
    for (let k = 0; k < 8; k++) {
      const i = Math.round(N * (k + 1) / 8), akhir = k === 7 && P.g;
      idx.push(i);
      bint.push(mk(svg, 'text', Object.assign({ x: pts[i][0], y: pts[i][1], 'font-size': akhir ? 34 : 22 }, TX), akhir ? P.g : '⭐'));
    }
    const ring = mk(svg, 'circle', { cx: pts[0][0], cy: pts[0][1], r: T.tol * .9, fill: '#5BD05B', 'fill-opacity': .3, class: 'denyut' });
    const tokoh = mk(svg, 'text', Object.assign({ x: pts[0][0], y: pts[0][1], 'font-size': T.ukuran }, TX), P.c);
    S = { gi, kat: kat(), T, P, svg, pts, L, segs, idx, bint, ambil: [], ring, tokoh, p: 0, aktif: false, selesai: false };
    pasangGaris(S);
  }

  function pasangGaris(s) {
    const { svg, pts, T } = s;
    const titik = e => {
      const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y];
    };
    svg.addEventListener('pointerdown', e => {
      if (s.selesai) return;
      const [x, y] = titik(e), c = pts[s.p];
      if (Math.hypot(x - c[0], y - c[1]) > T.tol * 1.8 + 10) return;   // mulai dari tokoh
      s.aktif = true; svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', e => {
      if (!s.aktif || s.selesai) return;
      const [x, y] = titik(e);
      let best = -1, bd = 1e9;
      for (let i = Math.max(0, s.p - 4); i <= Math.min(N, s.p + 34); i++) {
        const d = Math.hypot(x - pts[i][0], y - pts[i][1]);
        if (d < bd) { bd = d; best = i; }
      }
      if (bd <= T.tol && best > s.p) { s.p = best; gerak(s); }
    });
    const stop = () => { s.aktif = false; };
    svg.addEventListener('pointerup', stop);
    svg.addEventListener('pointercancel', stop);
  }

  function gerak(s) {
    const c = s.pts[s.p], seg = s.L / 8, cur = s.L * s.p / N;
    s.tokoh.setAttribute('x', c[0]); s.tokoh.setAttribute('y', c[1]);
    if (s.ring) { s.ring.remove(); s.ring = null; }
    s.segs.forEach((el, k) => {
      const f = Math.max(0, Math.min(seg, cur - seg * k));
      if (f <= 0) { el.setAttribute('stroke-opacity', 0); return; }
      el.setAttribute('stroke-opacity', 1);
      el.setAttribute('stroke-dasharray', f + ' ' + s.L * 3);
      el.setAttribute('stroke-dashoffset', -seg * k);
    });
    s.idx.forEach((ix, k) => {
      if (s.p >= ix && !s.ambil[k]) {
        s.ambil[k] = true;
        s.bint[k].classList.add(k === 7 && s.P.g ? 'senang' : 'pop');
        bunyi(k);
        if (navigator.vibrate) navigator.vibrate(12);
      }
    });
    if (s.p >= N && !s.selesai) rayakan(s);
  }

  function rayakan(s) {
    s.selesai = true; s.aktif = false;
    selesai.add(s.kat + ':' + s.gi);
    try { localStorage.setItem('garis-selesai', JSON.stringify([...selesai])); } catch (e) {}
    perbaruiTab();
    s.tokoh.classList.add('senang');
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * 6.283, r = 70 + Math.random() * 90;
      const c = mk(s.svg, 'circle', { cx: 150, cy: 150, r: 4 + Math.random() * 5, fill: WARNA[i % WARNA.length], class: 'konfeti' });
      c.style.setProperty('--dx', Math.cos(a) * r + 'px');
      c.style.setProperty('--dy', Math.sin(a) * r + 'px');
    }
    mk(s.svg, 'text', Object.assign({ x: 150, y: 150, 'font-size': 44, class: 'hebat' }, TX), 'Hebat! 🎉');
    [0, 2, 4, 7].forEach((n, k) => setTimeout(() => bunyi(n), 500 + k * 150));
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    setTimeout(() => {   // otomatis lanjut ke pola berikutnya
      if (tab === 'garis' && S === s) { gi = (gi + 1) % TEMA[s.kat].pola.length; mulai(); }
    }, 3600);
  }
})();
