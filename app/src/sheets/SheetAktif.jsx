import { useState } from "react";
import Sheet from "../components/Sheet.jsx";
import PapanNombor from "../components/PapanNombor.jsx";
import { useStore } from "../lib/store.jsx";
import { KATEGORI_MODAL, KATEGORI_RUMAH, HABIS } from "../lib/storage.js";
import { rm, nilaiBuf, money } from "../lib/format.js";
import { patutDalamTin, ringkasBulan, ayatKad } from "../lib/derive.js";
import { FAEDAH } from "../components/Gate.jsx";
import { Kad, Tanda } from "../components/Ikon.jsx";

function Chips({ pilihan, dipilih, onPilih }) {
  if (!pilihan.length) return null;
  return (
    <div className="chips">
      {pilihan.map((p) => (
        <button
          key={p.label}
          type="button"
          aria-pressed={dipilih === p.label}
          onClick={() => onPilih(p)}
        >
          {p.pendek || p.label}
        </button>
      ))}
    </div>
  );
}

export default function SheetAktif({ mode, data, onTutup }) {
  const { S, dispatch, hariIni, hariIniData, bertoast } = useStore();
  const [buf, setBuf] = useState("");
  const [nama, setNama] = useState(data?.nama || "");
  const [fon, setFon] = useState(data?.fon || "");
  const [note, setNote] = useState("");
  const [modalTeks, setModalTeks] = useState(data ? String(data.modal) : "");
  const [hargaTeks, setHargaTeks] = useState(data ? String(data.harga) : "");
  const [pelan, setPelan] = useState(120);
  const [habis, setHabis] = useState("");
  const [lebih, setLebih] = useState("");
  const [tunjukAngka, setTunjukAngka] = useState(true);

  const nilai = nilaiBuf(buf);

  function ambilNombor(t) {
    return Math.max(0, parseFloat(String(t).replace(",", ".")) || 0);
  }

  // ---------- kad bulan ----------
  if (mode === "kad") {
    const b = ringkasBulan(S, hariIni);
    const teks = ayatKad(S, hariIni, tunjukAngka);
    const wang = (n) => (tunjukAngka ? rm(n) : "RM ---");

    return (
      <Sheet
        tajuk={"Kad " + b.nama}
        hint="Angka kau sendiri. Hantar pada sesiapa yang tanya kau guna apa."
        onTutup={onTutup}
      >
        <div className="kad">
          <div className="kad-atas">
            <span className="kad-bulan">{b.nama}</span>
            <span className="kad-gerai">{S.gerai.nama}</span>
          </div>
          <div className="kad-utama">
            <span className="kad-label">Kira tangkap bulan ni</span>
            <span className="kad-besar">{wang(b.tangkap)}</span>
          </div>
          <div className="kad-pecah">
            <div>
              <span>Beza duit dalam tin</span>
              <span>{wang(b.bezaDikesan)}</span>
            </div>
            <div>
              <span>Hutang lama dikutip</span>
              <span>{wang(b.hutangKutip)}</span>
            </div>
            <div>
              <span>Untung</span>
              <span>{wang(b.untung)}</span>
            </div>
            <div>
              <span>Ambil untuk rumah</span>
              <span>{wang(b.rumah)}</span>
            </div>
            <div className="total">
              <span>Tinggal dalam bisnes</span>
              <span>{wang(b.baki)}</span>
            </div>
          </div>
          <div className="kad-kaki">Kira sekejap, tahu untung.</div>
        </div>

        <button
          className="ghost"
          aria-pressed={!tunjukAngka}
          onClick={() => setTunjukAngka((v) => !v)}
        >
          {tunjukAngka ? "Tutup angka sebelum hantar" : "Tunjuk angka semula"}
        </button>
        <button
          className="save amber"
          onClick={() => {
            window.open("https://wa.me/?text=" + encodeURIComponent(teks), "_blank", "noopener");
          }}
        >
          Hantar ke WhatsApp
        </button>
        <p className="footnote">
          Kau boleh juga tangkap gambar skrin kad ni dan hantar dalam mana-mana kumpulan.
        </p>
      </Sheet>
    );
  }

  // ---------- naik taraf ----------
  if (mode === "naiktaraf") {
    return (
      <Sheet
        tajuk="Naik Taraf"
        hint="Buka hutang, untung ikut barang dan laporan penuh."
        onTutup={onTutup}
      >
        <div className="plans">
          <button className="plan" aria-pressed={pelan === 120} onClick={() => setPelan(120)}>
            <span className="pt">
              <b>
                Setahun<span className="best">Jimat 33%</span>
              </b>
              <small>Bayar sekali, tak payah fikir lagi</small>
            </span>
            <span className="pp">RM 120</span>
          </button>
          <button className="plan" aria-pressed={pelan === 15} onClick={() => setPelan(15)}>
            <span className="pt">
              <b>Sebulan</b>
              <small>Berhenti bila-bila, sesuai kalau duit ketat</small>
            </span>
            <span className="pp">RM 15</span>
          </button>
          <ul className="faedah">
            {FAEDAH.map((f) => (
              <li key={f}>
                <span className="tk">
                  <Tanda />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="paynote">
            <Kad />
            <span>
              Pembayaran belum disambung dalam versi ini. Butang bawah membuka ciri berbayar untuk
              ujian sahaja.
            </span>
          </div>
        </div>
        <button
          className="save amber"
          onClick={() => {
            dispatch({ type: "plan", plan: "pro" });
            bertoast("Semua ciri dibuka.");
            onTutup();
          }}
        >
          Bayar RM {pelan}
        </button>
      </Sheet>
    );
  }

  // ---------- barang ----------
  if (mode === "barang") {
    const boleh = nama.trim() && ambilNombor(hargaTeks) > 0;
    return (
      <Sheet
        tajuk={data ? "Ubah Barang" : "Barang Baru"}
        hint="Modal sekeping berbanding harga jual. Dari sini Kira tahu margin kau."
        onTutup={onTutup}
      >
        <label className="lbl-field">
          <span>Nama barang</span>
          <input
            className="field"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Nasi lemak bungkus"
            autoFocus
          />
        </label>
        <div className="dua">
          <label className="lbl-field">
            <span>Modal (RM)</span>
            <input
              className="field"
              value={modalTeks}
              inputMode="decimal"
              onChange={(e) => setModalTeks(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder="1.20"
            />
          </label>
          <label className="lbl-field">
            <span>Harga jual (RM)</span>
            <input
              className="field"
              value={hargaTeks}
              inputMode="decimal"
              onChange={(e) => setHargaTeks(e.target.value.replace(/[^\d.,]/g, ""))}
              placeholder="3.00"
            />
          </label>
        </div>
        <button
          className="save"
          disabled={!boleh}
          onClick={() => {
            const patch = {
              nama: nama.trim(),
              modal: ambilNombor(modalTeks),
              harga: ambilNombor(hargaTeks)
            };
            if (data) dispatch({ type: "barang~", id: data.id, patch });
            else dispatch({ type: "barang+", ...patch });
            bertoast(data ? "Barang dikemas kini" : "Barang ditambah");
            onTutup();
          }}
        >
          {data ? "Simpan Perubahan" : "Simpan Barang"}
        </button>
      </Sheet>
    );
  }

  // ---------- tutup kira ----------
  if (mode === "tutup") {
    const patut = patutDalamTin(S, hariIni);
    const unit = S.gerai.unit || "bungkus";
    return (
      <Sheet
        tajuk="Tutup Kira"
        hint="Kira semua duit dalam tin sekarang, masukkan jumlahnya."
        onTutup={onTutup}
      >
        <div className="recon">
          <div>
            <span>Duit tukar pagi</span>
            <span>{rm(S.gerai.duitTukar)}</span>
          </div>
          <div>
            <span>Jualan hari ni</span>
            <span>+ {rm(hariIniData.jualan)}</span>
          </div>
          <div>
            <span>Modal hari ni</span>
            <span>− {rm(hariIniData.modal)}</span>
          </div>
          <div>
            <span>Ambil untuk rumah</span>
            <span>− {rm(hariIniData.rumah)}</span>
          </div>
          <div className="total">
            <span>Sepatutnya dalam tin</span>
            <span>{rm(patut)}</span>
          </div>
        </div>

        <PapanNombor buf={buf} setBuf={setBuf} />

        <div className="soalan">
          <span className="tanya">Habis pukul berapa?</span>
          <div className="chips">
            {HABIS.map((h) => (
              <button
                key={h.id}
                type="button"
                aria-pressed={habis === h.id}
                onClick={() => setHabis(habis === h.id ? "" : h.id)}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <div className="soalan">
          <span className="tanya">Berapa {unit} lebih?</span>
          <div className="chips">
            {["0", "5", "10", "20"].map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={lebih === v}
                onClick={() => setLebih(v)}
              >
                {v === "0" ? "Tiada" : v}
              </button>
            ))}
            <input
              className="field kecil"
              value={lebih}
              inputMode="numeric"
              onChange={(e) => setLebih(e.target.value.replace(/\D/g, ""))}
              placeholder="Lain"
              aria-label={"Berapa " + unit + " lebih"}
            />
          </div>
        </div>

        <button
          className="save amber"
          disabled={nilai <= 0}
          onClick={() => {
            const beza = nilai - patut;
            dispatch({
              type: "tutup",
              day: hariIni,
              tunai: nilai,
              patut,
              habis,
              lebih: Number(lebih) || 0
            });
            bertoast(
              Math.abs(beza) < 0.5
                ? "Kira tepat. Untung " + rm(hariIniData.untung)
                : (beza > 0 ? "Lebih " : "Kurang ") + rm(Math.abs(beza)) + " dari sepatutnya"
            );
            onTutup();
          }}
        >
          Tutup Kira Hari Ni
        </button>
        <p className="footnote">
          Dua soalan bawah tu boleh dilangkau. Tapi kalau kau jawab, esok Kira boleh cakap berapa
          patut kau masak.
        </p>
      </Sheet>
    );
  }

  // ---------- hutang ----------
  if (mode === "hutang") {
    return (
      <Sheet tajuk="Hutang Baru" hint="Siapa yang ambil dulu, bayar kemudian." onTutup={onTutup}>
        <label className="lbl-field">
          <span>Nama pelanggan</span>
          <input
            className="field"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Abang Din lori sampah"
            autoFocus
          />
        </label>
        <label className="lbl-field">
          <span>Nombor WhatsApp (pilihan)</span>
          <input
            className="field"
            value={fon}
            inputMode="tel"
            onChange={(e) => setFon(e.target.value)}
            placeholder="012-345 6789"
          />
        </label>
        <PapanNombor buf={buf} setBuf={setBuf}>
          <Chips
            pilihan={[3, 5, 10, 20].map((v) => ({ label: "RM " + v, amt: v }))}
            dipilih={null}
            onPilih={(p) => setBuf(String(Math.round(p.amt * 100)))}
          />
        </PapanNombor>
        <button
          className="save"
          disabled={nilai <= 0 || !nama.trim()}
          onClick={() => {
            dispatch({ type: "hutang+", nama: nama.trim(), fon, amount: nilai, day: hariIni });
            bertoast("Hutang direkod");
            onTutup();
          }}
        >
          Simpan Hutang
        </button>
      </Sheet>
    );
  }

  // ---------- jualan / modal / rumah ----------
  const jualan = mode === "jualan";
  const rumah = mode === "rumah";

  const pilihan = jualan
    ? S.menu.map((m) => ({
        label: m.nama,
        pendek: m.nama.split(" ").slice(0, 3).join(" "),
        amt: m.harga
      }))
    : (rumah ? KATEGORI_RUMAH : KATEGORI_MODAL).map((c) => ({ label: c }));

  const tajuk = jualan ? "Tambah Jualan" : rumah ? "Ambil Untuk Rumah" : "Tambah Modal";
  const hint = jualan
    ? "Duit masuk. Pilih barang atau taip jumlah terus."
    : rumah
      ? "Duit yang kau ambil dari tin untuk hidup. Bukan modal, bukan salah."
      : "Duit keluar untuk bisnes. Belanja pasar, gas, plastik, sewa lot.";

  return (
    <Sheet tajuk={tajuk} hint={hint} onTutup={onTutup}>
      <PapanNombor buf={buf} setBuf={setBuf}>
        <Chips
          pilihan={pilihan}
          dipilih={note}
          onPilih={(p) => {
            setNote(p.label);
            if (p.amt) setBuf(String(Math.round(p.amt * 100)));
          }}
        />
      </PapanNombor>
      <button
        className={"save" + (rumah ? " rumah" : "")}
        disabled={nilai <= 0}
        onClick={() => {
          dispatch({ type: "entry+", jenis: mode, amount: nilai, note, day: hariIni });
          bertoast(
            jualan
              ? "Jualan " + rm(nilai) + " masuk"
              : rumah
                ? "RM " + money(nilai) + " untuk rumah direkod"
                : "Modal " + rm(nilai) + " direkod"
          );
          onTutup();
        }}
      >
        {jualan ? "Simpan Jualan" : rumah ? "Simpan" : "Simpan Modal"}
      </button>
      {rumah ? (
        <p className="footnote">
          Ini tak tolak untung kau. Ia cuma beritahu Kira kenapa duit dalam tin kurang, supaya
          tutup kira malam ni tak salah tuduh kau.
        </p>
      ) : null}
    </Sheet>
  );
}
