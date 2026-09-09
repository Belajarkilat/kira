// Dua tempat aplikasi ini hidup menyimpan fail dengan cara berbeza.
// Dalam pemapar Artifact, pautan muat turun biasa mati, jadi kita minta
// keupayaan downloads. Dalam PWA atau pelayar biasa, kita guna pautan blob.
export async function muatTurun(namaFail, teks, jenis) {
  if (typeof window !== "undefined" && typeof window.claude?.use === "function") {
    try {
      const downloads = await window.claude.use("downloads");
      if (downloads) {
        await downloads.save({ filename: namaFail, data: teks });
        return "Fail disimpan";
      }
    } catch (e) {
      if (e?.code === "declined") return "Muat turun dibatalkan";
      if (e?.code === "rate_limited") return "Cuba sekejap lagi";
      return "Tempat ni tak benarkan muat turun";
    }
  }

  try {
    const blob = new Blob([teks], { type: jenis });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = namaFail;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return "Fail dimuat turun";
  } catch (e) {
    return "Peranti ini tak benarkan muat turun";
  }
}

// Baca fail yang peniaga pilih. Dipisahkan supaya skrin tidak perlu tahu
// pasal FileReader.
export function bacaFail(fail) {
  return new Promise((selesai, gagal) => {
    const r = new FileReader();
    r.onload = () => selesai(String(r.result || ""));
    r.onerror = () => gagal(new Error("Fail tak dapat dibaca"));
    r.readAsText(fail);
  });
}
