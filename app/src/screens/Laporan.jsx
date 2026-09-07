import { useStore } from "../lib/store.jsx";
import { tujuhHari, jumlahJulat, terkunci, ringkasBulan } from "../lib/derive.js";
import { eksportCsv } from "../lib/eksport.js";
import { rm, rm0, HARI, HARI_PENDEK } from "../lib/format.js";
import { Muat } from "../components/Ikon.jsx";
import Gate from "../components/Gate.jsx";

export default function Laporan({ onNaikTaraf }) {
  const { S, hariIni, bertoast } = useStore();
  const kunci = terkunci(S);

  const hari = tujuhHari(S, hariIni);
  const minggu = jumlahJulat(S, 6, 0);
  const mingguLepas = jumlahJulat(S, 13, 7);
  const bulan = jumlahJulat(S, 29, 0);
  const bulanIni = ringkasBulan(S, hariIni);
  const beza = minggu.untung - mingguLepas.untung;

  const terbaik = hari.reduce((a, x) => (!a || x.untung > a.untung ? x : a), null);
  const maks = Math.max(1, ...hari.map((x) => Math.abs(x.untung)));
  const seSen = minggu.jualan > 0 ? Math.round((minggu.untung / minggu.jualan) * 100) : 0;

  async function eksport() {
    bertoast(await eksportCsv(S, hariIni));
  }

  return (
    <>
      {kunci ? <Gate jenis="laporan" onNaikTaraf={onNaikTaraf} /> : null}
      <div className={"gated" + (kunci ? " veiled" : "")}>
        <div className="note">
          Tujuh hari lepas kau untung <b>{rm(minggu.untung)}</b>.{" "}
          {mingguLepas.untung !== 0
            ? (beza >= 0 ? "Naik " : "Turun ") + rm(Math.abs(beza)) + " berbanding minggu sebelum. "
            : ""}
          {terbaik && terbaik.untung > 0 ? (
            <>
              Hari paling laris <b>{HARI[terbaik.d.getDay()]}</b> dengan {rm(terbaik.untung)}.
            </>
          ) : (
            "Belum cukup rekod untuk cari hari paling laris."
          )}
        </div>

        <div className="sec">
          <h2>Untung 7 hari</h2>
        </div>
        <div className="chart">
          <div className="bars">
            {hari.map((x) => (
              <div className={"col" + (x.hariIni ? " now" : "")} key={x.k}>
                <span className="v">{x.untung ? Math.round(x.untung) : "—"}</span>
                <span
                  className={
                    "stalk" + (x.untung < 0 ? " neg" : "") + (x.hariIni ? " today" : "")
                  }
                  style={{ height: Math.max(3, Math.round((Math.abs(x.untung) / maks) * 118)) + "px" }}
                />
                <span className="d">{HARI_PENDEK[x.d.getDay()]}</span>
              </div>
            ))}
          </div>
          <div className="axis">
            <span>RM 0</span>
            <span>Paling tinggi {rm0(maks)}</span>
          </div>
        </div>

        <div className="sec">
          <h2>Ringkasan minggu</h2>
        </div>
        <div className="recon">
          <div>
            <span>Jumlah jualan</span>
            <span>{rm(minggu.jualan)}</span>
          </div>
          <div>
            <span>Jumlah modal</span>
            <span>{rm(minggu.modal)}</span>
          </div>
          <div>
            <span>Purata untung sehari</span>
            <span>{rm(minggu.untung / 7)}</span>
          </div>
          <div>
            <span>Setiap RM 1 jualan</span>
            <span>{seSen} sen untung</span>
          </div>
          <div className="total">
            <span>Untung 7 hari</span>
            <span>{rm(minggu.untung)}</span>
          </div>
        </div>

        <div className="sec">
          <h2>Ringkasan 30 hari</h2>
        </div>
        <div className="recon">
          <div>
            <span>Jualan</span>
            <span>{rm(bulan.jualan)}</span>
          </div>
          <div>
            <span>Modal</span>
            <span>{rm(bulan.modal)}</span>
          </div>
          <div className="total">
            <span>Untung 30 hari</span>
            <span>{rm(bulan.untung)}</span>
          </div>
        </div>

        <div className="sec">
          <h2>Untung berbanding duit rumah</h2>
        </div>
        <div className="note">
          Bulan {bulanIni.nama} kau untung <b>{rm(bulanIni.untung)}</b> dan kau ambil{" "}
          <b>{rm(bulanIni.rumah)}</b> untuk rumah.{" "}
          {bulanIni.baki >= 0
            ? "Yang tinggal dalam bisnes " + rm(bulanIni.baki) + "."
            : "Kau ambil lebih dari untung sebanyak " + rm(-bulanIni.baki) + ". Itu modal kau sendiri yang termakan."}
        </div>
        <div className="recon">
          <div>
            <span>Untung bulan ni</span>
            <span>{rm(bulanIni.untung)}</span>
          </div>
          <div>
            <span>Ambil untuk rumah</span>
            <span>− {rm(bulanIni.rumah)}</span>
          </div>
          <div className="total">
            <span>Tinggal dalam bisnes</span>
            <span>{rm(bulanIni.baki)}</span>
          </div>
        </div>

        <button className="ghost" onClick={eksport}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 18, height: 18, display: "inline-block" }}>
              <Muat />
            </span>
            Eksport semua rekod ke CSV
          </span>
        </button>
        <p className="footnote">
          Fail CSV boleh dibuka dalam Excel atau diserah pada akauntan untuk cukai dan e-Invois.
        </p>
      </div>
    </>
  );
}
