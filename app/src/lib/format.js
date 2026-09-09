export const HARI = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
export const HARI_PENDEK = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
export const BULAN = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];

export function dayKey(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function shiftDay(n, from) {
  const d = from ? new Date(from) : new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

export function fromKey(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function money(n) {
  const s = Math.abs(n)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (n < 0 ? "-" : "") + s;
}

export const rm = (n) => "RM " + money(n);
export const rm0 = (n) => "RM " + Math.round(n).toLocaleString("en-MY");

export function tarikhPenuh(d) {
  return HARI[d.getDay()] + ", " + d.getDate() + " " + BULAN[d.getMonth()] + " " + d.getFullYear();
}

export function tarikhPendek(k) {
  const d = fromKey(k);
  return d.getDate() + " " + BULAN[d.getMonth()];
}

// Hari bisnes, bukan hari kalendar.
//
// Peniaga pasar malam kemas gerai lepas tengah malam. Kalau kita ikut jam
// dinding, dia tekan Tutup Kira pukul 12.40 pagi dan jualan malam tadi jatuh
// ke hari esok yang masih kosong, jadi aplikasi lapor dia ada beratus ringgit
// lebih dalam tin dan malam yang baru habis itu tak pernah ditutup.
//
// `tamat` ialah jam pagi yang masih dikira sebagai malam semalam. Sifar
// bermakna ikut tengah malam macam biasa.
export function kunciHariBisnes(tamat, kini) {
  const d = kini ? new Date(kini) : new Date();
  if (tamat > 0 && d.getHours() < tamat) d.setDate(d.getDate() - 1);
  return dayKey(d);
}

export function kunciSemalam(k) {
  return dayKey(shiftDay(-1, fromKey(k)));
}

export function jamSekarang() {
  const n = new Date();
  return String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0");
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// "3 hari lepas", "semalam", "hari ni"
export function jarakHari(k, todayKey) {
  const a = fromKey(k).getTime();
  const b = fromKey(todayKey).getTime();
  const n = Math.round((b - a) / 86400000);
  if (n <= 0) return "hari ni";
  if (n === 1) return "semalam";
  if (n < 7) return n + " hari lepas";
  if (n < 30) return Math.floor(n / 7) + " minggu lepas";
  return Math.floor(n / 30) + " bulan lepas";
}

// 60123456789 daripada 012-345 6789
export function fonWhatsapp(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("60")) return d;
  if (d.startsWith("0")) return "60" + d.slice(1);
  return "60" + d;
}

// Papan nombor kumpul sen sebagai teks: "350" bermaksud RM 3.50.
export function nilaiBuf(buf) {
  return buf ? parseInt(buf, 10) / 100 : 0;
}
