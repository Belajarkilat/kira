# Sambung Kira di sini

Fail ini ringkasan keadaan projek Kira supaya sesi baharu boleh terus sambung.
Kemas kini terakhir 10 September 2026, selepas keluaran versi 0.2.0.

Untuk sambung, buka Claude Code dalam mana-mana folder dan taip **sambung kira**.

---

## Keadaan sekarang

| Perkara | Keadaan |
|---|---|
| Versi | 0.2.0 |
| Live | https://belajarkilat.github.io/kira/ |
| Repo | https://github.com/Belajarkilat/kira (cawangan `main`, keluaran di `gh-pages`) |
| Kod | `C:\Users\Hasfi\Desktop\kira\app` |
| Commit terakhir | `ab62748` malam bisnes, untung ikut pasar, buku hutang terbuka |
| Jualan sebenar | Belum bermula |

Aplikasi berfungsi penuh dan boleh dihantar kepada sesiapa. Yang belum ialah
pengesahan pada telefon sebenar dan aliran pembayaran yang boleh diskala.

---

## Langkah seterusnya, ikut keutamaan

### 1. Jalankan ujian pada telefon Android sebenar

Senarai semak 36 langkah sudah siap dan boleh ditanda terus:

**https://claude.ai/code/artifact/a266a933-426d-457e-b841-2d15c54ef6ba**

Tujuh bahagian mengikut turutan. A pasang dan buka. B gelung harian. C malam
bisnes, perlu jam telefon diubah ke 12.40 pagi. D hutang dan tiga butang
WhatsApp. E fail dan naik taraf. F tahan lasak, termasuk mod pesawat dan
matahari tengah hari. G ujian senyap dengan peniaga sebenar, termasuk soalan
sama ada dia sanggup bayar RM 120 setahun.

Sepuluh item bertanda **Mesti lulus**. Kalau mana-mana satu gagal, aplikasi
belum sedia dijual.

Jawapan disimpan dalam pangkalan data halaman itu sendiri. Dalam sesi baharu,
Claude boleh baca terus dengan `read_db` pada koleksi `ujian` dan dokumen
`meta/peranti`, jadi tak perlu ceritakan semula apa yang gagal.

### 2. Baiki apa yang gagal dalam ujian itu

### 3. Pincang yang sudah diketahui, ikut bahaya

- **Hutang lapuk.** Jualan hutang dikira untung pada hari barang keluar dan
  tidak pernah ditarik balik. Hutang yang tak akan pulang kekal menaikkan
  untung selama-lamanya. Membuangnya menulis semula untung malam lama secara
  senyap. Ini pincang paling bahaya sebab ia menipu peniaga tentang duit.
- **Laporan tak boleh banding bulan dengan bulan.** Hanya tujuh hari, tiga
  puluh hari, dan bulan semasa. Selepas empat bulan, itu soalan yang peniaga
  betul-betul nak jawab.
- **Purata untung mingguan dibahagi tujuh hari kalendar**, bukan hari berniaga.
  Hanya jadual pasar yang membahagi dengan betul.
- **Unit kekal "bungkus"** selepas pendaftaran dan tidak boleh diubah dalam
  Tetapan. Peniaga yang jual biji atau helai nampak perkataan yang salah
  selamanya.
- **Eksport CSV dijual sebagai e-Invois** dalam skrin naik taraf, padahal fail
  itu tiada nombor invois dan tiada nombor cukai pembeli. Tukar ayat itu
  sebelum ada orang bayar keranaya.
- **Duit tukar pagi satu nilai tetap**, bukan nilai harian. Menukarnya mengubah
  kiraan tin bagi semua hari lampau.

### 4. Sebelum boleh jual

- Pembayaran masih dikendalikan tangan. Peniaga WhatsApp ke 010-664 0353, kod
  dijana dengan `node scripts/kod-naik-taraf.mjs "Nama Gerai"`, kod dihantar
  balik. Aliran ini jalan untuk sepuluh orang pertama, bukan seratus.
- Semakan nama Kira di SSM.
- Sahkan tarikh Ramadan 2027 dengan takwim rasmi. Pelan pemasaran disasarkan ke
  sekitar 18 Februari 2027.

---

## Cara kerja pada mesin ini

```bash
cd C:\Users\Hasfi\Desktop\kira\app
npm run dev        # bina tempatan
npm run terbit     # bina dan tolak ke gh-pages, terus live
node scripts/kod-naik-taraf.mjs "Nama Gerai"   # jana kod naik taraf
node scripts/buat-ikon.mjs                      # jana semula ikon PNG
```

Dua perangkap yang sudah memakan masa sebelum ini.

1. `git push origin main` biasa akan **tergantung** sebab tiada kelayakan
   tersimpan. Baca `GITHUB_TOKEN` dari `C:\Users\Hasfi\.claude\.env` dan tolak
   ke `https://x-access-token:TOKEN@github.com/Belajarkilat/kira.git`.
2. Pada Windows, Node menolak fail `.cmd` tanpa shell dan gagal dengan EINVAL,
   jadi skrip memanggil `node_modules/vite/bin/vite.js` terus melalui Node,
   bukan melalui npm.

Token itu **tiada skop workflow**, jadi fail dalam `.github/workflows` tidak
boleh ditolak dan GitHub Actions tidak digunakan langsung.

---

## Apa yang berubah dalam 0.2.0

Ketiga-tiganya datang daripada satu latihan; Claude main watak peniaga pasar
malam yang sibuk dan mengkritik aplikasi ini selepas guna 3, 10, 40 dan 120
hari.

**Hari bisnes menggantikan hari kalendar.** Peniaga yang menekan Tutup Kira
pukul 12.40 pagi dulunya menutup hari esok yang masih kosong, jadi aplikasi
lapor dia ada beratus ringgit lebih dalam tin dan malam yang baru habis tak
pernah ditutup. Tetapan kini ada jam pagi yang masih dikira malam semalam,
lalainya tengah malam supaya peniaga siang tidak terjejas. Setiap helaian duit
boleh dituju ke Malam ni atau Semalam, dan skrin Utama menegur kalau semalam ada
rekod tanpa tutup kira.

**Untung ikut pasar.** Setiap malam diikat pada satu nama tempat semasa tutup
kira, nama itu diingat, dan Laporan memulangkan untung kepada tempatnya. Purata
dibahagi dengan malam berniaga, bukan hari kalendar.

**Buku hutang tidak lagi dikaburkan.** Nama dan angka itu ditaip oleh peniaga
sendiri, jadi menutupnya bermakna menahan datanya sebagai tebusan. Senarai kekal
boleh dibaca dan butang Dah bayar kekal berfungsi. Yang dikunci hanya tambah
hutang baharu dan peringatan WhatsApp.

Versi keadaan dinaikkan ke 3. Migrasi dari versi 1 dan 2 sudah diuji dan tidak
merosakkan rekod sedia ada.

---

## Fail lain dalam folder ini

| Fail | Isi |
|---|---|
| `app/` | Kod sebenar, React dan Vite dibungkus jadi PWA |
| `app/README.md` | Nota teknikal penuh, termasuk sebab di sebalik setiap keputusan |
| `SETERUSNYA-NATIF.md` | Nota membungkus jadi aplikasi natif |
| `pelan-pasaran.html` | Pelan pemasaran lima fasa |
| `pelan-pemasaran-rm150.html` | Pelan bajet rendah |
| `iklan-15-saat.html` | Skrip iklan |
| `prototaip-kira.html` | Prototaip asal sebelum MVP |
