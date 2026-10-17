// Gambar hidup: setelah selesai diwarnai, hewan/benda bergerak dan bersuara.
(function () {
  const btn = document.getElementById('hidup');
  const kat = () => document.body.dataset.umur || 'jago';
  const adaTab = () => document.body.dataset.tab || 'warna';
  const GERAK = ['lari', 'terbang', 'jalan', 'renang'];
  // Si Kecil: 3 gambar sederhana. Si Jago: semua gambar.
  const BOLEH = { kecil: [0, 1, 5], jago: [0, 1, 2, 3, 4, 5] };

  // jenis: wajah (diam, mengeong) | benda (diam, bergerak di tempat) | lari | terbang | jalan | renang
  // hadap: arah hadap gambar asli (1 = kanan, -1 = kiri)
  const CONFIG = [
    { jenis: 'wajah', suara: 'meong', ucap: 'Meong!', mata: 1, kumis: 1 },                                   // 0 kucing
    { jenis: 'renang', suara: 'blup', ucap: 'Blup!', hadap: -1, v: 60, skala: .5, mata: 1, bagian: [          // 1 ikan
      { i: 1, k: 'ekor', asal: 'left center' }, { i: 0, k: 'kepak', asal: 'center bottom' }, { i: 3, k: 'kepak', asal: 'center top' }] },
    { jenis: 'benda', suara: 'bel', ucap: 'Ting tong!', bagian: [                                            // 2 rumah
      { i: 4, k: 'kedip' }, { i: 5, k: 'kedip' }, { i: 0, k: 'pulsa' }] },
    { jenis: 'lari', suara: 'guk', ucap: 'Guk guk!', hadap: 1, v: 75, skala: .5, mata: 1,                     // 3 anjing
      bagian: [{ i: 0, k: 'ekor', asal: 'right bottom' }] },
    { jenis: 'terbang', suara: 'kicau', ucap: 'Cit cit!', hadap: -1, v: 85, skala: .48, mata: 1,             // 4 burung
      bagian: [{ i: 4, k: 'kepak', asal: 'center top' }] },
    { jenis: 'jalan', suara: 'klakson', ucap: 'Tin tin!', hadap: 1, v: 70, skala: .5 }                      // 5 mobil
  ];

  GAMBAR.push(
    `<svg viewBox="0 0 300 300" role="img" aria-label="Anjing">
      <path class="a" d="M62 150 Q30 120 40 85 Q65 100 80 140 Z"/>
      <path class="a" d="M70 195 h50 v60 h-18 v-40 h-14 v40 h-18 z"/>
      <path class="a" d="M150 195 h50 v60 h-18 v-40 h-14 v40 h-18 z"/>
      <ellipse class="a" cx="135" cy="160" rx="80" ry="48"/>
      <circle class="a" cx="210" cy="105" r="40"/>
      <ellipse class="a" cx="247" cy="120" rx="27" ry="19"/>
      <ellipse class="a" cx="185" cy="105" rx="14" ry="30"/>
      <circle class="f" cx="217" cy="95" r="6"/><circle class="f" cx="269" cy="113" r="8"/>
      <path class="n" d="M240 138 q12 9 25 0"/>
    </svg>`,
    `<svg viewBox="0 0 300 300" role="img" aria-label="Burung">
      <polygon class="a" points="215,150 285,122 280,185"/>
      <ellipse class="a" cx="150" cy="160" rx="75" ry="55"/>
      <circle class="a" cx="90" cy="108" r="38"/>
      <polygon class="a" points="56,102 18,118 56,130"/>
      <path class="a" d="M130 140 Q190 95 225 150 Q185 205 130 180 Z"/>
      <circle class="f" cx="80" cy="98" r="6"/>
      <path class="n" d="M135 213 v32 M165 213 v32 M122 246 h22 M152 246 h22"/>
    </svg>`,
    `<svg viewBox="0 0 300 300" role="img" aria-label="Mobil">
      <path class="a" d="M75 150 L105 95 H195 L225 150 Z"/>
      <rect class="a" x="25" y="150" width="250" height="55" rx="18"/>
      <path class="a" d="M95 148 L115 105 H187 L207 148 Z"/>
      <circle class="a" cx="90" cy="208" r="28"/><circle class="a" cx="210" cy="208" r="28"/>
      <circle class="f" cx="90" cy="208" r="7"/><circle class="f" cx="210" cy="208" r="7"/>
      <circle class="f" cx="262" cy="172" r="7"/>
    </svg>`
  );
  cache.push(null, null, null);

  let H = null;
  const ditawar = {};
  const mk = (par, tag, at, teks) => {
    const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]);
    if (teks) e.textContent = teks;
    par.appendChild(e); return e;
  };

  // ---- Suara hewan (sintesis, tanpa file audio)
  function bip(f0, f1, d, tipe, vol, tunda, lp) {
    try {
      suara = suara || new (window.AudioContext || window.webkitAudioContext)();
      if (suara.state === 'suspended') suara.resume();
      const t = suara.currentTime + (tunda || 0);
      const o = suara.createOscillator(), g = suara.createGain(), f = suara.createBiquadFilter();
      o.type = tipe; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d);
      f.type = 'lowpass'; f.frequency.value = lp || 3000;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(f).connect(g).connect(suara.destination);
      o.start(t); o.stop(t + d + .05);
    } catch (e) {}
  }
  const SUARA = {
    meong: () => { bip(520, 880, .2, 'sawtooth', .16, 0, 1600); bip(880, 430, .5, 'sawtooth', .16, .2, 1400); },
    guk: () => { bip(260, 150, .14, 'square', .14, 0, 700); bip(260, 150, .14, 'square', .14, .2, 700); },
    kicau: () => { [0, .11, .22].forEach((t, i) => bip(2300 + i * 300, 3300, .08, 'sine', .12, t)); },
    blup: () => { bip(300, 750, .1, 'sine', .2, 0); bip(380, 900, .1, 'sine', .15, .14); },
    klakson: () => { bip(440, 440, .22, 'square', .1, 0, 1500); bip(554, 554, .22, 'square', .1, .26, 1500); },
    bel: () => { bip(784, 784, .5, 'sine', .2, 0); bip(622, 622, .7, 'sine', .2, .4); }
  };
  const bunyiHewan = j => SUARA[j] && SUARA[j]();
  window.HIDUP = { CONFIG, BOLEH, SUARA, bip, bersih };

  function ucap() {
    if (!H) return;
    const roam = GERAK.includes(H.C.jenis);
    const t = mk(H.svg, 'text', { x: roam ? H.x : 150, y: roam ? H.y - 60 * H.s : 40,
      'font-size': 24, 'text-anchor': 'middle', class: 'ucap' }, H.C.ucap);
    setTimeout(() => t.remove(), 1400);
  }
  function gelembung() {
    if (!H) return;
    const c = mk(H.svg, 'circle', { cx: H.x + H.arah * 20, cy: H.y - 6, r: 3 + Math.random() * 3, class: 'gelembung' });
    setTimeout(() => c.remove(), 1600);
  }

  // ---- Mulai / berhenti
  function mulaiHidup() {
    if (H || adaTab() !== 'warna') return;
    const svg = stage.firstElementChild, C = CONFIG[idx];
    if (!svg || !C) return;
    const w = document.createElementNS(NS, 'g');
    w.setAttribute('class', 'pelari');
    [...svg.children].filter(c => c.localName !== 'defs').forEach(c => w.appendChild(c));
    svg.appendChild(w);
    const ar = svg.querySelectorAll('g.area');
    (C.bagian || []).forEach(b => {
      const g = ar[b.i]; if (!g) return;
      g.classList.add(b.k); g.style.transformOrigin = b.asal || 'center';
    });
    if (C.mata) svg.querySelectorAll('circle.f').forEach(e => e.classList.add('mata'));
    if (C.kumis) svg.querySelectorAll('.n').forEach(e => e.classList.add('kumis'));
    H = { svg, w, C, t: 0, x: 150, y: 150, s: 1, sx: 1, arah: 1, tx: 150, ty: 150, last: 0, pulang: false };
    btn.textContent = '■'; btn.classList.remove('siap');
    if (GERAK.includes(C.jenis)) H.raf = requestAnimationFrame(putar);
    else w.classList.add(C.jenis === 'wajah' ? 'napas' : 'lompat');
    const sapa = () => { bunyiHewan(C.suara); ucap(); };
    setTimeout(sapa, 250); H.iv = setInterval(sapa, 2600);
    if (C.jenis === 'renang') H.iv2 = setInterval(gelembung, 550);
    H.to = setTimeout(berhenti, 30000);
  }

  function putar(ts) {
    if (!H) return;
    if (!H.last) H.last = ts;
    const dt = Math.min(.05, (ts - H.last) / 1000); H.last = ts; H.t += dt;
    const C = H.C, J = C.jenis;
    let bob = 0, rot = 0, sq = 1;
    if (H.pulang) {
      const dx = 150 - H.x, dy = 150 - H.y, d = Math.hypot(dx, dy), m = Math.min(d, 150 * dt);
      if (d > .1) { H.x += dx / d * m; H.y += dy / d * m; }
      H.s += (1 - H.s) * Math.min(1, dt * 5);
      H.sx += (1 - H.sx) * Math.min(1, dt * 9);
      if (d < 2 && Math.abs(H.s - 1) < .02 && Math.abs(H.sx - 1) < .06) { bersih(); return; }
    } else {
      if (J === 'lari' || J === 'terbang') {
        const dx = H.tx - H.x, dy = H.ty - H.y, d = Math.hypot(dx, dy);
        if (d < 6) { H.tx = 70 + Math.random() * 160; H.ty = 80 + Math.random() * 135; }
        else { H.x += dx / d * C.v * dt; H.y += dy / d * C.v * dt; if (Math.abs(dx) > 8) H.arah = dx > 0 ? 1 : -1; }
      } else {
        H.x += H.arah * C.v * dt;
        if (H.x > 230) H.arah = -1; else if (H.x < 70) H.arah = 1;
        const yT = J === 'jalan' ? 172 : 150 + 45 * Math.sin(H.t * 1.1);
        H.y += (yT - H.y) * Math.min(1, dt * 4);
      }
      H.s += (C.skala - H.s) * Math.min(1, dt * 3);
      H.sx += (H.arah * C.hadap - H.sx) * Math.min(1, dt * 9);
      if (J === 'lari') { const g = Math.sin(H.t * 10); bob = -Math.abs(g) * 9; rot = g * 3; sq = 1 + Math.abs(g) * .04; }
      else if (J === 'terbang') { bob = Math.sin(H.t * 6) * 10; rot = Math.sin(H.t * 3) * 4; }
      else if (J === 'jalan') bob = Math.sin(H.t * 16) * 1.5;
      else rot = Math.sin(H.t * 7) * 4;
    }
    H.w.setAttribute('transform',
      `translate(${H.x.toFixed(1)} ${(H.y + bob).toFixed(1)}) rotate(${rot.toFixed(1)}) ` +
      `scale(${(H.sx * H.s).toFixed(3)} ${(H.s * sq).toFixed(3)}) translate(-150 -150)`);
    H.raf = requestAnimationFrame(putar);
  }

  function berhenti() {
    if (!H || H.pulang) return;
    if (GERAK.includes(H.C.jenis)) { H.pulang = true; clearInterval(H.iv); clearInterval(H.iv2); }
    else bersih();
  }
  function bersih() {
    if (!H) return;
    cancelAnimationFrame(H.raf); clearInterval(H.iv); clearInterval(H.iv2); clearTimeout(H.to);
    const { svg, w } = H;
    while (w.firstChild) svg.insertBefore(w.firstChild, w);
    w.remove();
    svg.querySelectorAll('.ucap,.gelembung').forEach(e => e.remove());
    svg.querySelectorAll('.ekor,.kepak,.kedip,.pulsa,.mata,.kumis').forEach(e => {
      e.classList.remove('ekor', 'kepak', 'kedip', 'pulsa', 'mata', 'kumis');
      e.style.transformOrigin = '';
    });
    H = null; btn.textContent = '★';
  }

  // ---- Deteksi "selesai mewarnai"
  function lengkap(svg) {
    return [...svg.querySelectorAll('g.area')].every(g => {
      if (g.querySelector('.a').style.fill) return true;
      let n = 0; g.querySelectorAll('.sapu').forEach(p => { n += p.getAttribute('d').length; });
      const bb = g.getBBox();
      return n >= (Math.max(bb.width, bb.height) < 60 ? 14 : 90);
    });
  }
  function cek() {
    if (H || adaTab() !== 'warna' || ditawar[idx]) return;
    const svg = stage.firstElementChild;
    if (!svg || !lengkap(svg)) return;
    ditawar[idx] = true; btn.classList.add('siap'); bunyi(7);
    const saatIni = idx;
    if (kat() === 'kecil')   // balita: langsung hidup otomatis
      setTimeout(() => { if (!H && adaTab() === 'warna' && idx === saatIni) mulaiHidup(); }, 1300);
  }
  stage.addEventListener('pointerup', () => setTimeout(cek, 60));

  // Saat hidup, sentuhan = menyapa (bunyi), bukan mewarnai
  stage.addEventListener('pointerdown', e => {
    if (!H) return;
    e.stopPropagation(); e.preventDefault();
    bunyiHewan(H.C.suara); ucap();
  }, true);

  btn.onclick = () => { if (H) berhenti(); else mulaiHidup(); };

  // ---- Navigasi gambar per umur
  const langkah = d => {
    const L = BOLEH[kat()]; let i = L.indexOf(idx); if (i < 0) i = 0;
    return L[(i + d + L.length) % L.length];
  };
  ['prev', 'next', 'ulang'].forEach(id => {
    const b = document.getElementById(id), o = b.onclick;
    b.onclick = e => {
      if (adaTab() !== 'warna') return o && o.call(b, e);
      bersih(); btn.classList.remove('siap');
      if (id === 'ulang') { ditawar[idx] = false; return o && o.call(b, e); }
      simpan(); idx = langkah(id === 'next' ? 1 : -1); tampil();
    };
  });
  document.getElementById('tab').addEventListener('click', bersih, true);
  new MutationObserver(() => {
    bersih();
    if (!BOLEH[kat()].includes(idx)) {
      if (adaTab() === 'warna') simpan();
      idx = BOLEH[kat()][0];
      if (adaTab() === 'warna') tampil();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['data-umur'] });
})();
