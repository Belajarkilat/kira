import { keadaanKosong, naikTarafKeadaan, VERSI } from "./storage.js";

// Semua rekod duduk dalam localStorage sahaja. Kalau peniaga tukar telefon atau
// pelayar kosongkan data tapaknya, rekod bertahun-tahun hilang tanpa jejak.
// Sandaran ini satu-satunya jalan keluar yang tidak perlukan pelayan.
export function teksSandaran(S) {
  return JSON.stringify(
    { aplikasi: "kira", v: S.v || VERSI, disimpan: new Date().toISOString(), keadaan: S },
    null,
    2
  );
}

export function namaFailSandaran(hariIni, namaGerai) {
  const gerai = String(namaGerai || "kira")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return "kira-sandaran-" + (gerai || "kira") + "-" + hariIni + ".json";
}

// Terima fail sandaran kita sendiri, dan juga keadaan mentah kalau ada orang
// simpan isi localStorage terus. Naikkan ke bentuk semasa sebelum dipulangkan.
export function bacaSandaran(teks) {
  let p;
  try {
    p = JSON.parse(teks);
  } catch (e) {
    throw new Error("Fail ni bukan fail sandaran Kira");
  }
  const k = p && p.aplikasi === "kira" ? p.keadaan : p;
  if (!k || typeof k !== "object" || !Array.isArray(k.entries) || !k.gerai) {
    throw new Error("Fail ni bukan fail sandaran Kira");
  }
  return naikTarafKeadaan({ ...keadaanKosong(), ...k });
}

export function ringkasSandaran(k) {
  const hutang = Array.isArray(k.hutang) ? k.hutang.length : 0;
  const tutup = k.closes ? Object.keys(k.closes).length : 0;
  return k.entries.length + " rekod, " + hutang + " hutang, " + tutup + " kali tutup kira";
}
