// Tebak Warna (khusus Si Kecil 2-4 th) + nama warna diucapkan saat memilih warna.
(function () {
  const W = [
    { n: 'Merah', c: '#FF5A5F' }, { n: 'Oranye', c: '#FF9F1C' }, { n: 'Kuning', c: '#FFD93D' },
    { n: 'Hijau', c: '#5BD05B' }, { n: 'Biru', c: '#4D7CFF' }, { n: 'Pink', c: '#FF8FC8' }
  ];
  const RONDE = 5;                       // sesi pendek: 5 soal
  const PUJI = ['Hebat!', 'Pintar!', 'Betul!', 'Yeay!'];
  const kat = () => document.body.dataset.umur || 'jago';
  const tabEl = document.getElementById('tab');
  let T = { no: 0, ids: [], last: null, pool: [], target: null, salah: 0, kunci: false };

  // ---- Suara ucapan (butuh suara bahasa Indonesia di HP; kalau tidak ada, tetap jalan tanpa ucapan)
  function ucapkan(t) {
    try {
      const s = window.speechSynthesis; if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'id-ID'; u.rate = .85; u.pitch = 1.2;
      s.speak(u);
    } catch (e) {}
  }
  const tunda = (fn, ms) => { T.ids.push(setTimeout(fn, ms)); };
  function bersihTebak() { T.ids.forEach(clearTimeout); T.ids = []; try { speechSynthesis.cancel(); } catch (e) {} }
  const ucapSoal = () => ucapkan('Mana yang warna ' + T.target.n + '?');

  // Si Kecil: memilih warna di tab Warna -> nama warna disebut
  palet.addEventListener('click', e => {
    const b = e.target.closest('button.w');
    if (!b || kat() !== 'kecil') return;
    const i = [...palet.querySelectorAll('button.w')].indexOf(b);
    if (W[i]) ucapkan(W[i].n);
  });

  // ---- Tampilan
  function balon(x, y, r, warna, i) {
    const rx = r * .84;
    return `<g class="balon" data-i="${i}" data-x="${x}" data-y="${y}" style="animation-delay:${i * .4}s">` +
      `<path d="M${x} ${y + r + 10} q-9 14 0 28 t0 28" fill="none" stroke="#2A2550" stroke-width="3" stroke-linecap="round"/>` +
      `<polygon points="${x},${y + r - 2} ${x - 8},${y + r + 12} ${x + 8},${y + r + 12}" fill="${warna}" stroke="#2A2550" stroke-width="4" stroke-linejoin="round"/>` +
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r}" fill="${warna}" stroke="#2A2550" stroke-width="6"/>` +
      `<ellipse cx="${x - rx * .4}" cy="${y - r * .45}" rx="${rx * .18}" ry="${r * .28}" fill="#fff" fill-opacity=".55" transform="rotate(-25 ${x - rx * .4} ${y - r * .45})"/></g>`;
  }
  function konfeti(svg, x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, d = 40 + Math.random() * 80;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 4 + Math.random() * 4);
      c.setAttribute('fill', W[i % W.length].c); c.setAttribute('class', 'konfeti');
      c.style.setProperty('--dx', Math.cos(a) * d + 'px');
      c.style.setProperty('--dy', Math.sin(a) * d + 'px');
      svg.appendChild(c);
    }
  }
  const bintang = () => '⭐'.repeat(T.no) + '☆'.repeat(RONDE - T.no);

  function layar(pool, target) {
    const r = pool.length === 2 ? 48 : 40;
    const xs = pool.length === 2 ? [95, 205] : [55, 150, 245];
    stage.innerHTML = '<svg viewBox="0 0 300 300" role="img" aria-label="Tebak warna">' +
      '<text x="150" y="30" font-size="20" text-anchor="middle" class="tj">Mana yang warna</text>' +
      `<text x="150" y="74" font-size="42" text-anchor="middle" class="tj">${target.n.toUpperCase()}</text>` +
      `<text id="bintang" x="150" y="108" font-size="20" text-anchor="middle">${bintang()}</text>` +
      '<g id="speaker"><circle cx="262" cy="36" r="22" fill="#FFE066" stroke="#2A2550" stroke-width="5"/>' +
      '<text x="262" y="37" font-size="20" text-anchor="middle" dominant-baseline="central">🔊</text></g>' +
      pool.map((w, i) => balon(xs[i], 185, r, w.c, i)).join('') + '</svg>';
    const svg = stage.firstElementChild;
    svg.querySelectorAll('.balon').forEach(g => g.addEventListener('pointerdown', () => pilih(g, pool[+g.dataset.i])));
    svg.querySelector('#speaker').addEventListener('pointerdown', ucapSoal);
  }

  // ---- Alur permainan (tanpa bunyi/tanda salah; salah = goyang pelan + petunjuk)
  function babak() {
    const pool = W.slice().sort(() => Math.random() - .5).slice(0, T.no < 2 ? 2 : 3);  // 2 pilihan dulu, lalu 3
    let target = pool[Math.floor(Math.random() * pool.length)];
    if (target === T.last) target = pool.find(x => x !== T.last);
    T.pool = pool; T.target = target; T.last = target; T.salah = 0; T.kunci = false;
    layar(pool, target);
    tunda(ucapSoal, 450);
  }

  function pilih(g, w) {
    if (T.kunci) return;
    if (w === T.target) return benar(g, w);
    T.salah++;
    g.classList.add('pelan'); tunda(() => g.classList.remove('pelan'), 520);
    ucapkan('Itu ' + w.n + '. Cari ' + T.target.n + ' ya');
    if (T.salah >= 2) {
      const t = [...stage.querySelectorAll('.balon')].find(x => T.pool[+x.dataset.i] === T.target);
      if (t) t.classList.add('petunjuk');
    }
  }

  function benar(g, w) {
    T.kunci = true;
    g.classList.remove('petunjuk'); g.classList.add('terbangbalon');
    const svg = stage.firstElementChild;
    konfeti(svg, +g.dataset.x, +g.dataset.y, 16);
    bunyi(T.no);                                    // nada naik: Do, Re, Mi, ...
    if (navigator.vibrate) navigator.vibrate(20);
    ucapkan(PUJI[T.no % PUJI.length] + ' ' + w.n + '!');
    T.no++;
    const b = svg.querySelector('#bintang'); if (b) b.textContent = bintang();
    tunda(() => (T.no >= RONDE ? selesai() : babak()), 1900);
  }

  function selesai() {
    stage.innerHTML = '<svg viewBox="0 0 300 300" role="img" aria-label="Selesai">' +
      '<text x="150" y="120" font-size="90" text-anchor="middle" dominant-baseline="central">🎉</text>' +
      '<text x="150" y="185" font-size="44" text-anchor="middle" class="tj">Hebat!</text>' +
      `<text x="150" y="222" font-size="26" text-anchor="middle">${'⭐'.repeat(RONDE)}</text>` +
      '<g id="lagi" class="balon" data-x="150" data-y="266"><circle cx="150" cy="266" r="26" fill="#FFE066" stroke="#2A2550" stroke-width="5"/>' +
      '<text x="150" y="267" font-size="24" text-anchor="middle" dominant-baseline="central">🔁</text></g></svg>';
    const svg = stage.firstElementChild;
    konfeti(svg, 150, 130, 26);
    [0, 2, 4, 7].forEach((n, k) => tunda(() => bunyi(n), 200 + k * 150));
    ucapkan('Hebat! Kamu pintar!');
    svg.querySelector('#lagi').addEventListener('pointerdown', mulai);
  }
  function mulai() { bersihTebak(); T = { no: 0, ids: [], last: null, pool: [], target: null, salah: 0, kunci: false }; babak(); }

  // ---- Tab Tebak (hanya tampil di Si Kecil, lihat CSS)
  const tb = document.createElement('button');
  tb.dataset.t = 'tebak'; tb.setAttribute('aria-pressed', 'false'); tb.textContent = '🎯 Tebak';
  tabEl.appendChild(tb);

  tb.onclick = () => {
    if (document.body.dataset.tab === 'tebak') return;
    if (document.body.dataset.tab === 'garis') tabEl.querySelector('[data-t=warna]').click();
    simpan();                                        // simpan gambar yang sedang diwarnai
    document.body.dataset.tab = 'tebak';
    tabEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === tb));
    bunyi(4); mulai();
  };

  function keluar() {
    bersihTebak();
    document.body.dataset.tab = 'warna';
    tabEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === 'warna'));
    tampil();                                        // pulihkan gambar sebelum tab lain bekerja
  }
  tabEl.addEventListener('click', e => {
    if (document.body.dataset.tab !== 'tebak') return;
    const b = e.target.closest('button');
    if (b && b !== tb) keluar();
  }, true);
  new MutationObserver(() => {
    if (kat() === 'jago' && document.body.dataset.tab === 'tebak') keluar();
  }).observe(document.body, { attributes: true, attributeFilter: ['data-umur'] });
})();
