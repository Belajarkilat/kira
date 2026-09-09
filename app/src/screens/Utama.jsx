import { useStore } from "../lib/store.jsx";
import { statusPercubaan, saranMasak, ringkasBulan } from "../lib/derive.js";
import { money, rm } from "../lib/format.js";
import { Tambah, Troli, Panah, Tong, Rumah } from "../components/Ikon.jsx";

export default function Utama({ onBuka }) {
  const { S, dispatch, hariIni, hariIniData: t, bertoast } = useStore();
  const ditutup = S.closes[hariIni];
  const margin = t.jualan > 0 ? Math.round((t.untung / t.jualan) * 100) : 0;
  const pc = statusPercubaan(S);
  const saran = saranMasak(S, hariIni);
  const bulan = ringkasBulan(S, hariIni);

  const sub =
    t.jualan === 0
      ? "Belum ada jualan hari ni."
      : t.untung >= 0
        ? margin + " sen untung setiap RM 1 jualan"
        : "Modal lebih tinggi dari jualan hari ni";

  return (
    <>
      <div className="hero">
        <div className="lbl">Untung hari ni</div>
        <div className={"big " + (t.untung >= 0 ? "pos" : "neg")}>
          <span className="rm">RM</span>
          <span>{money(t.untung)}</span>
        </div>
        <div className="sub">{sub}</div>
        <div className="split">
          <div>
            <div className="k">Jualan</div>
            <div className="v">{rm(t.jualan)}</div>
          </div>
          <div>
            <div className="k">Modal</div>
            <div className="v">{rm(t.modal)}</div>
          </div>
        </div>
        {t.hutangBaru > 0 ? (
          <div className="hero-rumah">
            {rm(t.hutangBaru)} daripada jualan tu diambil hutang. Untung dah dikira, duitnya belum
            masuk tin.
          </div>
        ) : null}
        {t.kutip > 0 ? (
          <div className="hero-rumah">
            {rm(t.kutip)} hutang lama masuk tin hari ni. Untungnya dah dikira hari barang keluar.
          </div>
        ) : null}
        {t.rumah > 0 ? (
          <div className="hero-rumah">
            Kau ambil {rm(t.rumah)} untuk rumah hari ni. Untung di atas tak berubah.
          </div>
        ) : null}
      </div>

      {saran ? (
        <div className={"saran " + saran.nada}>
          <span className="tajuk">{saran.tajuk}</span>
          <span className="sebab">{saran.sebab}</span>
        </div>
      ) : null}

      <div className="duo">
        <button className="act sell" onClick={() => onBuka("jualan")}>
          <Tambah />
          Tambah Jualan
          <small>Duit masuk</small>
        </button>
        <button className="act buy" onClick={() => onBuka("belian")}>
          <Troli />
          Tambah Modal
          <small>Duit keluar</small>
        </button>
      </div>

      <button className="act wide house" onClick={() => onBuka("rumah")}>
        <Rumah />
        <span>
          Ambil Untuk Rumah
          <small>Duit tin yang kau guna untuk hidup</small>
        </span>
      </button>

      <button className={"close-bar" + (ditutup ? " done" : "")} onClick={() => onBuka("tutup")}>
        <span>
          {ditutup ? "Kira dah ditutup" : "Tutup Kira Malam Ni"}
          <small>
            {ditutup ? "Duit dalam tin " + rm(ditutup.tunai) : "Kira duit dalam tin, 20 saat je"}
          </small>
        </span>
        <Panah />
      </button>

      {bulan.bilTutup >= 3 ? (
        <button className="kad-butang" onClick={() => onBuka("kad")}>
          <span>
            Kad {bulan.nama}
            <small>Kira tangkap {rm(bulan.tangkap)} bulan ni. Boleh hantar ke WhatsApp.</small>
          </span>
          <Panah />
        </button>
      ) : null}

      {S.plan !== "pro" ? (
        <div className="trial">
          <div className="l">
            <span>
              <b>{S.plan === "trial" ? "Percubaan penuh terbuka" : "Percubaan dah tamat"}</b>
              <small>
                {S.plan === "trial"
                  ? "Tinggal " + pc.baki + " kali tutup kira sebelum ciri berbayar terkunci"
                  : "Rekod harian kekal percuma. Hutang dan laporan terkunci."}
              </small>
            </span>
            <button className="up" onClick={() => onBuka("naiktaraf")}>
              Naik taraf
            </button>
          </div>
          <div className="track">
            <i style={{ width: (S.plan === "trial" ? pc.peratus : 100) + "%" }} />
          </div>
        </div>
      ) : null}

      <div className="sec">
        <h2>Rekod hari ni</h2>
        <span className="kiraan">{t.list.length ? t.list.length + " rekod" : ""}</span>
      </div>

      {t.list.length === 0 ? (
        <div className="empty">
          Belum ada rekod hari ni.
          <br />
          Tekan <b>Tambah Modal</b> lepas balik pasar.
        </div>
      ) : (
        <div className="list">
          {t.list.map((e) => {
            const masuk = e.type === "jualan" || e.type === "kutip";
            const jenis = e.type === "jualan" ? "j" : e.type === "rumah" ? "r" : e.type === "kutip" ? "k" : "b";
            const tanda = masuk ? "+ " : "− ";
            const kaki =
              e.type === "rumah"
                ? " · untuk rumah"
                : e.type === "kutip"
                  ? " · masuk tin, bukan untung baru"
                  : e.tunai === false
                    ? " · belum masuk tin"
                    : "";
            return (
              <div className="row" key={e.id}>
                <span className={"dot " + jenis} />
                <span className="txt">
                  <b>{e.note}</b>
                  <small>
                    {e.t}
                    {kaki}
                  </small>
                </span>
                <span className={"amt " + jenis}>{tanda + rm(e.amount)}</span>
                {e.hutangId ? (
                  <span className="del-kosong" aria-hidden="true" />
                ) : (
                  <button
                    className="del"
                    aria-label={"Padam rekod " + e.note}
                    onClick={() => {
                      dispatch({ type: "entry-", id: e.id });
                      bertoast("Rekod dipadam");
                    }}
                  >
                    <Tong />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
