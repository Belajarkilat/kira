import { dayKey, shiftDay, uid } from "./format.js";

export const KEY = "kira.v1";
export const VERSI = 1;
export const HAD_PERCUBAAN = 30; // dikira ikut bilangan tutup kira, bukan hari kalendar

export function keadaanKosong() {
  return {
    v: VERSI,
    onboarded: false,
    gerai: { nama: "", duitTukar: 100, masak: 0, unit: "bungkus" },
    plan: "trial",
    tema: "auto",
    entries: [],
    closes: {},
    hutang: [],
    menu: []
  };
}

export const KATEGORI_RUMAH = [
  "Duit dapur",
  "Yuran sekolah",
  "Belanja anak",
  "Anak universiti",
  "Sewa rumah",
  "Bil air dan elektrik",
  "Ubat dan klinik",
  "Baiki motor",
  "Bayar hutang lain"
];

export const HABIS = [
  { id: "awal", label: "Sebelum 9 pagi" },
  { id: "kena", label: "9 hingga 10 pagi" },
  { id: "lewat", label: "Lepas 10 pagi" },
  { id: "takhabis", label: "Tak habis" }
];

export const KATEGORI_MODAL = [
  "Ayam",
  "Daging",
  "Ikan",
  "Sayur & bawang",
  "Beras & tepung",
  "Minyak masak",
  "Santan & kelapa",
  "Gula & susu",
  "Gas",
  "Plastik & bungkus",
  "Ais",
  "Sewa lot",
  "Minyak kereta",
  "Upah pekerja"
];

export function menuContoh() {
  return [
    { id: uid(), nama: "Nasi lemak bungkus", modal: 1.2, harga: 3.0 },
    { id: uid(), nama: "Nasi lemak ayam goreng", modal: 5.2, harga: 7.0 },
    { id: uid(), nama: "Ayam goreng sekeping", modal: 2.9, harga: 5.0 },
    { id: uid(), nama: "Karipap sardin", modal: 0.55, harga: 1.5 },
    { id: uid(), nama: "Teh o ais", modal: 0.45, harga: 2.0 },
    { id: uid(), nama: "Air bandung", modal: 0.8, harga: 3.0 },
    { id: uid(), nama: "Kopi ais tarik", modal: 1.1, harga: 2.5 }
  ];
}

// Data contoh untuk cuba rasa aplikasi tanpa kena rekod tujuh hari dulu.
export function dataContoh() {
  const s = keadaanKosong();
  s.onboarded = true;
  s.gerai = { nama: "Nasi Lemak Kak Nor", duitTukar: 100, masak: 120, unit: "bungkus" };
  s.menu = menuContoh();

  const corak = [
    { j: 612, b: 238 },
    { j: 548, b: 196 },
    { j: 701, b: 262 },
    { j: 494, b: 210 },
    { j: 836, b: 305 },
    { j: 918, b: 341 }
  ];
  for (let i = 6; i >= 1; i--) {
    const k = dayKey(shiftDay(-i));
    const p = corak[6 - i];
    s.entries.push({ id: uid(), type: "belian", amount: p.b, note: "Belanja pasar borong", day: k, t: "06:40" });
    s.entries.push({ id: uid(), type: "jualan", amount: p.j, note: "Jualan sehari", day: k, t: "14:10" });
    const rumah = [0, 40, 0, 120, 25, 0][6 - i];
    if (rumah) {
      s.entries.push({ id: uid(), type: "rumah", amount: rumah, note: "Duit dapur", day: k, t: "16:20" });
    }
    const patut = s.gerai.duitTukar + p.j - p.b - rumah;
    const tunai = patut - [0, 0, 6.5, 0, 0, 12][6 - i];
    s.closes[k] = { tunai, patut, beza: tunai - patut, habis: ["kena", "awal", "lewat", "kena", "awal", "kena"][6 - i], lebih: [0, 0, 14, 3, 0, 0][6 - i] };
  }

  const hariIni = dayKey(shiftDay(0));
  [
    ["belian", 86.0, "Ayam", "06:15"],
    ["belian", 42.5, "Beras & tepung", "06:22"],
    ["belian", 31.0, "Sayur & bawang", "06:30"],
    ["jualan", 126.0, "Nasi lemak bungkus", "07:05"],
    ["jualan", 84.0, "Nasi lemak ayam goreng", "07:40"],
    ["jualan", 38.0, "Teh o ais", "08:15"],
    ["jualan", 57.0, "Air bandung", "09:02"],
    ["rumah", 60.0, "Belanja anak", "15:40"]
  ].forEach(([type, amount, note, t]) => {
    s.entries.push({ id: uid(), type, amount, note, day: hariIni, t });
  });

  s.hutang = [
    { id: uid(), nama: "Abang Din lori sampah", fon: "0123456789", amount: 24.0, day: dayKey(shiftDay(-2)), paid: false },
    { id: uid(), nama: "Kak Zana kedai gunting", fon: "", amount: 12.5, day: dayKey(shiftDay(-1)), paid: false },
    { id: uid(), nama: "Pak Cik Rahim", fon: "", amount: 8.0, day: dayKey(shiftDay(-4)), paid: true, paidDay: dayKey(shiftDay(-1)) }
  ];
  return s;
}

export function muat() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return keadaanKosong();
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object") return keadaanKosong();
    return { ...keadaanKosong(), ...p, gerai: { ...keadaanKosong().gerai, ...(p.gerai || {}) } };
  } catch (e) {
    return keadaanKosong();
  }
}

export function simpan(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch (e) {
    return false;
  }
}
