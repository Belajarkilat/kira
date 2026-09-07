import { Rumah, Orang, Beg, Carta } from "./Ikon.jsx";

const TAB = [
  { id: "utama", label: "Utama", Ikon: Rumah, berbayar: false },
  { id: "hutang", label: "Hutang", Ikon: Orang, berbayar: true },
  { id: "barang", label: "Barang", Ikon: Beg, berbayar: true },
  { id: "laporan", label: "Laporan", Ikon: Carta, berbayar: true }
];

export default function TabBar({ aktif, onTukar, terkunci }) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Skrin utama">
      {TAB.map(({ id, label, Ikon, berbayar }) => (
        <button
          key={id}
          className="tab"
          role="tab"
          aria-selected={aktif === id}
          onClick={() => onTukar(id)}
        >
          <Ikon />
          {label}
          <span className="pip" />
          {terkunci && berbayar ? <span className="lk" aria-hidden="true" /> : null}
        </button>
      ))}
    </nav>
  );
}
