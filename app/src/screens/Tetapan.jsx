import { useState } from "react";
import { useStore } from "../lib/store.jsx";
import { statusPercubaan } from "../lib/derive.js";
import { eksportCsv } from "../lib/eksport.js";
import { rm } from "../lib/format.js";
import { Balik } from "../components/Ikon.jsx";

const TEMA = [
  { id: "auto", label: "Ikut telefon" },
  { id: "terang", label: "Terang" },
  { id: "gelap", label: "Gelap" }
];

const KEADAAN = [
  { id: "trial", label: "Percubaan" },
  { id: "locked", label: "Terkunci" },
  { id: "pro", label: "Dah bayar" }
];

export default function Tetapan({ onTutup, onNaikTaraf }) {
  const { S, dispatch, bertoast, resetKosong, isiContoh, hariIni } = useStore();
  const [nama, setNama] = useState(S.gerai.nama);
  const [tukar, setTukar] = useState(String(S.gerai.duitTukar));
  const [masak, setMasak] = useState(String(S.gerai.masak || ""));
  const [sahPadam, setSahPadam] = useState(false);
  const pc = statusPercubaan(S);

  function simpanGerai() {
    const duit = Math.max(0, parseFloat(String(tukar).replace(",", ".")) || 0);
    dispatch({
      type: "gerai",
      gerai: { nama: nama.trim() || S.gerai.nama, duitTukar: duit, masak: Number(masak) || 0 }
    });
    bertoast("Tetapan gerai disimpan");
  }

  async function eksport() {
    bertoast(await eksportCsv(S, hariIni));
  }

  return (
    <div className="app">
      <div className="appbar">
        <button className="icon-btn" onClick={onTutup} aria-label="Balik">
          <Balik />
        </button>
        <div className="gerai">
          <b>Tetapan</b>
          <small>Kira 0.1.0</small>
        </div>
      </div>

      <div className="body">
        <div className="sec">
          <h2>Gerai</h2>
        </div>
        <label className="lbl-field">
          <span>Nama gerai</span>
          <input className="field" value={nama} onChange={(e) => setNama(e.target.value)} />
        </label>
        <label className="lbl-field">
          <span>Duit tukar pagi (RM)</span>
          <input
            className="field"
            value={tukar}
            inputMode="decimal"
            onChange={(e) => setTukar(e.target.value.replace(/[^\d.,]/g, ""))}
          />
          <small style={{ color: "var(--muted)", fontSize: 12.5 }}>
            Guna masa tutup kira untuk bandingkan duit dalam tin dengan yang sepatutnya.
          </small>
        </label>
        <label className="lbl-field">
          <span>Berapa {S.gerai.unit || "bungkus"} dimasak sehari</span>
          <input
            className="field"
            value={masak}
            inputMode="numeric"
            onChange={(e) => setMasak(e.target.value.replace(/\D/g, ""))}
            placeholder="Boleh kosong"
          />
          <small style={{ color: "var(--muted)", fontSize: 12.5 }}>
            Digunakan untuk saranan berapa patut dimasak esok, selepas kau jawab soalan habis dan
            lebih semasa tutup kira.
          </small>
        </label>
        <button className="ghost" onClick={simpanGerai}>
          Simpan tetapan gerai
        </button>

        <div className="sec">
          <h2>Paparan</h2>
        </div>
        <div className="seg">
          {TEMA.map((t) => (
            <button
              key={t.id}
              aria-pressed={S.tema === t.id}
              onClick={() => dispatch({ type: "tema", tema: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sec">
          <h2>Langganan</h2>
        </div>
        <div className="recon">
          <div>
            <span>Keadaan</span>
            <span>
              {S.plan === "pro" ? "Berbayar" : S.plan === "locked" ? "Percubaan tamat" : "Percubaan"}
            </span>
          </div>
          <div>
            <span>Tutup kira setakat ni</span>
            <span>
              {pc.tutup} / {pc.had}
            </span>
          </div>
        </div>
        {S.plan !== "pro" ? (
          <button className="save amber" onClick={onNaikTaraf}>
            Naik taraf RM 120 setahun
          </button>
        ) : null}

        <div className="sec">
          <h2>Data</h2>
        </div>
        <button className="ghost" onClick={eksport}>
          Eksport semua rekod ke CSV
        </button>
        <button
          className="ghost"
          onClick={() => {
            isiContoh();
            bertoast("Data contoh dimuatkan");
          }}
        >
          Ganti dengan data contoh
        </button>
        {sahPadam ? (
          <button
            className="ghost danger"
            onClick={() => {
              resetKosong();
              bertoast("Semua data dipadam");
              onTutup();
            }}
          >
            Tekan sekali lagi untuk padam semua
          </button>
        ) : (
          <button className="ghost danger" onClick={() => setSahPadam(true)}>
            Padam semua data
          </button>
        )}

        <div className="sec">
          <h2>Ujian keadaan pengguna</h2>
        </div>
        <div className="seg">
          {KEADAAN.map((k) => (
            <button
              key={k.id}
              aria-pressed={S.plan === k.id}
              onClick={() => dispatch({ type: "plan", plan: k.id })}
            >
              {k.label}
            </button>
          ))}
        </div>
        <p className="footnote">
          Suis ini untuk tunjuk demo pada peniaga pengasas. Buang sebelum keluaran awam.
        </p>

        <p className="footnote">
          Semua rekod disimpan dalam telefon ini sahaja. Jumlah hutang belum langsai{" "}
          {rm(S.hutang.filter((h) => !h.paid).reduce((a, h) => a + h.amount, 0))}.
        </p>
      </div>
    </div>
  );
}
