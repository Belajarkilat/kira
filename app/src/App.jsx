import { useState } from "react";
import { useStore } from "./lib/store.jsx";
import { terkunci } from "./lib/derive.js";
import { tarikhPenuh, fromKey } from "./lib/format.js";
import { Logo, Gear } from "./components/Ikon.jsx";
import TabBar from "./components/TabBar.jsx";
import SheetAktif from "./sheets/SheetAktif.jsx";
import Mula from "./screens/Mula.jsx";
import Utama from "./screens/Utama.jsx";
import Hutang from "./screens/Hutang.jsx";
import Barang from "./screens/Barang.jsx";
import Laporan from "./screens/Laporan.jsx";
import Tetapan from "./screens/Tetapan.jsx";

export default function App() {
  const { S, hariIni, toast } = useStore();
  const [tab, setTab] = useState("utama");
  const [sheet, setSheet] = useState(null);
  const [tetapan, setTetapan] = useState(false);

  function buka(mode, data) {
    setSheet({ mode, data });
  }

  const tutupSheet = () => setSheet(null);
  const naikTaraf = () => buka("naiktaraf");

  if (!S.onboarded) {
    return (
      <>
        <Mula />
        {toast ? <div className="toast">{toast}</div> : null}
      </>
    );
  }

  if (tetapan) {
    return (
      <>
        <Tetapan
          onTutup={() => setTetapan(false)}
          onNaikTaraf={() => {
            setTetapan(false);
            naikTaraf();
          }}
        />
        {sheet ? (
          <SheetAktif key={sheet.mode} mode={sheet.mode} data={sheet.data} onTutup={tutupSheet} />
        ) : null}
        {toast ? <div className="toast">{toast}</div> : null}
      </>
    );
  }

  return (
    <>
      <div className="app">
        <div className="appbar">
          <Logo />
          <div className="gerai">
            <b>{S.gerai.nama}</b>
            <small>{tarikhPenuh(fromKey(hariIni))}</small>
          </div>
          {S.plan === "pro" ? <div className="chip-pro">Pro</div> : null}
          <button className="icon-btn" onClick={() => setTetapan(true)} aria-label="Tetapan">
            <Gear />
          </button>
        </div>

        <div className="body" key={tab}>
          {tab === "utama" ? <Utama onBuka={buka} /> : null}
          {tab === "hutang" ? <Hutang onBuka={buka} onNaikTaraf={naikTaraf} /> : null}
          {tab === "barang" ? <Barang onBuka={buka} onNaikTaraf={naikTaraf} /> : null}
          {tab === "laporan" ? <Laporan onNaikTaraf={naikTaraf} /> : null}
        </div>

        <TabBar aktif={tab} onTukar={setTab} terkunci={terkunci(S)} />
      </div>

      {sheet ? (
        <SheetAktif key={sheet.mode} mode={sheet.mode} data={sheet.data} onTutup={tutupSheet} />
      ) : null}
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
