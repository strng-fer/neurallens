# NeuralLens: Visualisasi Interaktif Machine Learning & CNN untuk Pemula

Platform visualisasi dan simulasi interaktif berbasis web untuk memahami cara kerja konsep Machine Learning hingga Deep Learning (Convolutional Neural Network) bagi pemula.

Aplikasi ini berjalan **100% di sisi klien (*client-side*)** menggunakan Next.js App Router, TypeScript, Tailwind CSS, Lucide React, KaTeX, dan Zustand.

- **Repositori GitHub:** [https://github.com/strng-fer/neurallens](https://github.com/strng-fer/neurallens)
- **Live Demo (GitHub Pages):** [https://strng-fer.github.io/neurallens/](https://strng-fer.github.io/neurallens/)
- **Deploy ke Vercel (1-Click):** [Deploy via Vercel](https://vercel.com/new/import?s=https://github.com/strng-fer/neurallens)

---

## Fitur Utama

### 1. Toggle Mode Adaptif (Header Global)
- **Mode Intuisi (Analogi Awam):** Menjelaskan konsep teknis dengan perumpamaan sehari-hari (pendaki berkabut, resep kopi, orkestra kerja, dan kaca pembesar detektif).
- **Mode Matematika (Rumus Interaktif):** Menampilkan rumus KaTeX bersih dengan fitur hover & focus highlight yang menghubungkan simbol rumus ke elemen visual terkait.

### 2. Modul Pembelajaran Interaktif

- **Modul 01: Cara Mesin Belajar (Loss & Gradient Descent)**
  - Kurva lembah 2D interaktif: $L(w) = (w - 3)^2 + 1$.
  - Pelacakan bola neon, garis singgung gradien, dan riwayat langkah.
  - Eksperimen Learning Rate ($\alpha: 0.05 - 1.05$) untuk mengamati konvergensi stabil vs. fenomena overshooting.

- **Modul 02: Satu Sel Neuron (Single Neuron / Perceptron)**
  - Studi kasus prediksi cuaca: input Kelembaban ($x_1$) dan Ketebalan Awan ($x_2$).
  - Diagram fisik neuron dengan garis bobot ($w_1, w_2$), bias ($b$), dan fungsi aktivasi (Step, Sigmoid, ReLU).
  - Plot 2D *Decision Boundary* dengan pergeseran garis batas pemisah secara langsung.

- **Modul 03: Jaringan Saraf (Multi-Layer Perceptron & Backpropagation)**
  - Arsitektur berlapis SVG (3 Input, 4 Hidden, 2 Output).
  - Animasi partikel sinyal maju (*Forward Pass*) dan gelombang koreksi balik (*Backpropagation*).
  - Pelacakan penurunan galat Loss MSE seiring berjalannya epoch pelatihan.

- **Modul 04: Mata Komputer (Konvolusi & Deteksi Angka 1-5)**
  - Kanvas piksel 8x8 untuk menggambar angka 1 sampai 5 atau memilih preset digit siap pakai.
  - Sliding Filter/Kernel 3x3 (detektor garis tegak, mendatar, dan sudut siku).
  - Feature Map 6x6 dan Max Pooling 2x2 (3x3).
  - Prediksi probabilitas klasifikasi digit 1-5 dengan diagram batang interaktif.

---

## Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18+ atau 20+
- npm, pnpm, atau yarn

### Langkah Instalasi
```bash
# 1. Clone repositori
git clone https://github.com/strng-fer/neurallens.git
cd neurallens

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban pada alamat [http://localhost:3000](http://localhost:3000).

### Membangun Versi Produksi
```bash
npm run build
npm run start
```

---

## Publikasi ke Vercel

Karena aplikasi ini sepenuhnya menggunakan komputasi di sisi klien (*client-side*):
1. Masuk ke [Vercel](https://vercel.com).
2. Pilih **Add New Project** dan hubungkan dengan repositori GitHub ini.
3. Vercel akan otomatis mengenali Next.js (zero-config).
4. Klik **Deploy**. Website akan langsung aktif dalam hitungan detik.

---

## Lisensi
MIT License (c) 2026 NeuralLens Team.
