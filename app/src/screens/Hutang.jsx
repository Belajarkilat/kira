import { useStore } from "../lib/store.jsx";
import { hutangBelumBayar, jumlahHutang, terkunci } from "../lib/derive.js";
import { money, rm, jarakHari, fonWhatsapp, tarikhPendek } from "../lib/format.js";
import { Tong } from "../components/Ikon.jsx";
import Gate from "../components/Gate.jsx";

function mesejPeringatan(h, namaGerai) {
  const panggil = h.nama.split(" ")[0];
  return (
    "Assalamualaikum " +
    panggil +
    ", ini " +
    (namaGerai || "gerai saya") +
    ". Saya nak ingatkan baki RM " +
    money(h.amount) +
    " sejak " +
    tarikhPendek(h.day) +
    ". Bila senang boleh jelaskan ya. Terima kasih."
  );
}

export default function Hutang({ onBuka, onNaikTaraf }) {
  const { S, dispatch, hariIni, bertoast } = useStore();
  const kunci = terkunci(S);
  const belum = hutangBelumBayar(S);
  const total = jumlahHutang(S);

  const senarai = S.hutang
    .slice()
    .sort((a, b) => (a.paid ? 1 : 0) - (b.paid ? 1 : 0) || a.day.localeCompare(b.day));

  function ingatkan(h) {
    const teks = encodeURIComponent(mesejPeringatan(h, S.gerai.nama));
    const fon = fonWhatsapp(h.fon);
    const url = fon ? "https://wa.me/" + fon + "?text=" + teks : "https://wa.me/?text=" + teks;
    window.open(url, "_blank", "noopener");
  }

  return (
    <>
      {kunci ? <Gate jenis="hutang" onNaikTaraf={onNaikTaraf} /> : null}
      <div className={"gated" + (kunci ? " veiled" : "")}>
        <div className="hero">
          <div className="lbl">Orang belum bayar</div>
          <div className="big">
            <span className="rm">RM</span>
            <span>{money(total)}</span>
          </div>
          <div className="sub">
            {belum.length ? belum.length + " orang belum langsai" : "Semua orang dah langsai. Bagus."}
          </div>
        </div>

        <div className="sec">
          <h2>Senarai hutang</h2>
          <button onClick={() => onBuka("hutang")}>+ Tambah</button>
        </div>

        {senarai.length === 0 ? (
          <div className="empty">
            Tiada hutang direkod.
            <br />
            Tekan <b>+ Tambah</b> bila ada orang ambil dulu, bayar kemudian.
          </div>
        ) : (
          <div className="list">
            {senarai.map((h) => (
              <div className={"row" + (h.paid ? " paid" : "")} key={h.id}>
                <span className="txt">
                  <b>{h.nama}</b>
                  <small>{h.paid ? "Dah bayar" : "Sejak " + jarakHari(h.day, hariIni)}</small>
                </span>
                <span className="amt">{rm(h.amount)}</span>
                {h.paid ? (
                  <>
                    <button
                      className="mini"
                      onClick={() => dispatch({ type: "hutang~", id: h.id, patch: { paid: false } })}
                    >
                      Buka
                    </button>
                    <button
                      className="del"
                      aria-label={"Padam hutang " + h.nama}
                      onClick={() => {
                        dispatch({ type: "hutang-", id: h.id });
                        bertoast("Rekod hutang dipadam");
                      }}
                    >
                      <Tong />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="mini wa" onClick={() => ingatkan(h)}>
                      Ingatkan
                    </button>
                    <button
                      className="mini"
                      onClick={() => {
                        dispatch({ type: "hutang~", id: h.id, patch: { paid: true, paidDay: hariIni } });
                        bertoast("Dah langsai");
                      }}
                    >
                      Bayar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="footnote">
          Butang Ingatkan buka WhatsApp dengan mesej siap ditaip. Kau baca dulu sebelum hantar.
        </p>
      </div>
    </>
  );
}
