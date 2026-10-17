// Pilih umur: Si Kecil (2-4 th) / Si Jago (5-7 th). Dimuat setelah app.js.
(function () {
  const SET = {
    kecil: ['#FF5A5F', '#FF9F1C', '#FFD93D', '#5BD05B', '#4D7CFF', '#FF8FC8'],
    jago:  ['#FF5A5F', '#FF9F1C', '#FFD93D', '#5BD05B', '#34C6E0', '#4D7CFF', '#B05CFF', '#FF8FC8']
  };
  const UKURAN = [18, 28, 44];
  let us = 1;

  // Tombol ukuran kuas (hanya tampil di Si Jago)
  const ukBtn = document.createElement('button');
  ukBtn.id = 'ukuran'; ukBtn.textContent = '●';
  ukBtn.setAttribute('aria-label', 'Ukuran kuas');
  document.querySelector('.bar').insertBefore(ukBtn, document.getElementById('hidup'));
  ukBtn.onclick = () => {
    us = (us + 1) % 3;
    document.documentElement.style.setProperty('--kuas', UKURAN[us]);
    ukBtn.textContent = ['•', '●', '⬤'][us];
    bunyi(us * 2);
  };

  // Layar pilih umur
  const pick = document.createElement('div');
  pick.id = 'umur'; pick.hidden = true;
  pick.innerHTML = '<h1>Umur berapa?</h1>' +
    '<button class="b1" data-k="kecil"><span>🧸</span>2–4 tahun</button>' +
    '<button class="b2" data-k="jago"><span>🎨</span>5–7 tahun</button>';
  document.body.appendChild(pick);
  pick.querySelectorAll('button').forEach(b => b.onclick = () => terapkan(b.dataset.k, true));

  function terapkan(k, simpanPilihan) {
    if (simpanPilihan) { try { localStorage.setItem('umur', k); } catch (e) {} }
    document.body.dataset.umur = k;
    WARNA.length = 0; WARNA.push(...SET[k]);
    wi = 0;
    mode = k === 'kecil' ? 'isi' : 'kuas';
    modeBtn.textContent = mode === 'kuas' ? '🖌️' : '🪣';

    palet.innerHTML = '';
    WARNA.forEach((w, i) => {
      const b = document.createElement('button');
      b.className = 'w'; b.style.background = w;
      b.setAttribute('aria-label', 'Warna ' + (i + 1) + ', nada ' + NAMA[i]);
      b.setAttribute('aria-pressed', i === 0);
      b.onclick = () => {
        wi = i; bunyi(i);
        palet.querySelectorAll('button.w').forEach(x => x.setAttribute('aria-pressed', x === b));
      };
      palet.appendChild(b);
    });

    // Ganti umur: harus ditahan 1,2 detik (supaya tidak kepencet anak)
    const g = document.createElement('button');
    g.id = 'gantiumur'; g.textContent = 'ganti umur (tahan)';
    let t;
    g.onpointerdown = () => { t = setTimeout(() => { pick.hidden = false; }, 1200); };
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => g.addEventListener(ev, () => clearTimeout(t)));
    palet.appendChild(g);

    pick.hidden = true;
  }

  let k = null;
  try { k = localStorage.getItem('umur'); } catch (e) {}
  if (SET[k]) terapkan(k, false);
  else { terapkan('jago', false); pick.hidden = false; }
})();
