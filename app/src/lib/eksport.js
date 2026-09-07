import { csvTeks } from "./derive.js";

// Dua tempat aplikasi ini hidup menyimpan fail dengan cara berbeza.
// Dalam pemapar Artifact, pautan muat turun biasa mati, jadi kita minta
// keupayaan downloads. Dalam PWA atau pelayar biasa, kita guna pautan blob.
export async function eksportCsv(S, hariIni) {
  const namaFail = "kira-" + hariIni + ".csv";
  const teks = "﻿" + csvTeks(S);

  if (typeof window !== "undefined" && typeof window.claude?.use === "function") {
    try {
      const downloads = await window.claude.use("downloads");
      if (downloads) {
        await downloads.save({ filename: namaFail, data: teks });
        return "Fail CSV disimpan";
      }
    } catch (e) {
      if (e?.code === "declined") return "Muat turun dibatalkan";
      if (e?.code === "rate_limited") return "Cuba sekejap lagi";
      return "Tempat ni tak benarkan muat turun";
    }
  }

  try {
    const blob = new Blob([teks], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = namaFail;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "Fail CSV dimuat turun";
  } catch (e) {
    return "Peranti ini tak benarkan muat turun";
  }
}
