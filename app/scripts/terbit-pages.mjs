// Bina aplikasi dan tolak keluaran ke cawangan gh-pages.
// Token dibaca dari C:\Users\Hasfi\.claude\.env dan tidak pernah dicetak.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, mkdirSync, cpSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const DIST = join(APP, "dist");

const PEMILIK = "Belajarkilat";
const REPO = "kira";
const LALUAN_ASAS = "/" + REPO + "/";
const ENV_FAIL = "C:\\Users\\Hasfi\\.claude\\.env";

function token() {
  const teks = readFileSync(ENV_FAIL, "utf8");
  const padan = teks.match(/^GITHUB_TOKEN=(.*)$/m);
  if (!padan) throw new Error("GITHUB_TOKEN tiada dalam " + ENV_FAIL);
  return padan[1].trim();
}

function jalan(perintah, args, cwd, env) {
  execFileSync(perintah, args, { cwd, stdio: "inherit", env: { ...process.env, ...env } });
}

const tok = token();
const kerja = join(tmpdir(), "kira-gh-pages");

console.log("Membina dengan laluan asas " + LALUAN_ASAS);
jalan("npm", ["run", "build"], APP, { BASE_PATH: LALUAN_ASAS });

console.log("Menyediakan cawangan gh-pages");
rmSync(kerja, { recursive: true, force: true });
mkdirSync(kerja, { recursive: true });
cpSync(DIST, kerja, { recursive: true });

// Halang Jekyll daripada memproses keluaran, dan hantar 404 ke aplikasi
// supaya laluan dalam tidak mati kalau ditambah kemudian.
writeFileSync(join(kerja, ".nojekyll"), "");
cpSync(join(kerja, "index.html"), join(kerja, "404.html"));

const tarikh = new Date().toISOString().slice(0, 16).replace("T", " ");
jalan("git", ["init", "-b", "gh-pages", "-q"], kerja);
jalan("git", ["config", "user.name", "Belajarkilat"], kerja);
jalan("git", ["config", "user.email", "hasfizullahmokhtar@gmail.com"], kerja);
jalan("git", ["add", "-A"], kerja);
jalan("git", ["commit", "-q", "-m", "Terbit " + tarikh], kerja);

console.log("Menolak ke GitHub");
const url = "https://x-access-token:" + tok + "@github.com/" + PEMILIK + "/" + REPO + ".git";
jalan("git", ["push", "--force", "--quiet", url, "gh-pages"], kerja);

rmSync(kerja, { recursive: true, force: true });
console.log("Siap. https://" + PEMILIK.toLowerCase() + ".github.io/" + REPO + "/");
