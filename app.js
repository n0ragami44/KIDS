// Clo Warna - Mode Si Kecil (tap area -> terisi warna)
const WARNA = ['#FF5A5F','#FF9F1C','#FFD93D','#5BD05B','#34C6E0','#4D7CFF','#B05CFF','#FF8FC8'];

// Setiap gambar: area bisa diwarnai (.a), bagian tetap (.f / .n)
const GAMBAR = [
  // Kucing
  `<svg viewBox="0 0 300 300" role="img" aria-label="Kucing">
    <polygon class="a" points="62,120 72,36 138,84"/>
    <polygon class="a" points="238,120 228,36 162,84"/>
    <circle class="a" cx="150" cy="170" r="98"/>
    <ellipse class="a" cx="150" cy="205" rx="44" ry="32"/>
    <circle class="f" cx="112" cy="155" r="9"/><circle class="f" cx="188" cy="155" r="9"/>
    <polygon class="f" points="138,188 162,188 150,202"/>
    <path class="n" d="M150 202 v12 M150 214 q-14 12 -26 0 M150 214 q14 12 26 0"/>
    <path class="n" d="M96 195 l-48 -8 M96 210 l-48 10 M204 195 l48 -8 M204 210 l48 10"/>
  </svg>`,
  // Ikan
  `<svg viewBox="0 0 300 300" role="img" aria-label="Ikan">
    <path class="a" d="M110 95 Q140 40 185 95 Z"/>
    <polygon class="a" points="225,150 288,92 288,208"/>
    <ellipse class="a" cx="140" cy="150" rx="102" ry="68"/>
    <path class="a" d="M120 190 Q150 240 175 190 Z"/>
    <circle class="f" cx="85" cy="135" r="11"/>
    <path class="n" d="M70 175 q14 12 28 0"/>
    <circle class="a" cx="60" cy="70" r="16"/>
    <circle class="a" cx="92" cy="40" r="11"/>
    <circle class="a" cx="40" cy="108" r="9"/>
  </svg>`,
  // Rumah
  `<svg viewBox="0 0 300 300" role="img" aria-label="Rumah">
    <circle class="a" cx="252" cy="52" r="30"/>
    <rect class="a" x="55" y="140" width="190" height="135"/>
    <polygon class="a" points="35,142 150,48 265,142"/>
    <rect class="a" x="130" y="195" width="42" height="80"/>
    <rect class="a" x="78" y="165" width="42" height="42"/>
    <rect class="a" x="182" y="165" width="42" height="42"/>
    <circle class="f" cx="161" cy="237" r="4"/>
    <path class="n" d="M99 165 v42 M78 186 h42 M203 165 v42 M182 186 h42"/>
  </svg>`
];

const stage = document.getElementById('stage');
const palet = document.getElementById('palet');
let idx = 0, warna = WARNA[0], suara = null;
const simpan = GAMBAR.map(() => ({}));   // warna tiap area per gambar

// ---- Suara (tangga nada pentatonik, tanpa file audio)
function bunyi(i) {
  try {
    suara = suara || new (window.AudioContext || window.webkitAudioContext)();
    const nada = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5][i % 8];
    const o = suara.createOscillator(), g = suara.createGain();
    o.type = 'triangle'; o.frequency.value = nada;
    g.gain.setValueAtTime(.25, suara.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, suara.currentTime + .4);
    o.connect(g).connect(suara.destination);
    o.start(); o.stop(suara.currentTime + .4);
  } catch (e) {}
}

// ---- Tampilkan gambar
function tampil() {
  stage.innerHTML = GAMBAR[idx];
  const svg = stage.firstElementChild;
  svg.querySelectorAll('.a').forEach((el, n) => {
    if (simpan[idx][n]) el.style.fill = simpan[idx][n];
    el.addEventListener('pointerdown', () => {
      el.style.fill = warna;
      simpan[idx][n] = warna;
      el.classList.remove('goyang'); void el.getBoundingClientRect();
      el.classList.add('goyang');
      bunyi(WARNA.indexOf(warna));
      if (navigator.vibrate) navigator.vibrate(15);
    });
  });
}

// ---- Palet
WARNA.forEach((w, i) => {
  const b = document.createElement('button');
  b.style.background = w; b.setAttribute('aria-label', 'Warna ' + (i + 1));
  b.setAttribute('aria-pressed', i === 0);
  b.onclick = () => {
    warna = w; bunyi(i);
    palet.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  };
  palet.appendChild(b);
});

// ---- Tombol
const ganti = d => { idx = (idx + d + GAMBAR.length) % GAMBAR.length; tampil(); };
document.getElementById('prev').onclick = () => ganti(-1);
document.getElementById('next').onclick = () => ganti(1);
document.getElementById('ulang').onclick = () => { simpan[idx] = {}; tampil(); };
document.getElementById('hidup').onclick = () => {
  const svg = stage.firstElementChild;
  svg.classList.add('hidup'); bunyi(3);
  setTimeout(() => svg.classList.remove('hidup'), 3000);
};

tampil();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
