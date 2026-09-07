import { useStore } from "../lib/store.jsx";
import { terkunci, marginBarang, hargaCadangan } from "../lib/derive.js";
import { rm } from "../lib/format.js";
import { menuContoh } from "../lib/storage.js";
import { Pensel, Tong } from "../components/Ikon.jsx";
import Gate from "../components/Gate.jsx";

export default function Barang({ onBuka, onNaikTaraf }) {
  const { S, dispatch, bertoast } = useStore();
  const kunci = terkunci(S);

  function isiContohMenu() {
    menuContoh().forEach((m) => dispatch({ type: "barang+", nama: m.nama, modal: m.modal, harga: m.harga }));
    bertoast("Menu contoh dimasukkan. Ubah ikut gerai kau.");
  }

  return (
    <>
      {kunci ? <Gate jenis="barang" onNaikTaraf={onNaikTaraf} /> : null}
      <div className={"gated" + (kunci ? " veiled" : "")}>
        <div className="note">
          Untung sebenar setiap barang selepas tolak modal. Yang bawah <b>35%</b> ditanda merah, itu
          yang makan untung kau.
        </div>

        <div className="sec">
          <h2>Menu gerai</h2>
          <button onClick={() => onBuka("barang")}>+ Tambah</button>
        </div>

        {S.menu.length === 0 ? (
          <div className="empty">
            Menu masih kosong.
            <br />
            Masukkan barang yang kau jual, modal dan harga jual.
            <div style={{ marginTop: 14 }}>
              <button className="ghost" onClick={isiContohMenu}>
                Isi menu contoh gerai nasi lemak
              </button>
            </div>
          </div>
        ) : (
          <div className="list">
            {S.menu.map((m) => {
              const untung = m.harga - m.modal;
              const pct = marginBarang(m);
              const rendah = pct < 35;
              return (
                <div className="item" key={m.id}>
                  <div className="top">
                    <b>{m.nama}</b>
                    <span>
                      modal {rm(m.modal)} → jual {rm(m.harga)}
                    </span>
                  </div>
                  <div className="bar">
                    <i
                      className={rendah ? "low" : ""}
                      style={{ width: Math.max(4, Math.min(100, pct)) + "%" }}
                    />
                  </div>
                  <div className="kaki">
                    <span className={"flag" + (rendah ? "" : " ok")}>
                      {rendah
                        ? "Untung nipis " + pct + "%, naikkan harga ke " + rm(hargaCadangan(m))
                        : "Untung " + rm(untung) + " sekeping, " + pct + "%"}
                    </span>
                    <button
                      className="del"
                      aria-label={"Ubah " + m.nama}
                      onClick={() => onBuka("barang", m)}
                    >
                      <Pensel />
                    </button>
                    <button
                      className="del"
                      aria-label={"Padam " + m.nama}
                      onClick={() => {
                        dispatch({ type: "barang-", id: m.id });
                        bertoast(m.nama + " dipadam");
                      }}
                    >
                      <Tong />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
