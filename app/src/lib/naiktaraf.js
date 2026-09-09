// Naik taraf tanpa gerbang pembayaran.
//
// Peniaga bayar melalui DuitNow atau pindahan bank, kemudian penjual memberi
// satu kod. Kod itu terikat pada nama gerai, jadi kod yang tersebar dalam
// kumpulan WhatsApp tidak membuka aplikasi orang lain.
//
// Jujur tentang hadnya: garam di bawah ini terkandung dalam berkas yang dihantar
// ke pelayar, jadi sesiapa yang sanggup membaca kod aplikasi boleh menjana kod
// sendiri. Ia menutup pintu yang terbuka luas, bukan pintu berkunci. Pemeriksaan
// di pelayan hanya berbaloi selepas ada pelanggan yang cukup ramai.
const GARAM = "kira-gerai-2026";

// Tiada 0, O, 1 dan I supaya kod boleh dibaca melalui panggilan telefon.
const ABJAD = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export const NOMBOR_SOKONGAN = "60106640353"; // nombor WhatsApp penjual, format antarabangsa tanpa tanda tambah

export function namaAsas(nama) {
  return String(nama || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function fnv(teks, benih) {
  let h = benih >>> 0;
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function janaKod(namaGerai) {
  const asas = namaAsas(namaGerai);
  if (!asas) return "";
  const teks = asas + "|" + GARAM;
  const a = fnv(teks, 2166136261);
  const b = fnv(teks, 84696351);
  const huruf = [];
  for (let i = 0; i < 4; i++) huruf.push(ABJAD[(a >>> (i * 5)) & 31]);
  for (let i = 0; i < 4; i++) huruf.push(ABJAD[(b >>> (i * 5)) & 31]);
  return huruf.slice(0, 4).join("") + "-" + huruf.slice(4).join("");
}

export function bersihKod(kod) {
  return String(kod || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function kodSah(namaGerai, kod) {
  const betul = bersihKod(janaKod(namaGerai));
  return betul.length === 8 && bersihKod(kod) === betul;
}
