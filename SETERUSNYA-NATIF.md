# Seterusnya: bungkus Kira jadi aplikasi Android sebenar

Ditulis 7 September 2026. Kerja ini ditangguh atas sebab bajet token, bukan
sebab teknikal. Ia berdiri sendiri dan tidak perlukan sejarah perbualan, jadi
buka sesi baharu dan tampal arahan di bawah.

## Tampal ini dalam sesi baharu

> Bungkus aplikasi React dalam `C:\Users\Hasfi\Desktop\kira\app` jadi aplikasi
> Android sebenar guna Capacitor, kemudian bina fail APK yang boleh terus
> dipasang pada telefon. Baca `C:\Users\Hasfi\Desktop\kira\SETERUSNYA-NATIF.md`
> dahulu untuk keputusan yang dah dibuat.

## Keadaan mesin setakat 7 September 2026

Tiada Java, tiada Android SDK, tiada Gradle, tiada Android Studio. Perlu pasang
JDK 17 dan Android command-line tools dahulu, kira-kira 1.5 hingga 2 GB.

## Ciri natif yang dipersetujui

| Ciri | Sebab |
|---|---|
| Pemberitahuan tempatan waktu malam | Cangkuk tabiat. "Dah kira untung hari ni?" Ini yang bawa peniaga balik setiap malam |
| Kongsi natif untuk kad bulan | Helaian kongsi Android, boleh hantar sebagai gambar, bukan sekadar teks wa.me |
| Simpanan Capacitor Preferences | `localStorage` dalam WebView boleh dipadam bila sistem bersihkan storan. Rekod kewangan peniaga tak boleh hilang macam tu |
| Haptik pada papan nombor | Pengesahan tekan waktu tangan berminyak dan skrin sukar dilihat bawah matahari |
| Butang balik Android | Tekan balik menutup helaian, bukan keluar aplikasi terus |
| Bar status dan skrin mula ikut jenama | Hitam kuali dan kuning kunyit |

## Susunan pengedaran

1. **APK melalui WhatsApp** untuk 30 peniaga pengasas, September hingga Oktober.
   Tiada kos, tiada semakan, boleh tukar versi bila-bila masa.
2. **Play Console** hanya selepas ada 12 pengguna sebenar. Akaun pembangun
   peribadi baharu wajib jalankan ujian tertutup dengan 12 penguji selama 14
   hari sebelum dibenarkan keluar awam. Dua belas orang itu datang terus
   daripada 30 pengasas dalam pelan pemasaran.
3. Kos akaun USD 25 sekali seumur hidup. Perlu juga dasar privasi, tangkapan
   skrin, grafik senarai dan borang keselamatan data.

## Yang mesti dibuang sebelum keluaran awam

- Suis "Ujian keadaan pengguna" dalam skrin Tetapan.
- Butang Bayar dalam helaian naik taraf yang sekadar menukar keadaan kepada
  berbayar tanpa pembayaran sebenar.
