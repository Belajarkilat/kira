// Lukis ikon aplikasi Kira (undi lidi) terus jadi PNG, tanpa pergantungan luar.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, "..", "public");

const INK = [26, 29, 22];
const KERTAS = [237, 235, 226];
const KUNYIT = [232, 163, 23];

// Segmen dalam ruang 48x48 seperti SVG jenama.
const BARS = [
  [11, 13, 11, 35],
  [19, 13, 19, 35],
  [27, 13, 27, 35],
  [35, 13, 35, 35]
];
const CROSS = [7, 36, 39, 12];
const LEBAR = 4.6;

function jarakKeSegmen(px, py, [x1, y1, x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const panjang = dx * dx + dy * dy;
  let t = panjang === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / panjang;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function crc32(buf) {
  let c;
  const jadual = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    jadual[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = jadual[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(jenis, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const badan = Buffer.concat([Buffer.from(jenis, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(badan));
  return Buffer.concat([len, badan, crc]);
}

function png(lebar, tinggi, piksel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lebar, 0);
  ihdr.writeUInt32BE(tinggi, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const baris = Buffer.alloc((lebar * 4 + 1) * tinggi);
  for (let y = 0; y < tinggi; y++) {
    baris[y * (lebar * 4 + 1)] = 0;
    piksel.copy(baris, y * (lebar * 4 + 1) + 1, y * lebar * 4, (y + 1) * lebar * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(baris, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function lukis(saiz, skalaKandungan) {
  const piksel = Buffer.alloc(saiz * saiz * 4);
  const SS = 3; // supersample untuk tepi licin
  const unit = saiz / 48;
  const tengah = saiz / 2;
  const r = (LEBAR / 2) * unit * skalaKandungan;

  const segmen = [...BARS.map((s) => ({ s, warna: KERTAS })), { s: CROSS, warna: KUNYIT }].map(
    ({ s, warna }) => ({
      s: s.map((v, i) => tengah + (v - 24) * unit * skalaKandungan),
      warna
    })
  );

  for (let y = 0; y < saiz; y++) {
    for (let x = 0; x < saiz; x++) {
      let rr = 0;
      let gg = 0;
      let bb = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS;
          const py = y + (sy + 0.5) / SS;
          let warna = INK;
          for (const { s, warna: w } of segmen) {
            if (jarakKeSegmen(px, py, s) <= r) warna = w;
          }
          rr += warna[0];
          gg += warna[1];
          bb += warna[2];
        }
      }
      const n = SS * SS;
      const i = (y * saiz + x) * 4;
      piksel[i] = Math.round(rr / n);
      piksel[i + 1] = Math.round(gg / n);
      piksel[i + 2] = Math.round(bb / n);
      piksel[i + 3] = 255;
    }
  }
  return png(saiz, saiz, piksel);
}

writeFileSync(join(PUBLIC, "ikon-192.png"), lukis(192, 1));
writeFileSync(join(PUBLIC, "ikon-512.png"), lukis(512, 1));
// Maskable: kandungan dikecilkan supaya selamat bila dikerat bulat.
writeFileSync(join(PUBLIC, "ikon-maskable.png"), lukis(512, 0.62));
console.log("Tiga ikon PNG ditulis ke public/");
