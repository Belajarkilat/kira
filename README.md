# Kira

Aplikasi rekod untung harian untuk peniaga tepi jalan di Malaysia.
Disimpan 6 September 2026.

---

## Idea teras

Peniaga tepi jalan tidak perlukan sistem POS. Mereka perlukan **buku tutup kira
harian** dalam telefon.

Aplikasi lain gagal sebab memaksa peniaga rekod setiap jualan satu per satu.
Waktu sibuk, tangan berminyak, pelanggan beratur, tiada siapa nak tekan telefon.

Kira hanya tanya **dua soalan sehari**:

1. Pagi, berapa modal? (Snap resit pasar borong)
2. Malam, berapa duit dalam tin?

Selebihnya sistem yang kira. Dua puluh saat, bukan dua puluh minit.

---

## Jenama

| Perkara | Keputusan |
|---|---|
| Nama | **Kira** |
| Chaldean | 6 (Zuhrah: tarikan, kesetiaan, orang balik semula) |
| Logo | Undi lidi, 4 garis tegak + garis kelima melintang kuning kunyit |
| Tagline | Kira sekejap, tahu untung. |
| Pancing iklan | Dah kira untung hari ni? |

### Palet

| Warna | Heks | Guna |
|---|---|---|
| Hijau Pandan | `#2E7D4F` | Untung |
| Kuning Kunyit | `#E8A317` | Butang tindakan |
| Merah Cili | `#C4452D` | Amaran, rugi |
| Hitam Kuali | `#1A1D16` | Kad nombor besar |
| Kertas Nasi | `#EDEAE1` | Latar |

Fon: Bricolage Grotesque (paparan) + Archivo (badan dan nombor).

### Nama yang ditolak

Untung (Chaldean 29, nombor amaran, terlalu generik),
Laba (7, lemah untuk urusan duit),
Tabung (21, nombor bagus tapi keliru dengan Tabung Haji),
Cuan (15, bagus tapi lebih Indonesia).

---

## Ciri

**Percuma selamanya**
- Tambah Jualan, Tambah Modal (papan nombor dahulu, bukan borang)
- Tutup Kira (bandingkan duit dalam tin dengan yang sepatutnya)
- Untung hari ini sebagai nombor besar

**Berbayar RM 120 setahun atau RM 15 sebulan**
- Buku hutang pelanggan dengan peringatan WhatsApp
- Untung ikut setiap barang, bendera merah bila margin bawah 35%
- Laporan minggu dan bulan
- Eksport untuk cukai dan e-Invois

**Model percubaan**: percuma sehingga 14 kali tutup kira, bukan 30 hari kalendar.
Percubaan kalendar 30 hari ditolak sebab churn berlaku minggu pertama, nilai
sebenar baru muncul selepas sebulan, dan 30 hari sama panjang dengan musim
bazar Ramadan.

---

## Prinsip UI dan UX

- Satu ibu jari sahaja, semua butang utama di bawah
- Papan nombor dahulu, borang kemudian
- Teks minimum 18px, butang minimum 56px
- Mod gelap untuk pasar malam
- Berfungsi tanpa internet
- Bahasa Melayu penuh, guna Modal / Jualan / Untung, bukan COGS / margin
- Maksimum tiga tekan untuk kerja utama
- Empat tab sahaja

---

## Pemasaran

Sasaran: **Ramadan sekitar 18 Februari 2027** (sahkan dengan takwim rasmi).

| Fasa | Tempoh | Ukuran berjaya |
|---|---|---|
| 1. Peniaga pengasas | Sep–Okt 2026 | 15 daripada 30 tutup kira 5 hari berturut |
| 2. Enjin kandungan | Nov–Dis 2026 | 3,000 pemasangan, 40% aktif |
| 3. Senarai menunggu | Jan 2027 | 1,500 nama, 3 kerjasama tapak |
| 4. Musim bazar | Feb–Mac 2027 | 5,000 pemasangan dalam 30 hari |
| 5. Tukar jadi bayaran | Apr 2027 | 600 pelanggan berbayar |

Bajet setahun bawah RM 11,000. Tiada iklan sejuk. Iklan hanya untuk
penyasaran semula penonton video, Feb hingga Mac sahaja.

**Syarat berhenti**: kalau kurang 10 daripada 30 peniaga pengasas tutup kira
lima hari berturut, produk yang salah, bukan pemasaran. Balik ke kod.

---

## Fail dalam folder ini

| Fail | Isi |
|---|---|
| `app/` | MVP sebenar, React dan Vite, dibungkus jadi PWA. Baca `app/README.md` |
| `prototaip-kira.html` | Prototaip satu fail, kini rujukan reka bentuk sahaja |
| `pelan-pemasaran-rm150.html` | Pelan pemasaran semakan 7 Sep 2026: empat bulan turun padang tanpa kos, kemudian RM150 sebulan untuk sasar semula |
| `pelan-pasaran.html` | Pelan pemasaran asal bajet RM11,000 setahun, kini digantikan |
| `iklan-15-saat.html` | Iklan menegak 9:16 dengan telefon berputar 3D, untuk dirakam skrin |

Buka terus dalam pelayar. Data prototaip disimpan dalam pelayar sahaja.

### Pautan Artifact

- Prototaip: https://claude.ai/code/artifact/c6c17ad2-786d-45fe-9052-cd9911625964
- Pelan pasaran: https://claude.ai/code/artifact/173527eb-fafa-43b0-be8e-5cac9a909259
- Iklan 15 saat: https://claude.ai/code/artifact/8799fff1-5a33-4979-9765-0e6dc24fbc63
- Pelan pemasaran RM150: https://claude.ai/code/artifact/c2b15739-1936-430d-b547-329d98b0f1a9

---

## Kerja seterusnya

- [x] Bina MVP sebenar, React dan Vite, bungkus jadi PWA (7 Sep 2026, dalam `app/`)
- [ ] Sambung pembayaran sebenar, DuitNow QR atau perbankan internet
- [ ] Buang suis ujian keadaan pengguna dalam Tetapan sebelum keluaran awam
- [ ] Uji pada telefon Android sebenar, pasang sebagai PWA
- [ ] Semak nama Kira di SSM dan gedung aplikasi
- [ ] Sahkan tarikh Ramadan 2027 dengan takwim rasmi
- [ ] Sertai 15 hingga 20 kumpulan Facebook peniaga
- [ ] Cari 30 peniaga pengasas
