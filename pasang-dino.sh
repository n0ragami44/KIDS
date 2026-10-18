#!/bin/bash
# Jalankan dari ~/KIDS setelah unzip: bash pasang-dino.sh
set -e
for f in menu.js hidup.js; do [ -f "$f" ] || { echo "BERHENTI: $f belum ada. Selesaikan update 7 dulu."; exit 1; }; done
[ -f dino.js ] && [ -d gambar/dino ] || { echo "BERHENTI: dino.js atau gambar/dino tidak ada. Unzip dulu."; exit 1; }

grep -q "HIDUP.KAT = KAT" menu.js || sed -i 's#^  // ---- Menu pilih kategori (khusus Si Kecil)$#  HIDUP.KAT = KAT;\n&#' menu.js
grep -q "HIDUP.KAT = KAT" menu.js || { echo "BERHENTI: menu.js tidak cocok, kirim isinya ke Clo."; exit 1; }

grep -q "foto .a" style.css || cat >> style.css <<'EOF2'

/* ---- Gambar dari aset (garis halus + area warna) ---- */
.foto .a,.foto .garis{stroke:none}
EOF2

grep -q dino.js index.html || sed -i 's#<script src="menu.js"></script>#&\n<script src="dino.js"></script>#' index.html
grep -q " gambar www/" .github/workflows/apk.yml || sed -i 's#icon.svg www/#icon.svg gambar www/#; s#cp index.html#cp -r index.html#' .github/workflows/apk.yml

grep -q dino.js index.html && echo "index.html OK"
grep -q " gambar www/" .github/workflows/apk.yml && echo "apk.yml OK"
ls gambar/dino
echo "Selesai!"
