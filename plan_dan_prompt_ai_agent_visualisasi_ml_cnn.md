# Blueprint Arsitektur & Master Prompt AI Agent: Platform Visualisasi Interaktif Machine Learning & CNN

Dokumen ini menyajikan rencana eksekusi *end-to-end* serta kumpulan *prompt* siap pakai untuk membangun aplikasi web edukasi interaktif **Machine Learning hingga Deep Learning (CNN)** yang dirancang khusus bagi pemula dan siap dipublikasikan langsung ke **Vercel**.

## 1. Pemilihan Tech Stack Optimal untuk Publikasi di Vercel

Kombinasi teknologi berikut bekerja sepenuhnya di sisi peramban (*100% client-side rendering & computation*), sehingga tidak membutuhkan server *backend* berbayar, bebas risiko *timeout* di Vercel Free Tier, dan memiliki performa animasi 60 FPS:

| Komponen Sistem | Teknologi yang Digunakan | Alasan Pemilihan untuk Target Pemula & Vercel |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js (App Router) + TypeScript | Terintegrasi secara *native* dengan Vercel (*zero-config deployment*) dan mendukung struktur komponen modular. |
| **Styling & UI** | Tailwind CSS + shadcn/ui + Lucide Icons | Memudahkan pembuatan tampilan *Dark Glassmorphism* yang modern, responsif, dan menonjolkan visualisasi *node* menyala (*neon glow*). |
| **Animasi Interaktif** | Framer Motion | Mengatur transisi halus saat sinyal mengalir melewati *node* (*forward pass*) dan umpan balik koreksi (*backpropagation*). |
| **Mesin Visualisasi** | Custom SVG + HTML5 Canvas API | SVG digunakan untuk grafik jaringan *node* agar tajam dan bisa diklik/*hover*, sedangkan HTML5 Canvas menangani *drawing pad* gambar angka dan matriks piksel CNN. |
| **Render Matematika** | KaTeX (`react-katex`) | Merender rumus matematika secara cepat dan mendukung interaksi *hover-to-highlight* yang terhubung langsung ke komponen visual. |
| **State Management** | Zustand | Menyimpan status global seperti pilihan **Mode Intuisi vs. Mode Matematika**, kecepatan simulasi, dan bobot jaringan secara ringan. |

## 2. Peta Jalan Pengembangan End-to-End (5 Fase Eksekusi)

Agar AI Coding Agent (seperti Cursor, Windsurf, Claude Code, v0, atau Bolt.new) tidak mengalami halusinasi atau memotong kode karena batas token, proses pembangunan dibagi menjadi 5 fase berurutan:

| Fase | Fokus Pembangunan | Deliverable Fitur Utama |
| :--- | :--- | :--- |
| **Fase 1** | **Fondasi UI, Layout Scrollytelling & Mode Adaptif** | Navigasi tahapan belajar, *sticky control bar* (Play/Pause/Step/Reset), sistem *toggle* **Mode Awam (Analogi)** vs **Mode Matematika (Rumus Interaktif)**, dan tema visual *Cyber-Educational Dark Mode*. |
| **Fase 2** | **Modul 1 & 2: Matematika Dasar & Single Neuron (Perceptron)** | Simulasi **Bukit Gradient Descent** (analogi menuruni lembah berkabut dengan pengatur *learning rate*) dan **Playground 1 Neuron** (analogi takaran resep kopi untuk memahami *Input*, *Weight*, *Bias*, dan *Activation Function*). |
| **Fase 3** | **Modul 3: Multi-Layer Perceptron (MLP) & Backpropagation** | Visualisasi jaringan *node* berlapis dengan animasi partikel sinyal mengalir maju (*Forward Pass*) dan gelombang koreksi mundur (*Backpropagation*) yang mengubah ketebalan garis bobot secara *real-time*. |
| **Fase 4** | **Modul 4: Bedah Arsitektur CNN Interaktif** | Kanvas gambar interaktif (pengguna menggambar angka 0–9), kaca pembesar **Sliding Filter/Kernel 3x3** yang bergerak memindai piksel, visualisasi **Max Pooling**, hingga grafik batang probabilitas tebakan akhir. |
| **Fase 5** | **Optimasi Performa, Responsivitas & Deploy Vercel** | Penyesuaian tampilan layar sentuh/mobile, penambahan *preset* skenario belajar cepat, pemeriksaan *build* statis Next.js, dan konfigurasi *deployment* Vercel. |

## 3. Master Prompt All-in-One (Untuk v0.dev, Bolt.new, Lovable, atau Kickoff Project)

Salin dan tempelkan *prompt* di bawah ini sebagai instruksi pembuka kepada AI Agent untuk membangun kerangka utuh aplikasi:

```markdown
Role & Objective:
Kamu adalah Senior Frontend Architect, Creative Technologist, dan AI Educator. Tugasmu adalah membangun aplikasi web interaktif edukatif bernama "NeuralLens: Visualisasi Cara Kerja Machine Learning & CNN untuk Pemula" menggunakan Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, dan Lucide React. Aplikasi ini harus berjalan 100% di sisi client (client-side simulation) tanpa backend eksternal agar siap di-deploy langsung ke Vercel.

Target Audience & Pedagogical Approach:
Target pengguna adalah orang awam dan pemula yang ingin memahami bagaimana Machine Learning dan Deep Learning (khususnya Convolutional Neural Network / CNN) bekerja dari dasar matematika hingga visualisasi node tanpa merasa terintimidasi oleh rumus.
Gunakan Bahasa Indonesia yang ramah, jelas, dan intuitif.

Core Adaptive Feature (WAJIB ADA DI HEADER):
Buat Global Toggle Switch di bagian atas layar dengan 2 mode penjelasan yang mengubah teks pendamping di seluruh modul secara instan:
1. "Mode Intuisi (Analogi Awam)": Menjelaskan konsep dengan metafora sehari-hari (misal: Weight = seberapa penting sebuah petunjuk, Bias = kecenderungan awal, Gradient Descent = menuruni bukit saat kabut tebal, CNN Kernel = kaca pembesar detektif pencari pola garis).
2. "Mode Matematika (Rumus Interaktif)": Menampilkan rumus matematika yang bersih beserta angka real-time dari simulasi. Saat pengguna mengarahkan kursor (hover) ke variabel rumus (seperti w, b, x, atau fungsi aktivasi), bagian node atau garis koneksi yang bersangkutan pada visualisasi harus ikut menyala (highlight).

Design System & Visual Identity:
- Theme: Deep Space Dark Mode (bg-slate-950, card bg-slate-900/80 dengan backdrop-blur-md dan border-slate-800).
- Semantic Colors (Konsisten di seluruh aplikasi):
  * Input / Data Awal: Emerald (#10B981)
  * Bobot Positif (Positive Weight): Cyan (#06B6D4)
  * Bobot Negatif (Negative Weight): Rose/Coral (#F43F5E)
  * Bias & Sinyal Aktivasi: Amber/Gold (#F59E0B)
- Visual Cue: Ketebalan garis antar-node (stroke-width) merepresentasikan besar nilai absolut bobot |w|, dan warna garis merepresentasikan tanda positif/negatif.

Application Structure (4 Interactive Modules via Tabs + Scrollytelling):

MODUL 1: Bagaimana Mesin Belajar dari Kesalahan (Loss & Gradient Descent)
- Visualisasi kurva lembah 2D interaktif (Loss Landscape).
- Pengguna dapat menggeser posisi awal bola dan mengatur slider "Ukuran Langkah (Learning Rate)".
- Tombol "Ambil 1 Langkah" dan "Mulai Turun Otomatis".
- Tunjukkan secara visual apa yang terjadi jika Learning Rate terlalu kecil (lambat sampai ke dasar lembah) vs terlalu besar (bola memantul melewati dasar lembah / overshooting).

MODUL 2: Mengenal Satu Sel Otak Buatan (Single Neuron / Perceptron)
- Studi kasus sederhana yang dekat dengan kehidupan: "Memprediksi Apakah Hari Ini Akan Hujan atau Cerah" berdasarkan 2 input slider: Kelembaban Udara (x1) dan Ketebalan Awan (x2).
- Visualisasi 1 Node besar di tengah dengan 2 node input di kiri dan 1 output di kanan.
- Pengguna bisa mengubah slider Bobot (w1, w2), Bias (b), dan memilih Fungsi Aktivasi (Step, Sigmoid, ReLU).
- Tampilkan perhitungan langsung di dalam node: (x1 * w1) + (x2 * w2) + b -> masuk ke grafik kecil fungsi aktivasi -> menghasilkan output akhir.
- Di sampingnya, tampilkan grafik 2D Decision Boundary di mana garis pemisah bergerak real-time saat slider w1, w2, dan b digeser.

MODUL 3: Jaringan Saraf Tiruan (Multi-Layer Perceptron & Backpropagation)
- Visualisasi jaringan interaktif dengan struktur 3 Input -> 4 Hidden Nodes -> 2 Output Nodes menggunakan SVG interaktif.
- Sediakan kontrol simulasi: tombol "Kirim Sinyal (Forward Pass)", "Koreksi Kesalahan (Backpropagation)", "Auto-Train", dan pengatur kecepatan animasi.
- Saat Forward Pass berjalan, animasikan partikel cahaya kuning mengalir dari kiri ke kanan melewati garis koneksi, lalu tingkat kecerahan tiap node berubah sesuai nilai aktivasinya.
- Saat Backpropagation berjalan, animasikan gelombang warna magenta/cyan mengalir dari kanan ke kiri (dari Output ke Input) yang secara visual menebalkan atau menipiskan garis koneksi untuk menunjukkan bagaimana jaringan memperbaiki bobotnya.

MODUL 4: Bagaimana Komputer Melihat Gambar (Bedah Arsitektur CNN)
- Alur visual 4 kolom dari kiri ke kanan yang saling terhubung:
  1. Kanvas Gambar (8x8 piksel agar angka di tiap kotak terlihat jelas oleh pemula): Pengguna bisa menggambar pola sendiri dengan mouse/sentuhan atau memilih preset bentuk ("Garis Vertikal", "Garis Horizontal", "Bentuk Silang X", "Kotak"). Setiap kotak menampilkan kecerahan piksel (0.0 sampai 1.0) sekaligus warna abu-abu/putihnya.
  2. Tahap Konvolusi (Sliding Filter 3x3): Sediakan pilihan filter ("Pendeteksi Garis Tegak", "Pendeteksi Garis Mendatar", "Pendeteksi Sudut"). Buat animasi kotak kaca pembesar 3x3 yang bergeser petak demi petak (stride = 1) di atas kanvas. Tampilkan panel pop-up kecil yang memperlihatkan perkalian angka 3x3 piksel dengan 3x3 filter secara langsung.
  3. Feature Map & Max Pooling: Tampilkan hasil peta fitur (Feature Map 6x6) yang terbentuk seiring pergeseran filter, lalu tunjukkan bagaimana Max Pooling (2x2) meringkasnya menjadi matriks 3x3 dengan menyorot angka terbesar di setiap blok 2x2.
  4. Fully Connected & Hasil Tebakan: Tampilkan animasi nilai matriks yang diratakan (Flattening) masuk ke node output dan menghasilkan Bar Chart persentase tebakan pola secara real-time.

Code Quality Requirements:
- Buat seluruh kode modular, bersih, bebas placeholder kosong ("TODO"), dan pastikan semua rumus matematika benar secara numerik.
- Sertakan tooltip penjelasan singkat pada setiap istilah teknis.
- Pastikan kompatibel penuh untuk `next build` tanpa error TypeScript.
```

## 4. Rangkaian Sub-Prompt Bertahap (Untuk Cursor, Windsurf, atau Claude Code)

Jika menggunakan editor berbasis AI seperti **Cursor** atau **Claude Code**, jalankan pembangunan secara bertahap menggunakan 5 *prompt* berurutan di bawah ini agar kualitas interaksi setiap modul maksimal:

### Prompt Tahap 1: Setup Project, State Global & Kerangka Desain
```markdown
Inisialisasi proyek Next.js (App Router, TypeScript, Tailwind CSS) dengan paket `framer-motion`, `lucide-react`, dan `clsx`. 
Buat struktur dasar aplikasi "NeuralLens":
1. Buat state global atau React Context (`LearningModeContext`) yang menyimpan:
   - `mode`: 'intuition' | 'math' (untuk toggle Mode Analogi Awam vs Mode Matematika)
   - `activeModule`: 1 | 2 | 3 | 4
   - `simulationSpeed`: 0.5 | 1 | 2
2. Buat Header navigasi sticky bergaya Dark Glassmorphism yang memiliki:
   - Logo & judul aplikasi
   - Stepper navigasi 4 Modul ("1. Cara Mesin Belajar", "2. Satu Sel Neuron", "3. Jaringan Saraf", "4. Mata Komputer / CNN")
   - Toggle Switch mencolok untuk berganti antara "Mode Intuisi (Analogi)" dan "Mode Matematika (Rumus)"
3. Buat komponen reusable `InteractiveEquation` dan `ConceptCard` yang otomatis mengubah isi penjelasannya berdasarkan mode yang dipilih, serta mendukung fitur hover-highlight antara simbol rumus dan elemen visual.
```

### Prompt Tahap 2: Membangun Modul 1 (Gradient Descent) & Modul 2 (Single Neuron)
```markdown
Sekarang bangun komponen lengkap untuk Modul 1 dan Modul 2:

1. `GradientDescentModule.tsx`:
   - Render grafik SVG interaktif kurva fungsi Loss $L(w) = (w - 3)^2 + 1$.
   - Tambahkan bola neon yang posisinya merepresentasikan nilai bobot $w$ saat ini, serta garis singgung (tangent line) yang menunjukkan arah kemiringan (gradien).
   - Sediakan kontrol slider "Posisi Awal" dan "Learning Rate ($\alpha$)" dari 0.05 hingga 1.05, tombol "Langkah Berikutnya (Step)", "Jalan Otomatis (Play/Pause)", dan "Reset".
   - Berikan indikator status dinamis: "Turun Stabil", "Terlalu Lambat", atau "Overshooting (Melompat Terlalu Jauh!)".

2. `SingleNeuronModule.tsx`:
   - Buat visualisasi SVG interaktif 1 Perceptron dengan 2 input ($x_1$: Kelembaban, $x_2$: Ketebalan Awan), 2 garis bobot ($w_1, w_2$), node penjumlahan + bias ($b$), fungsi aktivasi (pilihan: Sigmoid, ReLU, Step), dan node Output probabilitas.
   - Sediakan slider untuk mengubah $x_1, x_2, w_1, w_2, b$ secara real-time.
   - Di sebelah kanan, tampilkan plot 2D scatter dengan titik data "Cerah" (biru) dan "Hujan" (emerald) beserta garis Decision Boundary yang bergeser langsung mengikuti perubahan bobot dan bias.
```

### Prompt Tahap 3: Membangun Modul 3 (Jaringan Multi-Layer & Animasi Backpropagation)
```markdown
Bangun komponen `NeuralNetworkModule.tsx` untuk memvisualisasikan Multi-Layer Perceptron (3 Input -> 4 Hidden -> 2 Output) secara hidup:
1. Gunakan SVG untuk menggambar seluruh node dan garis koneksi (edges).
   - Warna garis: Cyan (#06B6D4) jika bobot positif, Rose (#F43F5E) jika bobot negatif.
   - Ketebalan garis: proporsional terhadap nilai absolut bobot.
   - Saat pengguna klik atau hover pada sebuah node, sorot semua jalur masuk dan keluar dari node tersebut dan tampilkan kartu detail perhitungannya.
2. Buat simulasi siklus belajar 3 fase yang bisa dijalankan langkah demi langkah atau otomatis:
   - Fase 1 (Forward Pass): Animasikan partikel cahaya mengalir dari layer Input ke Hidden lalu ke Output, dan perbarui angka aktivasi di dalam setiap lingkaran node.
   - Fase 2 (Hitung Error): Tampilkan perbandingan antara "Tebakan Jaringan" dan "Target Sebenarnya" dengan bar error yang jelas.
   - Fase 3 (Backpropagation): Animasikan pulsa cahaya mengalir mundur dari Output ke Input, diikuti perubahan ketebalan garis bobot dan penurunan grafik Loss secara real-time.
```

### Prompt Tahap 4: Membangun Modul 4 (Simulator Interaktif CNN & Konvolusi)
```markdown
Bangun komponen `CNNVisualizerModule.tsx` yang membedah cara kerja Convolutional Neural Network secara visual dan mudah dipahami pemula:
1. Panel 1 - Kanvas Input (Grid 8x8):
   - Pengguna bisa menggambar langsung di atas grid 8x8 atau memilih tombol preset ("Garis Tegak", "Garis Tidur", "Diagonal", "Silang").
   - Setiap sel menampilkan warna intensitas piksel dan angka nilainya (0 atau 1).
2. Panel 2 - Filter / Kernel (Grid 3x3) & Kontrol Animasi Konvolusi:
   - Sediakan pilihan filter siap pakai ("Detektor Garis Vertikal", "Detektor Garis Horizontal", "Detektor Tepi/Edge") dan izinkan pengguna mengedit angka di dalam matriks filter 3x3.
   - Buat kontrol "Geser 1 Langkah (Step)", "Play/Pause Scan", dan slider langkah konvolusi (posisi 1 sampai 36).
   - Tampilkan kotak sorotan (bounding box) berukuran 3x3 di atas Kanvas Input yang terhubung dengan garis putus-putus menuju sel tujuan di Feature Map (Grid 6x6).
   - Di bawahnya, tampilkan kotak "Bedah Hitungan Saat Ini" yang memperlihatkan perkalian elemen-demi-elemen antara 9 piksel yang sedang disorot dengan 9 angka filter beserta hasil penjumlahannya (dot product) + ReLU.
3. Panel 3 - Max Pooling (Grid 3x3) & Prediksi Akhir:
   - Tunjukkan bagaimana Feature Map 6x6 dibagi menjadi 9 blok berwarna berukuran 2x2, dan sorot angka tertinggi dari setiap blok yang masuk ke matriks Max Pooling 3x3.
   - Hubungkan hasil Max Pooling ke Bar Chart probabilitas klasifikasi bentuk di bagian paling kanan.
```

### Prompt Tahap 5: Audit Pengalaman Pemula & Persiapan Deploy Vercel
```markdown
Lakukan pengecekan akhir dan penyempurnaan sebelum aplikasi di-deploy ke Vercel:
1. Tambahkan fitur "Tur Panduan Pemula (Guided Tour / Quick Presets)" di setiap modul berupa 3 tombol skenario cepat (contoh di Modul CNN: "Coba Lihat Bagaimana Filter Vertikal Mengenali Garis Tegak") yang otomatis mengatur parameter dan menjalankan animasi.
2. Pastikan seluruh komponen memiliki layout responsif (stacking rapi di layar tablet/mobile dan horizontal di desktop).
3. Pastikan tidak ada error pada TypeScript maupun ESLint, serta uji perintah `npm run build` agar berjalan mulus tanpa error SSR (`use client` pada komponen yang memakai Canvas/window).
```

## 5. Panduan Singkat Publikasi ke Vercel

Setelah kode selesai dibuat oleh AI Agent, ikuti 3 langkah berikut untuk mempublikasikannya ke akun Vercel Anda:

1. **Unggah ke GitHub**: Simpan proyek ke repositori GitHub Anda melalui terminal (`git init`, `git add .`, `git commit -m "feat: initial ml cnn visualizer"`, lalu `git push`).
2. **Hubungkan ke Vercel**: Buka *dashboard* Vercel, klik **Add New... -> Project**, lalu pilih repositori GitHub tersebut.
3. **Konfigurasi Otomatis & Deploy**: Vercel akan otomatis mendeteksi *framework* **Next.js**. Anda tidak perlu mengubah pengaturan *Build Command* atau menambahkan *Environment Variables* apa pun karena seluruh simulasi berjalan di sisi klien—langsung klik **Deploy** dan website siap diakses publik dalam waktu sekitar 1 menit.
