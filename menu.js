// Menu gambar Si Kecil: Binatang / Benda / Dinosaurus (25 gambar baru, semua bisa hidup).
(function () {
  const { CONFIG, BOLEH, SUARA, bip, bersih } = HIDUP;
  const kat = () => document.body.dataset.umur || 'jago';

  // ---- Penyusun gambar sederhana: .a = bisa diwarnai, .f = titik tetap, .n = garis tetap
  const A = (t, a) => `<${t} class="a" ${a}/>`;
  const E = (x, y, rx, ry) => A('ellipse', `cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"`);
  const C = (x, y, r) => A('circle', `cx="${x}" cy="${y}" r="${r}"`);
  const R = (x, y, w, h, q) => A('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${q || 8}"`);
  const P = p => A('polygon', `points="${p}"`);
  const D = d => A('path', `d="${d}"`);
  const O = (x, y, r) => `<circle class="f" cx="${x}" cy="${y}" r="${r || 6}"/>`;
  const F = p => `<polygon class="f" points="${p}"/>`;
  const L = d => `<path class="n" d="${d}"/>`;
  const S = (n, ...x) => `<svg viewBox="0 0 300 300" role="img" aria-label="${n}">${x.join('')}</svg>`;
  const cfg = (jenis, suara, ucap, x) => Object.assign({ jenis, suara, ucap, hadap: 1, v: 70, skala: .5 }, x);

  // ---- Suara tambahan
  Object.assign(SUARA, {
    raung: () => { bip(190, 80, .8, 'sawtooth', .22, 0, 700); bip(130, 70, .5, 'square', .1, .2, 500); },
    aum: () => bip(320, 140, .8, 'sawtooth', .22, 0, 900),
    kwek: () => { bip(700, 500, .12, 'square', .1, 0, 1800); bip(700, 500, .12, 'square', .1, .18, 1800); },
    oink: () => { bip(260, 160, .15, 'sawtooth', .14, 0, 900); bip(240, 150, .15, 'sawtooth', .14, .2, 900); },
    kodok: () => { bip(200, 300, .1, 'square', .1, 0, 900); bip(200, 300, .1, 'square', .1, .15, 900); },
    ting: () => { bip(1318, 1318, .4, 'sine', .15, 0); bip(1568, 1568, .5, 'sine', .12, .12); },
    boing: () => bip(180, 520, .35, 'sine', .22, 0),
    wuss: () => bip(250, 900, .6, 'sawtooth', .08, 0, 1800),
    trompet: () => { bip(300, 700, .18, 'sawtooth', .16, 0, 1500); bip(700, 480, .5, 'sawtooth', .16, .18, 1300); }
  });

  // ---- 10 BENDA
  const BENDA = [
    [S('Bola', D('M150 150 L150 50 A100 100 0 0 1 250 150 Z'), D('M150 150 L250 150 A100 100 0 0 1 150 250 Z'),
       D('M150 150 L150 250 A100 100 0 0 1 50 150 Z'), D('M150 150 L50 150 A100 100 0 0 1 150 50 Z'), O(150, 150, 9)),
      cfg('benda', 'boing', 'Boing!')],
    [S('Apel', D('M150 95 C90 60 40 120 60 190 C75 245 120 270 150 255 C180 270 225 245 240 190 C260 120 210 60 150 95 Z'),
       D('M155 88 Q175 40 220 48 Q215 90 155 88 Z'), L('M150 95 Q148 70 158 52')),
      cfg('benda', 'ting', 'Nyam!')],
    [S('Bintang', P('150,30 185,115 275,120 205,178 228,265 150,215 72,265 95,178 25,120 115,115'),
       O(125, 150, 7), O(175, 150, 7), L('M128 178 q22 20 44 0')),
      cfg('benda', 'ting', 'Kilau!', { bagian: [{ i: 0, k: 'pulsa' }] })],
    [S('Pesawat', P('62,150 30,95 72,95 100,150'), E(150, 155, 115, 32), P('135,170 108,245 150,245 195,170'),
       O(105, 152, 7), O(138, 152, 7), O(171, 152, 7)),
      cfg('terbang', 'wuss', 'Wuuus!', { v: 85 })],
    [S('Perahu', P('150,40 150,165 235,165'), P('140,62 140,165 80,165'), D('M40 170 H260 L225 235 H75 Z'),
       L('M145 35 V170'), L('M25 258 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0')),
      cfg('renang', 'klakson', 'Tuut!', { v: 45 })],
    [S('Kereta', R(65, 70, 32, 56, 6), R(35, 115, 140, 100, 24), R(150, 70, 105, 145, 14), R(172, 92, 60, 48, 8),
       C(88, 232, 28), C(195, 232, 28), O(88, 232, 8), O(195, 232, 8)),
      cfg('jalan', 'klakson', 'Tuut tuut!', { v: 55 })],
    [S('Pohon', R(128, 170, 44, 110, 8), C(150, 105, 70), C(92, 150, 46), C(208, 150, 46)),
      cfg('wajah', 'ting', 'Sraak!')],
    [S('Payung', D('M30 150 Q45 80 150 55 V150 Z'), D('M270 150 Q255 80 150 55 V150 Z'),
       L('M150 150 V235 q0 28 -26 28 M30 150 q30 22 60 0 q30 22 60 0 q30 22 60 0 q30 22 60 0')),
      cfg('benda', 'ting', 'Hujan!')],
    [S('Es krim', P('95,150 205,150 150,275'), C(150, 112, 55), C(150, 62, 38), O(150, 24, 8), L('M120 175 l30 80 M180 175 l-30 80')),
      cfg('benda', 'ting', 'Nyam!')],
    [S('Kado', R(60, 130, 180, 135, 10), R(48, 100, 204, 40, 10), R(138, 100, 24, 165, 4), E(118, 78, 32, 20), E(182, 78, 32, 20), O(150, 80, 9)),
      cfg('benda', 'ting', 'Hore!')]
  ];

  // ---- 10 BINATANG
  const BINATANG = [
    [S('Kelinci', D('M182 112 Q172 48 195 42 Q210 70 206 112 Z M214 108 Q214 52 238 50 Q242 82 232 112 Z'), C(55, 190, 17),
       E(125, 195, 75, 55), C(205, 140, 40), O(214, 130, 5), F('238,143 252,143 245,152'), L('M245 152 q-4 10 -12 10')),
      cfg('lari', 'ting', 'Hop hop!', { v: 80, mata: 1 })],
    [S('Gajah', R(65, 215, 36, 62, 12), R(150, 215, 36, 62, 12), E(125, 170, 85, 65), C(215, 125, 44), E(190, 135, 22, 34),
       D('M240 128 Q292 138 282 212 Q272 226 262 210 Q270 160 238 160 Z'), O(224, 112, 6), L('M45 165 q-14 22 -4 44')),
      cfg('jalan', 'trompet', 'Tuuut!', { v: 40, skala: .45, mata: 1 })],
    [S('Jerapah', R(82, 222, 26, 58, 8), R(148, 222, 26, 58, 8), E(125, 190, 70, 46), R(172, 72, 34, 130, 14), E(205, 60, 36, 24),
       O(213, 56, 4), O(120, 182, 9), O(148, 205, 8), O(189, 120, 7), O(190, 160, 7), L('M55 180 q-14 14 -8 40 M195 40 v-14 M210 40 v-14')),
      cfg('jalan', 'ting', 'Halo!', { v: 45, skala: .45 })],
    [S('Kura-kura', R(80, 185, 38, 48, 14), R(185, 185, 38, 48, 14), R(50, 185, 205, 24, 12), D('M62 192 Q70 92 152 92 Q238 92 246 192 Z'),
       E(268, 165, 28, 24), O(277, 158, 4), L('M152 95 V190 M100 125 Q152 160 204 125')),
      cfg('jalan', 'ting', 'Halo!', { v: 25, mata: 1 })],
    [S('Ayam', D('M80 170 Q38 120 58 98 Q98 122 98 175 Z'), E(140, 190, 68, 58), E(135, 195, 34, 28), C(205, 118, 30),
       P('232,112 266,122 232,132'), D('M190 92 Q190 62 205 78 Q212 56 222 78 Q234 64 228 96 Z'), O(213, 112, 5),
       L('M125 246 v30 M155 246 v30 M110 278 h30 M140 278 h30')),
      cfg('lari', 'kwek', 'Kok kok!', { v: 75, mata: 1 })],
    [S('Bebek', P('62,178 28,148 68,150'), E(128, 195, 78, 52), E(120, 190, 40, 26), C(205, 125, 32), E(246, 134, 26, 11), O(213, 116, 5)),
      cfg('jalan', 'kwek', 'Kwek kwek!', { v: 50, mata: 1 })],
    [S('Babi', R(85, 232, 28, 46, 8), R(162, 232, 28, 46, 8), E(135, 185, 85, 58), C(215, 160, 42), P('195,130 203,95 232,132'),
       E(252, 170, 22, 17), O(246, 170, 4), O(258, 170, 4), O(222, 148, 6), L('M52 175 q-22 0 -18 -20 q6 -12 14 0')),
      cfg('lari', 'oink', 'Oink!', { v: 60 })],
    [S('Katak', E(60, 250, 38, 20), E(240, 250, 38, 20), E(150, 175, 100, 70), C(100, 115, 28), C(200, 115, 28),
       O(100, 115, 9), O(200, 115, 9), L('M95 195 Q150 232 205 195')),
      cfg('lari', 'kodok', 'Kwok kwok!', { v: 70, mata: 1 })],
    [S('Kupu-kupu', E(95, 120, 62, 48), E(205, 120, 62, 48), E(105, 200, 44, 38), E(195, 200, 44, 38), R(135, 85, 30, 150, 14),
       L('M150 88 q-22 -40 -42 -50 M150 88 q22 -40 42 -50')),
      cfg('terbang', 'ting', 'Hai!', { v: 70, bagian: [0, 1, 2, 3].map(i => ({ i, k: 'kepak', asal: 'center' })) })],
    [S('Singa', C(72, 72, 26), C(228, 72, 26), C(150, 150, 110), C(150, 155, 70), E(150, 192, 38, 28),
       O(122, 140, 8), O(178, 140, 8), F('138,172 162,172 150,187'), L('M150 187 v14 q-14 14 -26 0 M150 201 q14 14 26 0')),
      cfg('wajah', 'aum', 'Aum!', { mata: 1 })]
  ];

  // ---- 5 DINOSAURUS
  const DINO = [
    [S('T-Rex', P('55,150 8,200 62,202'), D('M95 215 h75 v62 h-30 v-40 h-15 v40 h-30 z'), E(135, 175, 85, 60), E(188, 130, 40, 50),
       E(222, 100, 55, 36), O(240, 90, 6), L('M215 117 l8 10 l8 -10 l8 10 l8 -10 l8 10'), L('M205 160 l22 12 l-6 9')),
      cfg('lari', 'raung', 'Grrr!', { v: 65, skala: .45, mata: 1 })],
    [S('Spinosaurus', D('M80 125 Q100 30 140 68 Q165 18 200 68 Q218 40 226 125 Z'), P('58,158 8,198 62,205'),
       D('M100 205 h72 v62 h-28 v-40 h-16 v40 h-28 z'), E(140, 170, 92, 50), E(232, 128, 55, 26), O(250, 120, 5),
       L('M108 120 V72 M150 112 V52 M192 120 V72')),
      cfg('lari', 'raung', 'Grrr!', { v: 60, skala: .45, mata: 1 })],
    [S('Ankylosaurus', D('M80 190 h42 v45 h-42 z M185 190 h42 v45 h-42 z'), D('M55 190 Q60 100 150 98 Q240 100 245 190 Z'),
       D('M80 128 l16 -32 l16 32 z M126 110 l16 -34 l16 34 z M172 112 l16 -32 l16 32 z'), E(265, 185, 30, 22), C(16, 222, 18),
       L('M58 188 Q28 205 20 214'), O(274, 178, 4)),
      cfg('jalan', 'raung', 'Grrr!', { v: 30, mata: 1 })],
    [S('Brachiosaurus', D('M50 180 Q15 190 8 215 Q40 215 58 205 Z'), D('M70 225 h40 v55 h-40 z M150 225 h40 v55 h-40 z'),
       E(130, 190, 85, 55), D('M185 160 Q215 120 205 50 L237 45 Q252 130 215 195 Z'), E(240, 40, 30, 18), O(250, 36, 4)),
      cfg('jalan', 'raung', 'Hmmm!', { v: 28, skala: .45, mata: 1 })],
    [S('Pteranodon', P('122,150 10,95 38,160 18,205 122,205'), P('178,150 290,95 262,160 282,205 178,205'), E(150, 175, 30, 60),
       E(150, 105, 24, 28), P('140,90 150,28 160,90'), O(141, 103, 4), O(159, 103, 4)),
      cfg('terbang', 'raung', 'Aaak!', { v: 80, mata: 1, bagian: [{ i: 0, k: 'kepak', asal: 'center' }, { i: 1, k: 'kepak', asal: 'center' }] })]
  ];

  // ---- Daftarkan ke aplikasi
  const KAT = { binatang: [0, 1], benda: [5], dino: [] };   // 0 kucing, 1 ikan, 5 mobil sudah ada
  [['benda', BENDA], ['binatang', BINATANG], ['dino', DINO]].forEach(([k, arr]) => arr.forEach(([svg, c]) => {
    GAMBAR.push(svg); cache.push(null);
    const i = GAMBAR.length - 1;
    CONFIG[i] = c; KAT[k].push(i);
  }));

  // ---- Menu pilih kategori (khusus Si Kecil)
  const m = document.createElement('div');
  m.id = 'kategori'; m.hidden = true;
  m.innerHTML = '<h1>Mau gambar apa?</h1>' +
    '<button class="k" data-k="binatang"><span>🦁</span>Binatang</button>' +
    '<button class="k" data-k="benda"><span>🎈</span>Benda</button>' +
    '<button class="k" data-k="dino"><span>🦖</span>Dinosaurus</button>' +
    '<button class="x" aria-label="Tutup">✕</button>';
  document.body.appendChild(m);

  const mb = document.createElement('button');
  mb.id = 'menuGambar'; mb.textContent = '📚'; mb.setAttribute('aria-label', 'Pilih gambar');
  document.querySelector('.bar').insertBefore(mb, document.getElementById('prev'));
  mb.onclick = () => { bersih(); m.hidden = false; };

  m.querySelector('.x').onclick = () => { m.hidden = true; };
  m.querySelectorAll('.k').forEach(b => b.onclick = () => {
    bersih();
    if (document.body.dataset.tab === 'warna') simpan();
    BOLEH.kecil = KAT[b.dataset.k];
    idx = BOLEH.kecil[0];
    m.hidden = true; tampil(); bunyi(2);
  });

  new MutationObserver(() => { if (kat() === 'kecil') m.hidden = false; else m.hidden = true; })
    .observe(document.body, { attributes: true, attributeFilter: ['data-umur'] });
  if (kat() === 'kecil' && document.getElementById('umur').hidden) m.hidden = false;
})();
