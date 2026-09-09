import { useRef, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { statusPercubaan } from "../lib/derive.js";
import { eksportCsv } from "../lib/eksport.js";
import { muatTurun, bacaFail } from "../lib/fail.js";
import { teksSandaran, namaFailSandaran, bacaSandaran, ringkasSandaran } from "../lib/sandaran.js";
import { rm } from "../lib/format.js";
import { Balik } from "../components/Ikon.jsx";

const TEMA = [
  { id: "auto", label: "Ikut telefon" },
  { id: "terang", label: "Terang" },
  { id: "gelap", label: "Gelap" }
];

export default function Tetapan({ onTutup, onNaikTaraf }) {
  const { S, dispatch, bertoast, resetKosong, isiContoh, hariIni, simpanGagal } = useStore();
  const medanFail = useRef(null);
  const [sahMuat, setSahMuat] = useState(null);
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

  async function simpanSandaran() {
    bertoast(
      await muatTurun(
        namaFailSandaran(hariIni, S.gerai.nama),
        teksSandaran(S),
        "application/json;charset=utf-8"
      )
    );
  }

  // Fail dibaca dan disemak dahulu, dan isinya ditunjuk pada peniaga sebelum
  // rekod sedia ada diganti. Ganti tanpa amaran boleh memusnahkan sebulan kerja.
  async function pilihSandaran(e) {
    const fail = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!fail) return;
    try {
      const keadaan = bacaSandaran(await bacaFail(fail));
      setSahMuat({ keadaan, ringkas: ringkasSandaran(keadaan) });
    } catch (ralat) {
      bertoast(ralat.message || "Fail tak boleh dibaca");
    }
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
        {simpanGagal ? (
          <div className="amaran" role="alert">
            Telefon ni tak benarkan Kira simpan rekod. Simpan sandaran sekarang juga.
          </div>
        ) : null}
        <button className="ghost" onClick={simpanSandaran}>
          Simpan sandaran ke fail
        </button>
        <button className="ghost" onClick={() => medanFail.current && medanFail.current.click()}>
          Muat sandaran dari fail
        </button>
        <input
          ref={medanFail}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={pilihSandaran}
        />
        {sahMuat ? (
          <div className="note">
            Fail ni ada <b>{sahMuat.ringkas}</b>. Kalau kau teruskan, semua rekod dalam telefon ni
            diganti dengan isi fail tu.
            <div className="dua-butang">
              <button className="ghost" onClick={() => setSahMuat(null)}>
                Batal
              </button>
              <button
                className="ghost danger"
                onClick={() => {
                  dispatch({ type: "ganti", keadaan: sahMuat.keadaan });
                  setSahMuat(null);
                  bertoast("Sandaran dimuatkan");
                  onTutup();
                }}
              >
                Ganti rekod sekarang
              </button>
            </div>
          </div>
        ) : null}
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

        <p className="footnote">
          Semua rekod disimpan dalam telefon ini sahaja, tiada salinan di mana-mana pelayan. Simpan
          sandaran setiap hujung bulan dan hantar fail tu pada diri sendiri dalam WhatsApp.
        </p>

        <p className="footnote">
          Jumlah hutang belum langsai{" "}
          {rm(S.hutang.filter((h) => !h.paid).reduce((a, h) => a + h.amount, 0))}.
        </p>
      </div>
    </div>
  );
}
