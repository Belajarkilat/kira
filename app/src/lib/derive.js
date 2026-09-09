import { dayKey, shiftDay, money, BULAN } from "./format.js";
import { HAD_PERCUBAAN } from "./storage.js";

// Empat jenis rekod, dan dua soalan berbeza yang mereka jawab.
//
// Untung  = jualan - modal. Jualan hutang masuk kiraan ini pada hari barang
//           keluar, sebab untung terhasil masa barang bertukar tangan.
// Dalam tin = duit tukar + jualan tunai + kutip hutang - modal - rumah. Jualan
//           hutang tidak masuk sini sebab duitnya memang belum ada dalam tin,
//           dan kutip hutang masuk sini sahaja sebab untungnya sudah dikira.
//
// Rumah ialah duit yang keluar dari tin masuk ke hidup peniaga, bukan kos bisnes,
// jadi ia tidak menolak untung tetapi ia menolak baki yang sepatutnya ada dalam tin.
export function ofDay(S, k) {
  let jualan = 0;
  let jualanTunai = 0;
  let modal = 0;
  let rumah = 0;
  let kutip = 0;
  const list = [];
  for (const e of S.entries) {
    if (e.day !== k) continue;
    list.push(e);
    if (e.type === "jualan") {
      jualan += e.amount;
      if (e.tunai !== false) jualanTunai += e.amount;
    } else if (e.type === "rumah") rumah += e.amount;
    else if (e.type === "kutip") kutip += e.amount;
    else modal += e.amount;
  }
  list.sort((a, c) => (c.t || "").localeCompare(a.t || ""));
  return {
    jualan,
    jualanTunai,
    hutangBaru: jualan - jualanTunai,
    modal,
    rumah,
    kutip,
    untung: jualan - modal,
    list
  };
}

export function patutDalamTin(S, k) {
  const t = ofDay(S, k);
  return S.gerai.duitTukar + t.jualanTunai + t.kutip - t.modal - t.rumah;
}

export function tujuhHari(S, todayKey) {
  const hari = [];
  for (let i = 6; i >= 0; i--) {
    const d = shiftDay(-i);
    const k = dayKey(d);
    const t = ofDay(S, k);
    hari.push({ d, k, untung: t.untung, jualan: t.jualan, modal: t.modal, rumah: t.rumah, kutip: t.kutip, hariIni: k === todayKey });
  }
  return hari;
}

export function jumlahJulat(S, dariN, hinggaN) {
  let untung = 0;
  let jualan = 0;
  let modal = 0;
  let rumah = 0;
  for (let i = dariN; i >= hinggaN; i--) {
    const t = ofDay(S, dayKey(shiftDay(-i)));
    untung += t.untung;
    jualan += t.jualan;
    modal += t.modal;
    rumah += t.rumah;
  }
  return { untung, jualan, modal, rumah };
}

export function hutangBelumBayar(S) {
  return S.hutang.filter((h) => !h.paid);
}

export function jumlahHutang(S) {
  return hutangBelumBayar(S).reduce((a, h) => a + h.amount, 0);
}

export function bilanganTutup(S) {
  return Object.keys(S.closes).length;
}

export function statusPercubaan(S) {
  const tutup = bilanganTutup(S);
  const baki = Math.max(0, HAD_PERCUBAAN - tutup);
  return { tutup, baki, had: HAD_PERCUBAAN, peratus: Math.min(100, Math.round((tutup / HAD_PERCUBAAN) * 100)) };
}

export function terkunci(S) {
  return S.plan === "locked";
}

export function marginBarang(m) {
  if (!m.harga) return 0;
  return Math.round(((m.harga - m.modal) / m.harga) * 100);
}

// Harga cadangan supaya margin sampai 60%, dibundarkan ke 50 sen terdekat.
export function hargaCadangan(m) {
  return Math.ceil((m.modal / 0.6) * 2) / 2;
}

// ---------- bulan ----------

export function kunciBulan(k) {
  return k.slice(0, 7);
}

export function namaBulan(bk) {
  const [y, m] = bk.split("-");
  return BULAN[Number(m) - 1] + " " + y;
}

