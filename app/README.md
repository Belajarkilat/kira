# Kira — aplikasi

MVP sebenar untuk Kira, dibina dengan React dan Vite, dibungkus jadi PWA.
Gantikan prototaip satu fail (`../prototaip-kira.html`) yang kini jadi rujukan reka bentuk sahaja.

## Jalankan

```
npm install
npm run dev      # pelayan pembangunan
npm run build    # keluaran ke dist/
npm run preview  # semak keluaran
node scripts/buat-ikon.mjs   # jana semula ikon PNG dari lakaran undi lidi
```

## Skrin

| Skrin | Fail | Isi |
|---|---|---|
| Mula | `src/screens/Mula.jsx` | Nama gerai, duit tukar pagi, pintasan data contoh |
| Utama | `src/screens/Utama.jsx` | Untung hari ni, tiga butang rekod, saranan masak esok, tutup kira, kad bulan |
| Hutang | `src/screens/Hutang.jsx` | Siapa belum bayar, peringatan WhatsApp sebenar |
| Barang | `src/screens/Barang.jsx` | Menu boleh ubah, margin setiap barang, bendera bawah 35% |
| Laporan | `src/screens/Laporan.jsx` | Carta 7 hari, ringkasan minggu dan 30 hari, eksport CSV |
| Tetapan | `src/screens/Tetapan.jsx` | Gerai, tema, langganan, data, suis keadaan pengguna |

Enam helaian bawah dalam `src/sheets/SheetAktif.jsx`: tambah jualan, tambah modal,
ambil untuk rumah, hutang baru, tutup kira, kad bulan, naik taraf. Yang melibatkan
duit guna papan nombor sen-dahulu.

## Versi Kak Ani

Semakan 7 September 2026 selepas kajian dua persona. Peniaga yang tin gerainya juga
dompet keluarga akan lari dalam seminggu kalau tutup kira menuduh dia setiap malam.
Lima perubahan:

| Perubahan | Kesan |
|---|---|
| Jenis rekod ketiga, Ambil Untuk Rumah | Duit tin yang masuk ke hidup peniaga. Tidak menolak untung, tetapi menolak baki yang sepatutnya ada dalam tin |
| Tutup kira tolak duit rumah | Tin yang kurang RM60 sebab yuran sekolah tidak lagi dilaporkan sebagai duit hilang |
| Dua soalan tambahan semasa tutup kira | Habis pukul berapa dan berapa lebih. Boleh dilangkau |
| Saranan berapa nak masak esok | Guna jawapan dua soalan itu dengan bilangan yang dimasak sehari |
| Kad bulan boleh dihantar ke WhatsApp | Angka peniaga sendiri, ada pilihan tutup angka. Ini enjin pemasaran dalam pelan RM150 |

Percubaan dilonggarkan dari 14 kepada 30 kali tutup kira, supaya paywall tidak
memotong tepat sebelum data cukup untuk membuktikan nilai.

## Simpanan

Semua data dalam `localStorage` di bawah kunci `kira.v1`. Tiada akaun, tiada pelayan.
Bentuk data ada dalam `src/lib/storage.js`, kiraan terbitan dalam `src/lib/derive.js`,
keadaan aplikasi dalam `src/lib/store.jsx`.

Percubaan dikira ikut **bilangan tutup kira**, bukan hari kalendar. Had 30 kali,
lepas itu `plan` bertukar jadi `locked` dan tab Hutang, Barang, Laporan berkabus.

## Belum siap

- Pembayaran sebenar belum disambung. Butang Bayar dalam helaian naik taraf hanya
  menukar keadaan kepada `pro` untuk ujian.
- Suis "Ujian keadaan pengguna" dalam Tetapan mesti dibuang sebelum keluaran awam.
- Belum diuji pada telefon sebenar, baru pada penyemak imbas meja bersaiz telefon.
- Fon Bricolage Grotesque dan Archivo masih dimuat dari Google Fonts. Cache pekerja
  perkhidmatan menampung penggunaan luar talian selepas lawatan pertama, tetapi
  pemasangan pertama masih perlukan internet untuk fon.
