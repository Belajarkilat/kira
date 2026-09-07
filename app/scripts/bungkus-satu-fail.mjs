// Ambil keluaran Vite dan gabungkan jadi satu fail HTML untuk diterbitkan
// sebagai pautan. Artifact membungkus fail ini dengan doctype, html, head dan
// body sendiri, jadi kita keluarkan tag itu dan tinggalkan title, style, isi
// dan skrip sahaja.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, "..", "dist-artifact");
const KELUAR = join(HERE, "..", "..", "kira-app.html");

const aset = join(DIST, "assets");
const fail = readdirSync(aset);
const namaJs = fail.find((f) => f.endsWith(".js"));
const namaCss = fail.find((f) => f.endsWith(".css"));

const js = readFileSync(join(aset, namaJs), "utf8");
const css = namaCss ? readFileSync(join(aset, namaCss), "utf8") : "";

if (js.includes("</script")) {
  throw new Error("Berkas JS mengandungi tag penutup skrip, tidak selamat untuk disisip.");
}

const html = `<title>Kira</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

writeFileSync(KELUAR, html, "utf8");
console.log("Satu fail ditulis:", KELUAR, Math.round(html.length / 1024) + " KB");
