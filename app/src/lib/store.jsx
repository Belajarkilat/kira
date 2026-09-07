import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, useCallback } from "react";
import { dayKey, shiftDay, jamSekarang, uid } from "./format.js";
import { muat, simpan, keadaanKosong, dataContoh, HAD_PERCUBAAN } from "./storage.js";
import { ofDay, bilanganTutup } from "./derive.js";

const Ctx = createContext(null);

function reducer(S, a) {
  switch (a.type) {
    case "onboard":
      return { ...S, onboarded: true, gerai: { ...S.gerai, ...a.gerai }, menu: a.menu ?? S.menu };

    case "gerai":
      return { ...S, gerai: { ...S.gerai, ...a.gerai } };

    case "tema":
      return { ...S, tema: a.tema };

    case "plan":
      return { ...S, plan: a.plan };

    case "entry+": {
      const e = {
        id: uid(),
        type: a.jenis,
        amount: a.amount,
        note: a.note || { jualan: "Jualan", belian: "Modal", rumah: "Untuk rumah" }[a.jenis],
        day: a.day,
        t: jamSekarang()
      };
      return { ...S, entries: [...S.entries, e] };
    }

    case "entry-":
      return { ...S, entries: S.entries.filter((e) => e.id !== a.id) };

    case "tutup": {
      const closes = {
        ...S.closes,
        [a.day]: {
          tunai: a.tunai,
          patut: a.patut,
          beza: a.tunai - a.patut,
          habis: a.habis || null,
          lebih: a.lebih || 0
        }
      };
      let plan = S.plan;
      if (plan === "trial" && Object.keys(closes).length >= HAD_PERCUBAAN) plan = "locked";
      return { ...S, closes, plan };
    }

    case "tutup-": {
      const closes = { ...S.closes };
      delete closes[a.day];
      return { ...S, closes };
    }

    case "hutang+":
      return {
        ...S,
        hutang: [...S.hutang, { id: uid(), nama: a.nama, fon: a.fon || "", amount: a.amount, day: a.day, paid: false }]
      };

    case "hutang~":
      return { ...S, hutang: S.hutang.map((h) => (h.id === a.id ? { ...h, ...a.patch } : h)) };

    case "hutang-":
      return { ...S, hutang: S.hutang.filter((h) => h.id !== a.id) };

    case "barang+":
      return { ...S, menu: [...S.menu, { id: uid(), nama: a.nama, modal: a.modal, harga: a.harga }] };

    case "barang~":
      return { ...S, menu: S.menu.map((m) => (m.id === a.id ? { ...m, ...a.patch } : m)) };

    case "barang-":
      return { ...S, menu: S.menu.filter((m) => m.id !== a.id) };

    case "ganti":
      return a.keadaan;

    default:
      return S;
  }
}

export function StoreProvider({ children }) {
  const [S, dispatch] = useReducer(reducer, null, muat);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    simpan(S);
  }, [S]);

  // Tema: auto ikut sistem, atau paksa terang / gelap.
  useEffect(() => {
    const el = document.documentElement;
    if (S.tema === "auto") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", S.tema === "gelap" ? "dark" : "light");
  }, [S.tema]);

  const bertoast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Kunci pada tarikh hari ini, dikira semula bila hari bertukar semasa aplikasi terbuka.
  const [hariIni, setHariIni] = useState(() => dayKey(shiftDay(0)));
  useEffect(() => {
    const id = setInterval(() => {
      const k = dayKey(shiftDay(0));
      setHariIni((lama) => (lama === k ? lama : k));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const nilai = useMemo(
    () => ({
      S,
      dispatch,
      hariIni,
      toast,
      bertoast,
      hariIniData: ofDay(S, hariIni),
      jumlahTutup: bilanganTutup(S),
      resetKosong: () => dispatch({ type: "ganti", keadaan: keadaanKosong() }),
      isiContoh: () => dispatch({ type: "ganti", keadaan: dataContoh() })
    }),
    [S, hariIni, toast, bertoast]
  );

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore mesti dalam StoreProvider");
  return v;
}
