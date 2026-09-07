import { useEffect } from "react";
import { money, nilaiBuf } from "../lib/format.js";
import { Padam } from "./Ikon.jsx";

const KEKUNCI = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

// Papan nombor sen-dahulu: taip 350 jadi RM 3.50, macam mesin daftar.
export default function PapanNombor({ buf, setBuf, papanKekunci = true, children }) {
  useEffect(() => {
    if (!papanKekunci) return;
    function onKey(e) {
      const dalamMedan = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (/^\d$/.test(e.key) && !dalamMedan) {
        setBuf((b) => (b.length < 8 ? (b + e.key).replace(/^0+(?=\d)/, "") : b));
      } else if (e.key === "Backspace" && !dalamMedan) {
        setBuf((b) => b.slice(0, -1));
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setBuf, papanKekunci]);

  function tekan(k) {
    if (k === "del") setBuf((b) => b.slice(0, -1));
    else setBuf((b) => (b.length < 8 ? (b + k).replace(/^0+(?=\d)/, "") : b));
  }

  return (
    <>
      <div className="readout">
        <span className="rm">RM</span>
        <span>{buf ? money(nilaiBuf(buf)) : "0.00"}</span>
      </div>
      {children}
      <div className="pad">
        {KEKUNCI.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => tekan(k)}
            aria-label={k === "del" ? "Padam satu angka" : k}
          >
            {k === "del" ? <Padam /> : k}
          </button>
        ))}
      </div>
    </>
  );
}