export function ringkasBulan(S, todayKey) {
  const bk = kunciBulan(todayKey);
  let jualan = 0;
  let modal = 0;
  let rumah = 0;
  let kutip = 0;
  for (const e of S.entries) {
    if (kunciBulan(e.day) !== bk) continue;
    if (e.type === "jualan") jualan += e.amount;
    else if (e.type === "rumah") rumah += e.amount;
    else if (e.type === "kutip") kutip += e.amount;
    else modal += e.amount;
  }

  let bezaDikesan = 0;
  let bilTutup = 0;
  for (const [k, c] of Object.entries(S.closes)) {
    if (kunciBulan(k) !== bk) continue;
    bilTutup += 1;
    bezaDikesan += Math.abs(c.beza || 0);
  }

  // Dikira dari entri kutip, bukan dari senarai hutang, supaya angka ini kekal
  // sama dengan duit yang benar-benar masuk tin bulan ini.
  const hutangKutip = kutip;

  const untung = jualan - modal;
  return {
    bk,
    nama: namaBulan(bk),
    jualan,
    modal,
    rumah,
    untung,
    baki: untung - rumah,
    bezaDikesan,
    bilTutup,
    hutangKutip,
    tangkap: bezaDikesan + hutangKutip
  };
}

// Ayat yang peniaga forward dalam WhatsApp. Angka dia sendiri, bukan senarai ciri kita.
export function ayatKad(S, todayKey, tunjukAngka = true) {
  const b = ringkasBulan(S, todayKey);
  const wang = (n) => (tunjukAngka ? "RM " + money(n) : "RM ---");
  const baris = [
    b.nama + ", " + (S.gerai.nama || "gerai saya") + ".",
    "Untung " + wang(b.untung) + ", saya ambil " + wang(b.rumah) + " untuk rumah."
  ];
  if (b.bezaDikesan > 0) baris.push("Kira tangkap " + wang(b.bezaDikesan) + " beza duit dalam tin.");
  if (b.hutangKutip > 0) baris.push("Saya kutip " + wang(b.hutangKutip) + " hutang lama.");
  baris.push("Saya guna Kira. Kira sekejap, tahu untung.");
  return baris.join("\n");
}

// ---------- berapa nak masak esok ----------

export function saranMasak(S, todayKey) {
  const kunci = Object.keys(S.closes).sort();
  const semalam = kunci.filter((k) => k <= todayKey).pop();
  if (!semalam) return null;
  const c = S.closes[semalam];
  if (!c || !c.habis) return null;

  const masak = S.gerai.masak || 0;
  const unit = S.gerai.unit || "bungkus";
  const lebih = c.lebih || 0;

  if (c.habis === "takhabis" || lebih > 0) {
    const kurang = lebih || Math.max(5, Math.round(masak * 0.1));
    return {
      nada: "kurang",
      tajuk: "Esok kurangkan " + kurang + " " + unit,
      sebab: lebih
        ? "Semalam tinggal " + lebih + " " + unit + ". Itu modal yang tak pulang."
        : "Semalam tak habis. Masak lebih sikit dari yang laku."
    };
  }

  if (c.habis === "awal") {
    const tambah = masak ? Math.max(5, Math.round(masak * 0.1)) : 10;
    return {
      nada: "tambah",
      tajuk: "Esok tambah " + tambah + " " + unit,
      sebab: "Semalam habis sebelum 9 pagi. Ada pelanggan yang kau tak sempat layan."
    };
  }

  return {
    nada: "kekal",
    tajuk: "Jumlah semalam kena",
    sebab: "Habis dalam masa yang betul dan tiada lebih. Kekalkan jumlah yang sama."
  };
}

// ---------- eksport ----------

export function barisCsv(S) {
  const baris = [["tarikh", "masa", "jenis", "butiran", "jumlah"]];
  const nama = { jualan: "Jualan", belian: "Modal", rumah: "Ambil untuk rumah", kutip: "Kutip hutang" };
  const isih = S.entries.slice().sort((a, b) => (a.day + (a.t || "")).localeCompare(b.day + (b.t || "")));
  for (const e of isih) {
    const jenis = e.type === "jualan" && e.tunai === false ? "Jualan hutang" : nama[e.type] || e.type;
    baris.push([e.day, e.t || "", jenis, e.note || "", e.amount.toFixed(2)]);
  }
  return baris;
}

export function csvTeks(S) {
  return barisCsv(S)
    .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(","))
    .join("\r\n");
}
