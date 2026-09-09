# Kira — aplikasi

MVP sebenar untuk Kira, dibina dengan React dan Vite, dibungkus jadi PWA.
Gantikan prototaip satu fail (`../prototaip-kira.html`) yang kini jadi rujukan reka bentuk sahaja.

Langsung di https://belajarkilat.github.io/kira/

## Jalankan

```
npm install
npm run dev      # pelayan pembangunan
npm run build    # keluaran ke dist/
npm run preview  # semak keluaran
npm run terbit   # bina dan tolak ke cawangan gh-pages
node scripts/buat-ikon.mjs   # jana semula ikon PNG dari lakaran undi lidi
node scripts/kod-naik-taraf.mjs "Nama Gerai"   # jana kod naik taraf selepas peniaga bayar
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
duit guna papan nombor sen-dahulu. Helaian jualan ada kuantiti, jadi tiga bungkus
RM 3 ditekan sebagai tiga, bukan didarab dalam kepala dahulu.

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

## Hutang masuk kira

Semakan 9 September 2026. Sebelum ini buku hutang terpisah daripada enjin kiraan,
jadi jualan hutang tidak menaikkan untung dan duit bayaran balik yang masuk tin
dilaporkan sebagai lebihan yang tidak diketahui puncanya. Satu hutang kini menjadi
dua peristiwa duit yang berasingan:

| Peristiwa | Untung | Duit dalam tin |
|---|---|---|
| Jualan hutang, hari barang keluar | Naik | Tidak berubah, ditanda `tunai: false` |
| Kutip hutang, hari dia bayar | Tidak berubah | Naik, entri jenis `kutip` |

Entri itu dicipta oleh reducer serentak dengan rekod hutang, jadi kedua-duanya tidak
boleh terpisah. Rekod versi 1 yang tersimpan sebelum ini dinaikkan sekali semasa
dimuatkan, dalam `naikTarafKeadaan`.

## Naik taraf tanpa gerbang pembayaran

Peniaga bayar melalui DuitNow atau pindahan bank, kemudian penjual menjana satu kod
dengan `scripts/kod-naik-taraf.mjs` dan menghantarnya. Kod itu terikat pada nama
gerai, jadi kod yang tersebar dalam kumpulan WhatsApp tidak membuka aplikasi orang
lain. Butang WhatsApp dalam helaian naik taraf menghantar peniaga ke
`NOMBOR_SOKONGAN` dalam `src/lib/naiktaraf.js`, dengan nama gerai dan pelan sudah
terisi dalam mesej. Nombor itu terbit dalam berkas awam, jadi guna nombor bisnes.

Hadnya jelas: garam berada dalam berkas yang dihantar ke pelayar, jadi sesiapa yang
sanggup membaca kod aplikasi boleh menjana kod sendiri. Ia menutup pintu yang dulu
terbuka luas, bukan pintu berkunci. Pemeriksaan di pelayan hanya berbaloi selepas
ada pelanggan yang cukup ramai.

## Sandaran

Tetapan ada dua butang. Simpan sandaran menulis fail JSON yang mengandungi seluruh
keadaan aplikasi. Muat sandaran membaca fail itu, menunjukkan isinya, dan hanya
mengganti rekod selepas peniaga menekan pengesahan kedua. Fail sandaran juga
dinaikkan ke bentuk versi semasa, jadi fail lama tetap boleh dimuatkan.

Kalau `localStorage` menolak simpanan, sepanduk merah muncul di atas skrin utama dan
dalam Tetapan, supaya peniaga tahu hari itu juga.

## Malam bisnes, bukan hari kalendar

Semakan 9 September 2026, selepas kritik dari sudut peniaga pasar malam. Peniaga
yang kemas gerai pukul 12.40 pagi dulunya menekan Tutup Kira pada hari esok yang
masih kosong, jadi aplikasi lapor dia ada beratus ringgit lebih dalam tin dan
malam yang baru habis itu tak pernah ditutup langsung.

Tetapan ada pilihan `Malam bisnes`, iaitu jam pagi yang masih dikira sebagai
malam semalam. Lalainya tengah malam, jadi peniaga siang tidak terjejas. Fungsi
`kunciHariBisnes` dalam `src/lib/format.js` yang menentukan hari, dan seluruh
aplikasi membaca `hariIni` dari store, jadi tiada satu skrin pun perlu tahu.

Setiap helaian yang merekod duit ada pilihan `Malam ni` atau `Semalam`, sebab
peniaga sibuk memang akan terlupa satu malam dan tanpa pilihan itu malam tersebut
hilang terus. Skrin Utama menegur sendiri kalau semalam ada rekod tetapi tinnya
tak pernah dikira.

## Untung ikut pasar

Peniaga bergerak menjawab satu soalan setiap petang, iaitu pasar mana berbaloi.
Satu malam diikat pada satu tempat semasa tutup kira, nama tempat itu diingat
dalam `S.pasar` supaya malam berikutnya cuma perlu ditekan, dan Laporan
memulangkan untung setiap malam kepada tempatnya.

Purata dibahagi dengan bilangan malam berniaga, bukan hari kalendar, sebab malam
yang peniaga memang tak keluar bukan malam gagal.

## Buku hutang tidak pernah dikaburkan

Nama dan angka dalam senarai hutang ditaip oleh peniaga sendiri, jadi mengunci
pandangannya bermakna menahan datanya sendiri sebagai tebusan. Bila percubaan
tamat, senarai kekal boleh dibaca dan butang `Dah bayar` kekal berfungsi, sebab
ia menggerakkan duit dalam tin dan tutup kira itu percuma selamanya. Yang dikunci
hanyalah kerja baru, iaitu tambah hutang dan hantar peringatan WhatsApp.

## Simpanan

Semua data dalam `localStorage` di bawah kunci `kira.v1`. Tiada akaun, tiada pelayan.
Bentuk data ada dalam `src/lib/storage.js`, kiraan terbitan dalam `src/lib/derive.js`,
keadaan aplikasi dalam `src/lib/store.jsx`.

Percubaan dikira ikut **bilangan tutup kira**, bukan hari kalendar. Had 30 kali,
lepas itu `plan` bertukar jadi `locked` dan tab Hutang, Barang, Laporan berkabus.

## Belum siap

- Pembayaran masih dikendalikan tangan. Tiada gerbang pembayaran, tiada resit
  automatik, dan kod boleh dijana oleh sesiapa yang membaca berkas aplikasi.
- Duit tukar pagi masih satu tetapan tetap, bukan nilai harian. Menukarnya mengubah
  kiraan tin bagi semua hari lampau.
- Tiada cara mengaku hutang lapuk. Jualan hutang dikira untung pada hari barang
  keluar dan tidak pernah ditarik balik, jadi hutang yang tak akan pulang kekal
  menaikkan untung. Membuangnya menulis semula untung malam lama secara senyap.
- Laporan tidak boleh membandingkan bulan dengan bulan, cuma tujuh hari, tiga
  puluh hari dan bulan semasa.
- Purata untung mingguan masih dibahagi tujuh hari kalendar. Hanya jadual pasar
  yang membahagi ikut malam berniaga.
- Perkataan unit kekal "bungkus" selepas pendaftaran dan tidak boleh diubah dalam
  Tetapan.
- Eksport CSV ialah fail rekod, bukan e-Invois. Tiada nombor invois dan tiada
  nombor cukai pembeli, jadi ayat jualan tentang e-Invois menjanjikan lebih
  daripada yang ada.
- Belum diuji pada telefon sebenar, baru pada penyemak imbas meja bersaiz telefon.
- Fon Bricolage Grotesque dan Archivo masih dimuat dari Google Fonts. Cache pekerja
  perkhidmatan menampung penggunaan luar talian selepas lawatan pertama, tetapi
  pemasangan pertama masih perlukan internet untuk fon.
