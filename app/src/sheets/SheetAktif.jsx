import { useState } from "react";
import Sheet from "../components/Sheet.jsx";
import PapanNombor from "../components/PapanNombor.jsx";
import { useStore } from "../lib/store.jsx";
import { KATEGORI_MODAL, KATEGORI_RUMAH, HABIS } from "../lib/storage.js";
import { rm, nilaiBuf, money, tarikhPendek } from "../lib/format.js";
import { ofDay, patutDalamTin, ringkasBulan, ayatKad } from "../lib/derive.js";
import { FAEDAH } from "../components/Gate.jsx";
import { NOMBOR_SOKONGAN, bersihKod, kodSah } from "../lib/naiktaraf.js";
import { Kad, Tanda } from "../components/Ikon.jsx";

// Peniaga sibuk memang akan terlupa satu malam. Tanpa pilihan ini, malam itu
// hilang terus sebab setiap rekod dipaku pada hari semasa.
function PilihMalam({ hariIni, semalam, dipilih, onPilih }) {
  return (
    <div className="pilih-malam">
      <span className="pm-label">Rekod untuk</span>
      <div className="seg kecil">
        <button type="button" aria-pressed={dipilih === hariIni} onClick={() => onPilih(hariIni)}>
          Malam ni
        </button>
        <button type="button" aria-pressed={dipilih === semalam} onClick={() => onPilih(semalam)}>
          Semalam, {tarikhPendek(semalam)}
        </button>
      </div>
    </div>
  );
}

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
  const { S, dispatch, hariIni, semalam, bertoast } = useStore();
  const [hariSasar, setHariSasar] = useState(hariIni);
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
  const [kuantiti, setKuantiti] = useState(1);
  const [kod, setKod] = useState("");
  const [pasar, setPasar] = useState(() => S.closes[hariIni]?.pasar || S.pasar[0] || "");

  const sasarData = ofDay(S, hariSasar);

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
              Bayar RM {pelan} melalui DuitNow atau pindahan bank. Lepas tu penjual bagi satu kod
              untuk nama gerai kau, dan kod tu buka semua ciri di sini.
            </span>
          </div>
        </div>

        {NOMBOR_SOKONGAN ? (
          <button
            className="ghost"
            onClick={() => {
              const mesej =
                "Assalamualaikum, saya nak naik taraf Kira. Nama gerai saya " +
                (S.gerai.nama || "-") +
                ". Pelan RM " +
                pelan +
                ".";
              window.open(
                "https://wa.me/" + NOMBOR_SOKONGAN + "?text=" + encodeURIComponent(mesej),
                "_blank",
                "noopener"
              );
            }}
          >
            Hubungi penjual di WhatsApp
          </button>
        ) : null}

        <label className="lbl-field">
          <span>Kod naik taraf</span>
          <input
            className="field kod"
            value={kod}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => setKod(e.target.value.toUpperCase().slice(0, 12))}
            placeholder="XXXX-XXXX"
          />
        </label>
        <button
          className="save amber"
          disabled={bersihKod(kod).length !== 8}
          onClick={() => {
            if (!kodSah(S.gerai.nama, kod)) {
              bertoast("Kod tak padan dengan nama gerai ni.");
              return;
            }
            dispatch({ type: "plan", plan: "pro" });
            bertoast("Semua ciri dibuka. Terima kasih.");
            onTutup();
          }}
        >
          Buka dengan kod
        </button>
        <p className="footnote">
          Kod terikat pada nama gerai <b>{S.gerai.nama || "kau"}</b>. Sebut nama tu masa minta kod.
        </p>
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
    const patut = patutDalamTin(S, hariSasar);
    const unit = S.gerai.unit || "bungkus";
    const sudah = S.closes[hariSasar];
    return (
      <Sheet
        tajuk="Tutup Kira"
        hint="Kira semua duit dalam tin sekarang, masukkan jumlahnya."
        onTutup={onTutup}
      >
        <PilihMalam
          hariIni={hariIni}
          semalam={semalam}
          dipilih={hariSasar}
          onPilih={(k) => {
            setHariSasar(k);
            setPasar(S.closes[k]?.pasar || S.pasar[0] || "");
          }}
        />
        {sudah ? (
          <div className="note kecil">
            Malam ni dah ditutup dengan {rm(sudah.tunai)} dalam tin. Kalau kau simpan lagi sekali,
            angka lama diganti.
          </div>
        ) : null}
        <div className="recon">
          <div>
            <span>Duit tukar pagi</span>
            <span>{rm(S.gerai.duitTukar)}</span>
          </div>
          <div>
            <span>Jualan tunai malam ni</span>
            <span>+ {rm(sasarData.jualanTunai)}</span>
          </div>
          {sasarData.kutip > 0 ? (
            <div>
              <span>Hutang lama dikutip</span>
              <span>+ {rm(sasarData.kutip)}</span>
            </div>
          ) : null}
          <div>
            <span>Modal malam ni</span>
            <span>− {rm(sasarData.modal)}</span>
          </div>
          <div>
            <span>Ambil untuk rumah</span>
            <span>− {rm(sasarData.rumah)}</span>
          </div>
          <div className="total">
            <span>Sepatutnya dalam tin</span>
            <span>{rm(patut)}</span>
          </div>
        </div>

        <PapanNombor buf={buf} setBuf={setBuf} />

        <div className="soalan">
          <span className="tanya">Malam ni kau di mana?</span>
          <div className="chips">
            {S.pasar.map((p) => (
              <button key={p} type="button" aria-pressed={pasar === p} onClick={() => setPasar(pasar === p ? "" : p)}>
                {p}
              </button>
            ))}
            <input
              className="field kecil lebar"
              value={S.pasar.includes(pasar) ? "" : pasar}
              onChange={(e) => setPasar(e.target.value)}
              placeholder={S.pasar.length ? "Tempat lain" : "Contoh: Taman Seri"}
              aria-label="Nama pasar atau tempat"
            />
          </div>
          <span className="kaki-tanya">
            Nama tempat diingat, malam depan kau cuma tekan. Lepas beberapa malam Laporan boleh
            cakap tempat mana berbaloi.
          </span>
        </div>

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
              day: hariSasar,
              tunai: nilai,
              patut,
              habis,
              lebih: Number(lebih) || 0,
              pasar: pasar.trim()
            });
            bertoast(
              Math.abs(beza) < 0.5
                ? "Kira tepat. Untung " + rm(sasarData.untung)
                : (beza > 0 ? "Lebih " : "Kurang ") + rm(Math.abs(beza)) + " dari sepatutnya"
            );
            onTutup();
          }}
        >
          {hariSasar === hariIni ? "Tutup Kira Malam Ni" : "Tutup Kira " + tarikhPendek(hariSasar)}
        </button>
        {sasarData.hutangBaru > 0 ? (
          <p className="footnote">
            Jualan hutang {rm(sasarData.hutangBaru)} malam ni tak masuk kiraan tin, sebab duitnya
            memang belum sampai. Untung kau tetap dikira penuh.
          </p>
        ) : null}
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
        <PilihMalam hariIni={hariIni} semalam={semalam} dipilih={hariSasar} onPilih={setHariSasar} />
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
            dispatch({ type: "hutang+", nama: nama.trim(), fon, amount: nilai, day: hariSasar });
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

  // Peniaga jual tiga bungkus sekali gus lebih kerap daripada satu. Tanpa
  // kuantiti, dia kena darab dalam kepala sebelum boleh taip, tiap-tiap kali.
  const banyak = jualan ? Math.max(1, kuantiti) : 1;
  const jumlah = Math.round(nilai * banyak * 100) / 100;
  const unit = S.gerai.unit || "bungkus";

  const tajuk = jualan ? "Tambah Jualan" : rumah ? "Ambil Untuk Rumah" : "Tambah Modal";
  const hint = jualan
    ? "Duit masuk. Pilih barang atau taip jumlah terus."
    : rumah
      ? "Duit yang kau ambil dari tin untuk hidup. Bukan modal, bukan salah."
      : "Duit keluar untuk bisnes. Belanja pasar, gas, plastik, sewa lot.";

  return (
    <Sheet tajuk={tajuk} hint={hint} onTutup={onTutup}>
      <PilihMalam hariIni={hariIni} semalam={semalam} dipilih={hariSasar} onPilih={setHariSasar} />
      <PapanNombor buf={buf} setBuf={setBuf}>
        <Chips
          pilihan={pilihan}
          dipilih={note}
          onPilih={(p) => {
            setNote(p.label);
            if (p.amt) setBuf(String(Math.round(p.amt * 100)));
          }}
        />
        {jualan ? (
          <div className="kuantiti">
            <span className="kq">Berapa {unit}?</span>
            <div className="kpad">
              <button
                type="button"
                aria-label="Kurangkan satu"
                disabled={banyak <= 1}
                onClick={() => setKuantiti((k) => Math.max(1, k - 1))}
              >
                −
              </button>
              <span className="kn" aria-live="polite">
                {banyak}
              </span>
              <button
                type="button"
                aria-label="Tambah satu"
                onClick={() => setKuantiti((k) => Math.min(999, k + 1))}
              >
                +
              </button>
            </div>
            <span className="kj">
              {banyak > 1 ? banyak + " × " + rm(nilai) + " = " + rm(jumlah) : "Harga seunit"}
            </span>
          </div>
        ) : null}
      </PapanNombor>
      <button
        className={"save" + (rumah ? " rumah" : "")}
        disabled={jumlah <= 0}
        onClick={() => {
          const butiran = jualan && banyak > 1 ? (note || "Jualan") + " × " + banyak : note;
          dispatch({ type: "entry+", jenis: mode, amount: jumlah, note: butiran, day: hariSasar });
          bertoast(
            jualan
              ? "Jualan " + rm(jumlah) + " masuk"
              : rumah
                ? "RM " + money(jumlah) + " untuk rumah direkod"
                : "Modal " + rm(jumlah) + " direkod"
          );
          onTutup();
        }}
      >
        {jualan ? "Simpan Jualan " + rm(jumlah) : rumah ? "Simpan" : "Simpan Modal"}
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
