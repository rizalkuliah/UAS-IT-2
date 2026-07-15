# Always T-Shirt

Website e-commerce untuk brand kaos lokal **Always T-Shirt**. Dibangun menggunakan HTML, CSS, dan JavaScript murni (vanilla), tanpa framework, sehingga ringan dan dapat dijalankan langsung di browser tanpa proses instalasi tambahan.

---

## 1. Nama Bisnis & Deskripsi

**Always T-Shirt** adalah brand fashion lokal yang berfokus pada penjualan kaos premium, berdiri sejak tahun 2026. Konsepnya berpusat pada tiga hal: kualitas bahan, kenyamanan, dan harga yang wajar, dengan proses belanja yang sederhana dan efisien.

**Value proposition:**
- Bahan 100% katun organik bersertifikat, nyaman digunakan untuk pemakaian sehari-hari
- Proses produksi yang lebih ramah lingkungan (bagian dari gerakan #FashionUntukBumi)
- Desain eksklusif hasil kolaborasi dengan desainer lokal Indonesia
- Harga yang kompetitif dibanding brand kaos premium lain
- Proses belanja online yang cepat, dari pemilihan produk hingga checkout hanya membutuhkan beberapa langkah

Secara umum, Always T-Shirt diposisikan sebagai pilihan untuk konsumen yang mencari kaos berkualitas dengan harga yang tetap terjangkau dan proses belanja yang praktis.

## 2. Target Market & Segmentasi Pelanggan

Target utama adalah remaja hingga dewasa muda, dengan rentang usia sekitar 18–35 tahun, yang memiliki karakteristik sebagai berikut:
- Menyukai fashion kasual namun tetap memperhatikan kualitas bahan
- Terbiasa berbelanja online dan familiar dengan e-wallet (DANA, OVO, GoPay)
- Memiliki kepedulian terhadap isu lingkungan, sehingga produk yang bersifat "eco-friendly" menjadi nilai tambah

Segmentasi pelanggan dapat dibagi menjadi beberapa kelompok:
- **Casual buyer** — membeli kaos basic untuk pemakaian sehari-hari
- **Fashion enthusiast** — tertarik pada koleksi Graphic dan Limited Edition
- **Segmen olahraga/aktif** — mencari kategori Sport untuk kebutuhan olahraga atau gym
- **Segmen premium** — bersedia membayar lebih untuk kualitas dan eksklusivitas (kategori Premium & Limited)

## 3. Analisis Pasar Singkat & Kompetitor

Pasar kaos lokal di Indonesia cukup kompetitif, diisi oleh brand besar seperti Erigo dan 3Second, hingga pelaku UMKM di berbagai marketplace. Persaingan utama terjadi pada aspek harga dan kecepatan mengikuti tren desain.

**Kompetitor langsung:** brand kaos lokal sekelas (Erigo, Uniqlo untuk kategori basic tee, serta penjual kaos di Shopee/Tokopedia)

**Keunggulan Always T-Shirt dibanding kompetitor:**
- Fokus pada bahan katun organik, yang belum banyak diadopsi kompetitor lokal
- Sistem katalog dan checkout sendiri, tidak bergantung pada marketplace pihak ketiga, sehingga margin lebih terjaga
- Tersedia dashboard admin untuk mengelola stok dan pesanan secara langsung (real-time)

**Tantangan:** brand-brand besar sudah memiliki tingkat awareness yang lebih tinggi, sehingga Always T-Shirt perlu strategi promosi dan SEO yang kuat sejak awal agar dapat ditemukan oleh calon pembeli.

## 4. Strategi Manajemen Produk & Katalog

Katalog dibagi ke beberapa kategori: **Casual, Basic, Graphic, Sport, Premium,** dan **Limited**. Tiap produk punya info harga, stok per ukuran (S/M/L/XL), gambar, dan opsi harga promo kalau lagi diskon.

Pengelolaan produk dilakukan lewat halaman admin (`⚙️ Admin`), di mana admin bisa:
- Menambah, mengedit, atau menghapus produk
- Mengatur stok per ukuran
- Menetapkan harga promo untuk produk tertentu
- Reset katalog ke data default kalau diperlukan

Untuk sisi pengunjung, tersedia fitur pencarian, filter kategori, dan pengurutan harga (naik/turun) untuk memudahkan pencarian produk.

## 5. Model Bisnis & Revenue Stream

Model bisnis yang digunakan adalah **D2C (Direct-to-Consumer)**, yaitu penjualan langsung dari brand kepada pembeli melalui website sendiri, tanpa melalui marketplace pihak ketiga. Dengan model ini, margin keuntungan lebih terjaga dan data pelanggan sepenuhnya dikuasai oleh brand.

**Sumber pendapatan:**
- Penjualan kaos reguler (kategori Casual, Basic, Sport, dll)
- Penjualan produk Premium & Limited Edition dengan margin lebih tinggi
- Potensi ke depan: kolaborasi terbatas dengan desainer lokal (limited drop) yang biasanya lebih cepat laku dan bisa dijual dengan harga premium

## 6. Strategi Harga, Promosi, dan Diskon

Rentang harga produk saat ini dari sekitar Rp119.000 sampai Rp399.000, tergantung kategori dan tingkat eksklusivitas (kaos Basic/Casual di harga bawah, Premium dan Limited Edition di harga atas).

**Strategi promosi:**
- Kode promo (misalnya `ALWAYS15` untuk diskon 15%) yang ditampilkan langsung di halaman utama
- Harga promo per produk yang dapat diatur admin sewaktu-waktu melalui dashboard
- Penampilan produk "Featured" di halaman depan untuk mendorong penjualan produk tertentu

Ke depan, strategi ini dapat dikembangkan lebih lanjut dengan promo musiman (harbolnas, akhir tahun) atau diskon khusus untuk member.

## 7. Proses Checkout & Simulasi Payment Gateway

Alur belanja: pilih produk → pilih ukuran & jumlah → masuk keranjang → isi data di halaman checkout → pilih metode pembayaran → konfirmasi pesanan.

Metode pembayaran yang tersedia saat ini masih berupa **simulasi/dummy**, mencakup:
- Transfer Bank (ditampilkan nomor rekening dummy)
- PayPal
- DANA, OVO, GoPay

Setelah pesanan dibuat, sistem menampilkan informasi pesanan beserta tombol konfirmasi melalui WhatsApp kepada admin. Dengan demikian, payment gateway pada versi ini belum terhubung ke penyedia pembayaran sesungguhnya (seperti Midtrans atau Xendit); seluruh proses masih bersifat simulasi untuk keperluan demo/prototipe. Untuk versi produksi, bagian ini perlu digantikan dengan integrasi payment gateway resmi agar transaksi dapat diproses secara otomatis dan aman.

## 8. Rencana SEO, Keamanan, dan Pemeliharaan

**SEO:**
- Lengkapi meta title & description tiap halaman produk
- Tambahkan sitemap.xml dan robots.txt
- Optimasi kecepatan loading (kompres gambar produk, minify CSS/JS)
- Gunakan struktur URL dan heading yang jelas untuk tiap kategori produk

**Keamanan:**
- Login admin saat ini masih pakai kredensial statis di sisi client — untuk produksi wajib dipindah ke backend dengan autentikasi yang benar (hashing password, session/token, dll)
- Validasi input di form checkout untuk mencegah data kosong/tidak valid
- Ke depan perlu HTTPS, proteksi terhadap serangan umum (XSS, CSRF), dan penyimpanan data pesanan yang lebih aman (saat ini disimpan di local storage browser, belum di server/database sungguhan)

**Pemeliharaan:**
- Update stok dan katalog secara berkala lewat dashboard admin
- Backup data produk dan pesanan secara rutin
- Monitoring bug dan feedback pengguna untuk perbaikan berkelanjutan

## 9. Rencana Penggunaan Data Analytics

Data yang bisa dikumpulkan dari aktivitas di website ini antara lain: produk yang paling sering dilihat/dibeli, kategori favorit, kata kunci yang sering dicari, serta metode pembayaran yang paling banyak dipilih.

Data-data itu bisa dipakai untuk:
- Menentukan produk mana yang perlu di-restock lebih banyak
- Menyesuaikan strategi harga dan promo berdasarkan kategori yang paling laku
- Mengetahui pola belanja pelanggan (misalnya jam-jam ramai transaksi) untuk atur waktu promosi
- Evaluasi performa tiap kategori produk, sehingga keputusan bisnis (tambah stok, hentikan produk kurang laku, buat varian baru) bisa lebih berdasarkan data, bukan cuma perkiraan

Ke depannya, integrasi dengan tools seperti Google Analytics atau dashboard internal bisa membantu memantau semua ini secara lebih rapi dan real-time.

---

## Kontak

📍 Jl. Raya Laswi No. 25, Ciparay, Jakarta, Indonesia
📞 +62 838-2128-4553
✉️ alwaystshirt@gmail.com
📷 Instagram: [@alwaystshirt](https://www.instagram.com/alwayst_shirt)
