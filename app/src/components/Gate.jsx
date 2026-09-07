import { Tanda } from "./Ikon.jsx";

const SALINAN = {
  hutang: {
    h: "Buka Buku Hutang",
    p: "Simpan siapa berhutang, berapa, dan sejak bila. Hantar peringatan WhatsApp tanpa rasa segan."
  },
  barang: {
    h: "Buka Untung Ikut Barang",
    p: "Tahu barang mana bawa untung dan barang mana makan modal kau diam-diam."
  },
  laporan: {
    h: "Buka Laporan Penuh",
    p: "Untung minggu dan bulan, hari paling laris, dan eksport untuk cukai."
  }
};

export const FAEDAH = [
  "Buku hutang pelanggan",
  "Untung ikut setiap barang",
  "Laporan minggu dan bulan",
  "Eksport untuk cukai dan e-Invois"
];

export default function Gate({ jenis, onNaikTaraf }) {
  const c = SALINAN[jenis];
  return (
    <div className="gate">
      <div className="kicker">Ciri berbayar</div>
      <h3>{c.h}</h3>
      <p>{c.p}</p>
      <ul>
        {FAEDAH.map((x) => (
          <li key={x}>
            <Tanda />
            <span>{x}</span>
          </li>
        ))}
      </ul>
      <div className="price">
        <b>RM 120</b>
        <span>setahun, bersamaan RM 10 sebulan</span>
      </div>
      <button className="go" onClick={onNaikTaraf}>
        Naik Taraf Sekarang
      </button>
      <p className="fine">Rekod harian, tutup kira dan untung hari ni kekal percuma selamanya.</p>
    </div>
  );
}
