# 📢 SubscriptionRadarBJM

**SubscriptionRadarBJM** adalah aplikasi portal berita untuk **Radar Banjarmasin**.  
Pengguna dapat:
- 📖 Membaca berita dan iklan.
- 📰 Melihat daftar iklan yang tersedia.
- 💳 Melakukan berlangganan.
- 📝 Memesan pemasangan iklan koran secara online.  

Proyek ini dibangun menggunakan **MERN Stack**:
- **MySQL** → Database manajemen.
- **Express.js** → Backend REST API.
- **React.js** → Frontend interaktif.
- **Node.js** → Server runtime.
- **TailwindCSS** → Styling modern.

---

## 🚀 Fitur Utama
✅ Membaca iklan dan berita terbaru.  
✅ Sistem berlangganan untuk pengguna.  
✅ Pemesanan pemasangan iklan koran secara online.  
✅ Antarmuka modern dengan **TailwindCSS**.  
✅ Panel **Admin** untuk validasi transaksi dan kontrol sistem.

---

## 🛠 Persyaratan Sistem
Sebelum memulai, pastikan kamu sudah menginstal:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [XAMPP](https://www.apachefriends.org/) (untuk Apache + MySQL)
- [Visual Studio Code](https://code.visualstudio.com/)

> **Cek versi instalasi**  
> Jalankan perintah berikut di terminal:
```sh
node -v   # cek Node.js
git --version   # cek Git
```

---

## 📂 Instalasi & Konfigurasi

### 1️⃣ Clone Repository
```sh
git clone https://github.com/aldy02/subscriptionRadarBJM.git
cd subscriptionRadarBJM
```

### 2️⃣ Import Database
1. Jalankan **XAMPP** → nyalakan **Apache** dan **MySQL**.
2. Buka browser → akses [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Import file SQL yang ada di folder repository.

### 3️⃣ Setup Backend
```sh
cd backend
npm install
node server.js
```
Jika berhasil, kamu akan melihat:
```sh
✅ Server running on port 5000
```

### 4️⃣ Setup Frontend
Buka terminal baru:
```sh
cd frontend
npm install
npm run dev
```
Aplikasi akan berjalan di:  
➡ [http://localhost:3000](http://localhost:3000)

---

## 📌 Struktur Proyek
```
subscriptionRadarBJM/
│
├── backend/                    # Semua file server & API
│   ├── config/                 # File konfigurasi (database, env loader)
│   ├── controllers/            # Logic utama untuk setiap route
│   ├── middleware/             # Middleware (auth, upload, validator)
│   ├── models/                 # Model database Sequelize
│   ├── routes/                 # Definisi routing (API endpoint)
│   ├── tests/                  # Integration tests
│   ├── uploads/                # File upload (bisa buat folder tmp atau ads)
│   ├── .env                    # Variabel environment backend (Development Mode)
│   ├── package.json
│   └── server.js               # Entry point backend
│
├── frontend/                   # Semua file React
│   ├── public/                 # Static assets (favicon, dll.)
│   ├── src/
│   │   ├── api/                # File untuk handle API call (fetch/axios)
│   │   ├── assets/             # Gambar asset
│   │   ├── components/         # Komponen reusable
│   │   ├── layouts/            # Layout global (Admin, Customer)
│   │   ├── pages/              # Halaman utama (Home, Login, dll.)
│   │   ├── styles/             # (Opsional) styling global jika butuh
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                    # Variabel environment frontend (Development Mode)
│   ├── package.json
│   ├── vite.config.js          # Config Vite
│   └── index.html
│
├── radarbjm.sql                # File database
├── .gitignore
└── README.md                   # Dokumentasi proyek
```

---

## 💡 Tips & Troubleshooting
- ❌ **Backend gagal jalan?** → pastikan port `5000` tidak dipakai aplikasi lain.
- ❌ **Error koneksi database?** → cek `.env` atau konfigurasi database MySQL.
- ❌ **Frontend error?** → hapus folder `node_modules` dan jalankan ulang `npm install`.

---

## 🤝 Kontribusi
Kontribusi terbuka!  
Silakan buat **pull request** atau laporkan masalah di [Issues](https://github.com/aldy02/subscriptionRadarBJM/issues).

---

🎉 **Sekarang kamu siap menjalankan SubscriptionRadarBJM di lokal!**  
Happy Coding! 🚀
