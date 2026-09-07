import { useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Logo } from "../components/Ikon.jsx";

export default function Mula() {
  const { dispatch, isiContoh } = useStore();
  const [nama, setNama] = useState("");
  const [tukar, setTukar] = useState("100");
  const [masak, setMasak] = useState("");

  const boleh = nama.trim().length > 0;

  function mula() {
    if (!boleh) return;
    const duit = Math.max(0, parseFloat(String(tukar).replace(",", ".")) || 0);
    dispatch({
      type: "onboard",
      gerai: { nama: nama.trim(), duitTukar: duit, masak: Number(masak) || 0, unit: "bungkus" }
    });
  }

  return (
    <div className="mula">
      <div className="lockup">
        <Logo className="mark tly" />
        <div className="wordmark">
          k<span className="i">i</span>ra
        </div>
      </div>
      <p className="tagline">Kira sekejap, tahu untung.</p>

      <h1 className="lead">Dua soalan sehari. Itu je.</h1>
      <div className="dua-soal">
        <div className="soal">
          <span className="no">1</span>
          <span>
            <b>Pagi, berapa modal?</b>
            <small>Lepas balik pasar borong, masukkan belanja.</small>
          </span>
        </div>
        <div className="soal">
          <span className="no">2</span>
          <span>
            <b>Malam, berapa duit dalam tin?</b>
            <small>Kira duit, aplikasi bandingkan dengan yang sepatutnya.</small>
          </span>
        </div>
      </div>

      <label className="lbl-field">
        <span>Nama gerai</span>
        <input
          className="field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Nasi Lemak Kak Nor"
          autoComplete="off"
          enterKeyHint="done"
        />
      </label>

      <label className="lbl-field">
        <span>Duit tukar pagi (RM)</span>
        <input
          className="field"
          value={tukar}
          onChange={(e) => setTukar(e.target.value.replace(/[^\d.,]/g, ""))}
          inputMode="decimal"
          placeholder="100"
        />
        <small style={{ color: "var(--muted)", fontSize: 12.5 }}>
          Duit kecil yang kau letak dalam tin sebelum buka gerai. Boleh tukar kemudian.
        </small>
      </label>

      <label className="lbl-field">
        <span>Berapa bungkus kau masak sehari</span>
        <input
          className="field"
          value={masak}
          onChange={(e) => setMasak(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          placeholder="Boleh kosong"
        />
        <small style={{ color: "var(--muted)", fontSize: 12.5 }}>
          Kalau kau isi, Kira boleh cakap berapa patut kau masak esok.
        </small>
      </label>

      <div className="spacer" />

      <button className="save" disabled={!boleh} onClick={mula}>
        Mula Guna Kira
      </button>
      <button className="ghost" onClick={isiContoh}>
        Cuba dulu dengan data contoh
      </button>
      <p className="footnote">
        Semua rekod disimpan dalam telefon ini sahaja. Tiada akaun, tiada internet diperlukan.
      </p>
    </div>
  );
}
