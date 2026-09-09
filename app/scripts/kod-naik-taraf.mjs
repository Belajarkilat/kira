// Jana kod naik taraf untuk satu gerai, selepas peniaga bayar.
//
//   node scripts/kod-naik-taraf.mjs "Nasi Lemak Kak Nor"
//
// Nama mesti sama dengan nama gerai dalam aplikasi peniaga, huruf besar kecil
// dan tanda baca tidak penting.
import { janaKod, namaAsas } from "../src/lib/naiktaraf.js";

const nama = process.argv.slice(2).join(" ").trim();
if (!nama) {
  console.error("Guna: node scripts/kod-naik-taraf.mjs \"Nama Gerai\"");
  process.exit(1);
}
if (!namaAsas(nama)) {
  console.error("Nama gerai mesti ada sekurang-kurangnya satu huruf atau angka.");
  process.exit(1);
}
console.log("Gerai : " + nama);
console.log("Kod   : " + janaKod(nama));
