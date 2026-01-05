
<h1 align="center"> Toko Buku Online (On-Book) <br> <sub>Tugas PWSK - Proyek Website</sub></h1>

## A. Deskripsi Singkat
On-Book adalah sebuah website toko buku online yang menyediakan berbagai koleksi buku berkualitas mulai dari fiksi, non-fiksi, edukasi, hingga buku anak. Website ini dirancang untuk memudahkan pengguna dalam mencari, melihat detail, dan memilih buku favorit mereka dengan antarmuka yang responsif dan interaktif.

## B. Daftar Anggota
Berikut adalah anggota tim yang berkontribusi dalam pengembangan project ini:

| Nama | NIM | Username GitHub | Peran / Tugas |
|------|-----|-----------------|---------------|
| Kadek Novan Suhaliem Chandra | 240040107 | [Novan2](https://github.com/username1) | Frontend (Home, About & Kontak Kategori, Footer), Backend (API Goggle Books, Slider, Contact Form, Map Search Feature On-Book)|
| [I Gede Sandi Pujanta] | [240040129] | [@SandiPujanta](https://github.com/SandiPujanta) | Frontend (Home,Header, menu ulasan/testimoni, bootstrap) Backend (Search bar pada menu home & kategori, carousel) 
| [Nama Anggota 3] | [NIM 3] | [@username3](https://github.com/username3) | JavaScript Logic & API |

## C. Teknologi yang Digunakan
Website ini dibangun menggunakan teknologi web modern:
*   **HTML5**: Struktur halaman web.
*   **CSS3**: Styling responsif dan animasi (custom CSS & variabel).
*   **JavaScript (ES6+)**: Logika interaktif dan pemanggilan API.
*   **Bootstrap 3.4.1**: Framework CSS untuk grid system dan komponen dasar.
*   **Google Books API**: Sumber data dinamis untuk menampilkan daftar buku.

## D. Fitur Utama
1.  **Katalog Buku Dinamis**: Menampilkan daftar buku terbaru dan terpopuler yang diambil langsung dari Google Books API.
2.  **Pencarian Buku**: Fitur pencarian real-time untuk menemukan buku berdasarkan judul atau kata kunci.
3.  **Filter Kategori**: Memudahkan pengguna menyaring buku berdasarkan genre (Fiksi, Non-Fiksi, Komik, Sains, dll).
4.  **Carousel Banner**: Slider interaktif untuk menampilkan promo atau buku unggulan di halaman utama.
5.  **Halaman Detail**: Modal pop-up yang menampilkan informasi lengkap buku (deskripsi, pengarang, harga).
6.  **Formulir Kontak**: Form interaktif dengan validasi input dan notifikasi sukses animasi.
7.  **Testimoni Slider**: Menampilkan ulasan pelanggan dalam format slider.
8.  **Responsif**: Tampilan yang menyesuaikan dengan berbagai ukuran layar (Desktop, Tablet, Mobile).

## E. Struktur Folder
Project ini disusun dengan struktur folder yang rapi untuk kemudahan pengembangan:

```
/nama_project
│── index.html             # Halaman utama website (Landing Page)
│── about.html             # Halaman Tentang Kami
│── kontak.html            # Halaman Hubungi Kami
│── kategori.html          # Halaman Kategori Buku
│── testi.html             # Halaman Testimoni
│── README.md              # Dokumentasi Project
│
│── /css                   # Koleksi File CSS
│   ├── style.css          # Styling global & halaman utama
│   ├── about.css          # Styling khusus halaman About
│   ├── kontak.css         # Styling khusus halaman Kontak
│   ├── kategori.css       # Styling khusus halaman Kategori
│   └── testi-style.css    # Styling khusus halaman Testimoni
│
│── /js                    # Koleksi File JavaScript
│   ├── databuku.js        # Logika fetch API & render buku
│   ├── includes.js        # Script untuk memuat komponen HTML (Header/Footer)
│   ├── slider.js          # Logika slider banner
│   ├── search.js          # Logika pencarian buku
│   ├── kontak.js          # Validasi & logika form kontak
│   └── ... (script lainnya)
│
│── /media                 # Aset Gambar & Media
│   ├── logo.png           # Logo website
│   ├── img1.jpg           # Aset gambar halaman
│   └── ...
│
│── /components            # Komponen HTML Reusable
│   ├── header.html        # Bagian Navigasi (Navbar)
│   └── footer.html        # Bagian Kaki Halaman (Footer)
│
│── /data                  # Data statis
│   └── place.json         # Data lokasi toko (jika ada)
```

## E. Cara Menjalankan Website
Project ini dapat dijalankan dengan mudah karena merupakan static web:

1.  **Clone Repository** (atau download ZIP):
    ```bash
    git clone https://github.com/username/repo-name.git
    ```
2.  **Buka di VS Code**:
    Buka folder project menggunakan Visual Studio Code.
3.  **Jalankan dengan Live Server**:
    *   Install ekstensi "Live Server" di VS Code.
    *   Klik kanan pada file `index.html`.
    *   Pilih "Open with Live Server".
    *   Website akan terbuka otomatis di browser default Anda (biasanya di `http://127.0.0.1:5500`).

## F. Tautan GitHub Pages
Website dapat diakses secara online melalui link berikut:
[https://github.com/Novan2/PWSK-Tugas-Team.git](https://github.com/Novan2/PWSK-Tugas-Team.git)
