// Clo Warna - kuas manual (default) + mode isi sekali tap
const NS = 'http://www.w3.org/2000/svg';
const WARNA = ['#FF5A5F','#FF9F1C','#FFD93D','#5BD05B','#34C6E0','#4D7CFF','#B05CFF','#FF8FC8'];
const NAMA  = ['Do','Re','Mi','Fa','Sol','La','Si','Do'];
const NADA  = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5]; // do re mi fa sol la si do

const GAMBAR = [
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
const modeBtn = document.getElementById('mode');
let idx = 0, wi = 0, mode = 'kuas', suara = null;
const cache = GAMBAR.map(() => null);

// ---- Nada
function bunyi(i) {
  try {
    suara = suara || new (window.AudioContext || window.webkitAudioContext)();
    if (suara.state === 'suspended') suara.resume();
    const o = suara.createOscillator(), g = suara.createGain();
    o.type = 'triangle'; o.frequency.value = NADA[i % 8];
    g.gain.setValueAtTime(.28, suara.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, suara.currentTime + .55);
    o.connect(g).connect(suara.destination);
    o.start(); o.stop(suara.currentTime + .55);
  } catch (e) {}
}

// ---- Siapkan gambar: tiap area = grup (isi putih + lapisan kuas terpotong + garis)
function siapkan(svg) {
  const defs = document.createElementNS(NS, 'defs');
  svg.insertBefore(defs, svg.firstChild);
  svg.querySelectorAll('.a').forEach((el, n) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'area');
    el.parentNode.replaceChild(g, el);
    g.appendChild(el);
    const klip = document.createElementNS(NS, 'clipPath');
    klip.id = 'k' + n;
    const salin = el.cloneNode(false); salin.removeAttribute('class');
    klip.appendChild(salin); defs.appendChild(klip);
    const cat = document.createElementNS(NS, 'g');
    cat.setAttribute('class', 'cat');
    cat.setAttribute('clip-path', `url(#k${n})`);
    g.appendChild(cat);
    const garis = el.cloneNode(false); garis.setAttribute('class', 'garis');
    g.appendChild(garis);
  });
}

function isi(g) {
  g.querySelector('.a').style.fill = WARNA[wi];
  g.querySelector('.cat').innerHTML = '';
  g.classList.remove('goyang'); void g.getBoundingClientRect(); g.classList.add('goyang');
}

// ---- Sentuhan: kuas bebas di dalam area yang pertama disentuh
function pasang(svg) {
  let cur = null, d = '';
  const titik = e => {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    return [q.x.toFixed(1), q.y.toFixed(1)];
  };
  svg.addEventListener('pointerdown', e => {
    const g = e.target.closest && e.target.closest('g.area');
    if (!g) return;
    bunyi(wi);
    if (navigator.vibrate) navigator.vibrate(10);
    if (mode === 'isi') { isi(g); return; }
    svg.setPointerCapture(e.pointerId);
    const [x, y] = titik(e);
    d = `M${x} ${y}l.01 0`;
    cur = document.createElementNS(NS, 'path');
    cur.setAttribute('class', 'sapu');
    cur.setAttribute('stroke', WARNA[wi]);
    cur.setAttribute('d', d);
    g.querySelector('.cat').appendChild(cur);
  });
  svg.addEventListener('pointermove', e => {
    if (!cur) return;
    const [x, y] = titik(e);
    d += `L${x} ${y}`; cur.setAttribute('d', d);
  });
  const stop = () => { cur = null; };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
}

function tampil() {
  stage.innerHTML = cache[idx] || GAMBAR[idx];
  const svg = stage.firstElementChild;
  if (!cache[idx]) siapkan(svg);
  pasang(svg);
}
function simpan() {
  const svg = stage.firstElementChild;
  if (!svg) return;
  svg.classList.remove('hidup');
  svg.querySelectorAll('.goyang').forEach(x => x.classList.remove('goyang'));
  cache[idx] = stage.innerHTML;
}

// ---- Palet: tiap warna = satu nada (do re mi fa sol la si do)
WARNA.forEach((w, i) => {
  const b = document.createElement('button');
  b.style.background = w;
  b.setAttribute('aria-label', `Warna ${i + 1}, nada ${NAMA[i]}`);
  b.setAttribute('aria-pressed', i === 0);
  b.onclick = () => {
    wi = i; bunyi(i);
    palet.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  };
  palet.appendChild(b);
});

// ---- Tombol
const ganti = d => { simpan(); idx = (idx + d + GAMBAR.length) % GAMBAR.length; tampil(); };
document.getElementById('prev').onclick = () => ganti(-1);
document.getElementById('next').onclick = () => ganti(1);
document.getElementById('ulang').onclick = () => { cache[idx] = null; tampil(); };
modeBtn.onclick = () => {
  mode = mode === 'kuas' ? 'isi' : 'kuas';
  modeBtn.textContent = mode === 'kuas' ? '🖌️' : '🪣';
  bunyi(mode === 'kuas' ? 0 : 4);
};
document.getElementById('hidup').onclick = () => {
  const svg = stage.firstElementChild;
  svg.classList.add('hidup');
  [0, 2, 4, 7].forEach((n, k) => setTimeout(() => bunyi(n), k * 170));
  setTimeout(() => svg.classList.remove('hidup'), 3000);
};

tampil();

// Service worker dimatikan: di APK, file baru dibawa oleh update APK itu sendiri.
// Ini juga membersihkan cache lama supaya versi baru langsung tampil.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));
}
if (window.caches) caches.keys().then(k => k.forEach(x => caches.delete(x)));
