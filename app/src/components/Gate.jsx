import { Tanda } from "./Ikon.jsx";

const SALINAN = {
  hutang: {
    h: "Buka Hutang Baru",
    p: "Senarai yang kau dah taip kekal terbuka selamanya, dan butang Dah bayar tetap jalan. Naik taraf untuk tambah hutang baru dan hantar peringatan WhatsApp."
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
