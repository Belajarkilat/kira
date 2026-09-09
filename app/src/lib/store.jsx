import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, useCallback } from "react";
import { dayKey, shiftDay, jamSekarang, uid } from "./format.js";
import {
  muat,
  simpan,
  keadaanKosong,
  dataContoh,
  entriJualanHutang,
  entriKutipHutang,
  HAD_PERCUBAAN
} from "./storage.js";
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

    // Hutang baru ialah jualan yang sudah berlaku. Untung naik hari ini, duit
    // belum masuk tin. Dua fakta itu direkod serentak supaya tidak boleh terpisah.
    case "hutang+": {
      const h = { id: uid(), nama: a.nama, fon: a.fon || "", amount: a.amount, day: a.day, paid: false };
      return { ...S, hutang: [...S.hutang, h], entries: [...S.entries, entriJualanHutang(h)] };
    }

    // Dia bayar. Duit masuk tin hari ini, untung tidak naik lagi sebab sudah
    // dikira hari barang keluar.
    case "hutang-bayar": {
      const h = S.hutang.find((x) => x.id === a.id);
      if (!h || h.paid) return S;
      return {
        ...S,
        hutang: S.hutang.map((x) => (x.id === a.id ? { ...x, paid: true, paidDay: a.day } : x)),
        entries: [...S.entries, entriKutipHutang(h, a.day)]
      };
    }

    // Buka semula rekod yang tersilap ditanda langsai. Duit itu keluar semula
    // dari kiraan tin.
    case "hutang-buka":
      return {
        ...S,
        hutang: S.hutang.map((h) => (h.id === a.id ? { ...h, paid: false, paidDay: undefined } : h)),
        entries: S.entries.filter((e) => !(e.type === "kutip" && e.hutangId === a.id))
      };

    case "hutang~":
      return { ...S, hutang: S.hutang.map((h) => (h.id === a.id ? { ...h, ...a.patch } : h)) };

    // Padam hutang yang belum dibayar bermakna jualan itu tersilap direkod, jadi
    // entri jualannya ikut dipadam. Padam hutang yang sudah langsai cuma
    // mengemaskan senarai; duitnya benar-benar bergerak, jadi rekodnya kekal.
    case "hutang-": {
      const h = S.hutang.find((x) => x.id === a.id);
      const hutang = S.hutang.filter((x) => x.id !== a.id);
      if (h && !h.paid) {
        return { ...S, hutang, entries: S.entries.filter((e) => e.hutangId !== a.id) };
      }
      return { ...S, hutang };
    }

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

  // localStorage boleh penuh, atau ditutup dalam pelayaran peribadi. Kalau
  // simpanan gagal, peniaga mesti tahu sekarang, bukan esok bila rekod hilang.
  const [simpanGagal, setSimpanGagal] = useState(false);
  useEffect(() => {
    setSimpanGagal(!simpan(S));
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
      simpanGagal,
      hariIniData: ofDay(S, hariIni),
      jumlahTutup: bilanganTutup(S),
      resetKosong: () => dispatch({ type: "ganti", keadaan: keadaanKosong() }),
      isiContoh: () => dispatch({ type: "ganti", keadaan: dataContoh() })
    }),
    [S, hariIni, toast, bertoast, simpanGagal]
  );

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore mesti dalam StoreProvider");
  return v;
}
