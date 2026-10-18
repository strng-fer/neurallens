# NeuralLens — Design System & UI/UX Specification

> Dokumen desain untuk aplikasi edukasi interaktif yang membantu pemula memahami Machine Learning hingga Deep Learning (CNN) melalui visualisasi, simulasi, dan penjelasan adaptif.
>
> **Produk:** NeuralLens  
> **Platform:** Web responsif  
> **Bahasa utama:** Bahasa Indonesia  
> **Target deployment:** Vercel  
> **Pendekatan komputasi:** Simulasi dan visualisasi berjalan di sisi client

---

## 1. Product Vision

NeuralLens membuat konsep Machine Learning lebih mudah dipahami dengan mengubah rumus dan proses internal model menjadi eksperimen visual yang bisa dimainkan pengguna.

### Tujuan desain

1. Membuat konsep teknis terasa ramah bagi pemula tanpa menghilangkan ketepatan matematis.
2. Menghubungkan setiap rumus dengan node, garis koneksi, grafik, atau matriks yang relevan.
3. Memberi pengguna kendali untuk mengubah parameter, menjalankan simulasi, mengamati hasil, dan mengulang eksperimen.
4. Menjaga antarmuka fokus pada proses belajar, bukan dekorasi yang mengganggu.
5. Menyediakan pengalaman yang responsif di desktop, tablet, dan ponsel.

### Target pengguna

- Pemula yang baru mengenal Machine Learning.
- Mahasiswa yang ingin memahami konsep ML dan CNN secara visual.
- Pengguna yang sudah mengenal dasar matematika dan ingin melihat hubungan rumus dengan proses komputasi.

### Prinsip pengalaman

- **Explore first:** pengguna dapat mencoba kontrol tanpa harus membaca teori panjang.
- **Explain in context:** penjelasan muncul dekat dengan visual atau parameter yang sedang digunakan.
- **Make cause and effect visible:** perubahan parameter harus terlihat dampaknya.
- **Progressive disclosure:** tampilkan konsep inti terlebih dahulu, lalu rincian matematis saat diperlukan.
- **Accurate simulation:** label, rumus, angka, dan visual harus konsisten secara numerik.

---

## 2. Information Architecture

Aplikasi memiliki header global dan empat modul pembelajaran utama.

```text
NeuralLens
├── Header
│   ├── Logo + nama aplikasi
│   ├── Navigasi 4 modul
│   └── Toggle Mode Intuisi / Mode Matematika
├── Area pembelajaran aktif
│   ├── Judul dan tujuan modul
│   ├── Penjelasan konsep
│   ├── Area simulasi interaktif
│   ├── Panel kontrol
│   └── Hasil, insight, dan istilah
└── Kontrol simulasi
    ├── Play / Pause
    ├── Step
    ├── Reset
    └── Kecepatan simulasi
```

### Navigasi modul

1. **Cara Mesin Belajar** — Loss dan Gradient Descent.
2. **Satu Sel Neuron** — Single Neuron / Perceptron.
3. **Jaringan Saraf** — MLP dan Backpropagation.
4. **Mata Komputer** — Konvolusi dan CNN.

Navigasi menunjukkan modul aktif dan urutan belajar. Pengguna dapat berpindah modul secara langsung tanpa kehilangan konteks mode penjelasan global.

---

## 3. Design Direction

### Visual identity

**Arah visual:** Deep Space / Cyber-Educational Dark Mode.

Tampilan harus terasa modern dan teknis, tetapi tetap mudah dibaca. Efek neon digunakan untuk menunjukkan data, aktivasi, dan arah aliran sinyal, bukan sebagai dekorasi berlebihan.

### Design tokens

| Token | Nilai | Penggunaan |
|---|---|---|
| `background` | `#020617` (slate-950) | Latar utama |
| `surface` | `rgba(15, 23, 42, 0.8)` | Panel dan kartu |
| `surface-elevated` | `#0F172A` | Panel yang lebih menonjol |
| `border` | `#1E293B` | Garis tepi dan pemisah |
| `text-primary` | `#F8FAFC` | Judul dan informasi utama |
| `text-secondary` | `#CBD5E1` | Isi teks |
| `text-muted` | `#94A3B8` | Label sekunder |
| `input-data` | `#10B981` | Input dan data awal |
| `weight-positive` | `#06B6D4` | Bobot positif |
| `weight-negative` | `#F43F5E` | Bobot negatif |
| `bias-activation` | `#F59E0B` | Bias dan sinyal aktivasi |
| `focus` | `#67E8F9` | Fokus keyboard dan elemen aktif |

### Bentuk dan efek

- Gunakan kartu dengan radius sedang, border tipis, dan kontras yang jelas.
- Gunakan `backdrop-blur` secara terbatas pada header atau panel overlay.
- Glow hanya diterapkan pada node aktif, sinyal berjalan, fokus, atau hasil penting.
- Garis koneksi menggunakan warna untuk tanda bobot dan ketebalan untuk magnitudo absolut bobot.
- Hindari gradient yang terlalu ramai, animasi dekoratif terus-menerus, serta teks berukuran kecil.

### Tipografi

- Gunakan sans-serif yang bersih untuk UI dan teks penjelasan.
- Gunakan font monospace hanya untuk angka teknis, nilai parameter, atau ekspresi kode.
- Judul modul harus jelas dan singkat.
- Rumus menggunakan KaTeX dengan jarak dan ukuran yang nyaman dibaca.

### Spacing

Gunakan skala konsisten berbasis kelipatan 4 px. Berikan jarak yang cukup antara kontrol, label, grafik, dan penjelasan. Jangan memadatkan semua parameter dalam satu panel panjang.

---

## 4. Global Layout

### Desktop

- Header sticky di bagian atas.
- Navigasi modul dan toggle mode terlihat tanpa mendominasi layar.
- Area modul menggunakan grid dua kolom jika sesuai:
  - **Area utama:** visualisasi interaktif.
  - **Panel pendamping:** kontrol, rumus, hasil, dan penjelasan.
- Modul CNN menggunakan alur visual horizontal karena memiliki beberapa tahap pemrosesan.

### Tablet

- Header dapat membungkus navigasi ke baris berikutnya.
- Panel dua kolom berubah menjadi kolom yang lebih sempit atau ditumpuk.
- Kontrol tetap memiliki target sentuh yang nyaman.

### Mobile

- Navigasi modul dapat digeser horizontal atau ditampilkan sebagai pemilih modul yang ringkas.
- Semua panel ditumpuk vertikal.
- Grafik dan matriks harus tetap terbaca tanpa mengandalkan hover.
- Kontrol utama memiliki lebar yang memadai dan tidak saling berhimpitan.
- SVG dan kanvas menyesuaikan lebar layar tanpa memotong informasi penting.

### Struktur halaman modul

Setiap modul sebaiknya memiliki urutan berikut:

1. Breadcrumb atau nomor modul dan judul.
2. Tujuan belajar singkat.
3. Toggle penjelasan tetap dapat diakses melalui header.
4. Visualisasi utama.
5. Kontrol eksperimen.
6. Hasil dan interpretasi.
7. Ringkasan konsep serta istilah teknis.

---

## 5. Global Interaction Design

### Mode penjelasan

Sediakan toggle global dengan dua pilihan:

**Mode Intuisi (Analogi Awam)**
- Menggunakan bahasa sehari-hari.
- Menjelaskan konsep melalui analogi yang relevan.
- Contoh: weight adalah tingkat kepentingan petunjuk; bias adalah kecenderungan awal; kernel adalah kaca pembesar pencari pola.

**Mode Matematika (Rumus Interaktif)**
- Menampilkan rumus yang relevan beserta nilai aktual dari simulasi.
- Simbol seperti `x`, `w`, `b`, dan fungsi aktivasi dapat di-hover atau difokuskan dengan keyboard.
- Elemen visual yang berkaitan dengan simbol harus ikut di-highlight.
- Pada layar sentuh, interaksi hover digantikan dengan tap atau pemilihan simbol.

Perubahan mode hanya mengubah cara konsep dijelaskan, bukan nilai atau hasil simulasi.

### Kontrol simulasi

Gunakan pola kontrol yang konsisten:

- **Play/Pause:** memulai atau menghentikan simulasi otomatis.
- **Step:** menjalankan satu langkah.
- **Reset:** mengembalikan parameter ke kondisi awal modul.
- **Speed:** pilihan kecepatan `0.5×`, `1×`, dan `2×` jika animasi mendukungnya.

Tampilkan status simulasi secara eksplisit, misalnya `Siap`, `Berjalan`, `Dijeda`, atau `Selesai`. Jangan hanya mengandalkan warna untuk menyampaikan status.

### Feedback interaksi

- Perubahan slider memperbarui visualisasi dan angka terkait secara langsung.
- Kontrol yang sedang aktif memiliki state visual yang jelas.
- Tooltip menjelaskan istilah teknis tanpa menutupi visual utama.
- Reset harus mengembalikan parameter, hasil, dan posisi animasi ke kondisi awal yang konsisten.

---

## 6. Module Design Specifications

## Modul 1 — Cara Mesin Belajar (Loss & Gradient Descent)

### Tujuan belajar

Memahami bahwa model memperbaiki parameter dengan bergerak ke arah yang menurunkan nilai loss, serta memahami dampak learning rate.

### Komposisi UI

- Judul: **Bagaimana Mesin Belajar dari Kesalahan?**
- Grafik utama berupa kurva loss berbentuk lembah.
- Bola atau penanda neon menunjukkan posisi bobot saat ini.
- Garis singgung menunjukkan arah dan besar gradien.
- Panel kontrol untuk posisi awal dan learning rate.
- Indikator status dan ringkasan langkah terkini.

### Kontrol

- Slider `Posisi Awal (w)`.
- Slider `Learning Rate (α)` dengan rentang `0.05–1.05`.
- Tombol `Langkah Berikutnya`.
- Tombol `Mulai Otomatis` / `Pause`.
- Tombol `Reset`.

### Perilaku visual

- Fungsi yang ditampilkan: `L(w) = (w − 3)² + 1`.
- Tampilkan posisi `w`, nilai `L(w)`, dan gradien terkini.
- Gunakan status yang sesuai dengan perilaku numerik: `Turun Stabil`, `Terlalu Lambat`, atau `Overshooting`.
- Learning rate kecil harus memperlihatkan langkah yang kecil; learning rate terlalu besar dapat melewati titik minimum.
- Status harus ditentukan dari hasil simulasi, bukan sekadar nilai slider.

### Mode matematika

Tampilkan fungsi loss dan aturan pembaruan parameter. Nilai rumus harus berubah mengikuti posisi dan learning rate.

---

## Modul 2 — Satu Sel Neuron (Single Neuron / Perceptron)

### Tujuan belajar

Memahami hubungan input, bobot, bias, penjumlahan berbobot, fungsi aktivasi, dan output.

### Studi kasus

Prediksi sederhana `Cerah` atau `Hujan` berdasarkan kelembapan udara dan ketebalan awan. Jelaskan bahwa ini adalah simulasi edukasi, bukan sistem prakiraan cuaca nyata.

### Komposisi UI

- Dua node input di sebelah kiri.
- Satu node neuron di tengah.
- Satu node output di sebelah kanan.
- Garis bobot yang menghubungkan input ke neuron.
- Panel kontrol parameter.
- Grafik kecil fungsi aktivasi.
- Plot 2D decision boundary.

### Kontrol

- Slider `Kelembapan (x₁)` dan `Ketebalan Awan (x₂)`.
- Slider bobot `w₁` dan `w₂`.
- Slider bias `b`.
- Pilihan fungsi aktivasi: `Step`, `Sigmoid`, atau `ReLU`.

### Perilaku visual

- Tampilkan perhitungan `z = x₁w₁ + x₂w₂ + b`.
- Tampilkan nilai `z` sebelum aktivasi dan nilai output setelah aktivasi.
- Perubahan parameter memperbarui node, garis bobot, nilai output, dan decision boundary secara konsisten.
- Gunakan warna dan ketebalan garis sesuai tanda dan magnitudo bobot.
- Plot menampilkan legenda yang jelas untuk kelas `Cerah` dan `Hujan`.

### Catatan matematis

Decision boundary harus berasal dari persamaan dan parameter yang sama dengan neuron. Untuk aktivasi ReLU atau Sigmoid, jelaskan bahwa batas keputusan memerlukan aturan threshold yang eksplisit jika ingin divisualisasikan sebagai klasifikasi biner.

---

## Modul 3 — Jaringan Saraf (MLP & Backpropagation)

### Tujuan belajar

Memahami bagaimana sinyal bergerak maju, bagaimana error dihitung, dan bagaimana bobot diperbarui selama proses belajar.

### Komposisi UI

- Jaringan SVG dengan struktur `3 Input → 4 Hidden Nodes → 2 Output`.
- Node berbentuk lingkaran dan garis koneksi.
- Panel detail node yang dipilih.
- Panel perbandingan prediksi dan target.
- Indikator atau grafik loss selama training.

### Kontrol

- `Kirim Sinyal (Forward Pass)`.
- `Hitung Error`.
- `Koreksi Kesalahan (Backpropagation)`.
- `Auto-Train`.
- `Pause` dan `Reset`.
- Pengatur kecepatan animasi.

### Perilaku visual

- Forward pass: partikel cahaya bergerak dari input menuju output.
- Intensitas node mencerminkan nilai aktivasi.
- Fase error menampilkan prediksi, target, dan nilai error.
- Backpropagation: pulsa bergerak dari output ke arah layer sebelumnya.
- Perubahan bobot ditunjukkan melalui warna dan ketebalan koneksi.
- Loss harus dihitung dari data dan parameter simulasi; jangan menurunkan grafik secara artifisial hanya untuk membuat animasi terlihat berhasil.

### Interaksi node

Saat node diklik atau difokuskan:
- Sorot koneksi masuk dan keluar.
- Tampilkan nama layer dan nilai aktivasi.
- Tampilkan rumus atau ringkasan perhitungan node.
- Sediakan cara untuk menghapus highlight dan kembali ke tampilan jaringan penuh.

---

## Modul 4 — Mata Komputer (CNN Visualizer)

### Tujuan belajar

Memahami bagaimana kernel mengekstrak pola lokal dari gambar, bagaimana feature map terbentuk, dan bagaimana max pooling meringkas fitur.

### Alur visual

Tampilkan empat tahap yang terhubung:

1. **Input Image**
2. **Convolution / Feature Map**
3. **Max Pooling**
4. **Flattening dan Prediksi Pola**

Di desktop, tampilkan tahap secara horizontal. Di mobile, susun secara vertikal dengan indikator progres yang jelas.

### Panel 1 — Kanvas Input 8×8

- Grid `8×8` untuk menggambar menggunakan mouse atau sentuhan.
- Setiap sel menunjukkan intensitas piksel `0.0–1.0`.
- Pilihan preset: `Garis Vertikal`, `Garis Horizontal`, `Diagonal`, `Silang`, dan `Kotak`.
- Tombol untuk membersihkan kanvas.
- Gunakan state sentuh dan mouse yang konsisten.

### Panel 2 — Kernel 3×3 dan Konvolusi

- Pilihan filter: `Pendeteksi Garis Vertikal`, `Pendeteksi Garis Horizontal`, dan `Pendeteksi Tepi`.
- Izinkan nilai kernel diedit langsung.
- Kotak 3×3 bergerak di atas gambar dengan `stride = 1`.
- Tampilkan posisi scan saat ini.
- Panel `Bedah Hitungan Saat Ini` menunjukkan perkalian elemen demi elemen, jumlah dot product, dan hasil aktivasi ReLU.
- Hubungkan area input yang disorot dengan sel output yang sedang dihitung.

Untuk input `8×8`, kernel `3×3`, tanpa padding, dan stride `1`, ukuran feature map adalah `6×6`.

### Panel 3 — Feature Map dan Max Pooling

- Tampilkan feature map `6×6`.
- Sorot blok `2×2` yang sedang diproses.
- Tampilkan nilai maksimum dari setiap blok.
- Hasil max pooling menjadi matriks `3×3` jika menggunakan pooling `2×2` dengan stride `2`.
- Pastikan nilai hasil berasal dari feature map yang dihitung, bukan angka dekoratif.

### Panel 4 — Flattening dan Prediksi

- Visualisasikan matriks hasil pooling yang diratakan menjadi vektor.
- Tampilkan grafik batang probabilitas prediksi pola.
- Labeli hasil sebagai **simulasi klasifikasi edukatif** jika tidak menggunakan model CNN terlatih.
- Jangan menyatakan prediksi sebagai keluaran model terlatih apabila hasilnya berasal dari aturan heuristik atau simulasi sederhana.

### Kontrol

- Preset pola.
- Pilihan kernel.
- `Geser 1 Langkah`.
- `Play/Pause Scan`.
- Slider posisi konvolusi `1–36`.
- `Reset`.

---

## 7. Reusable Components

| Komponen | Tanggung jawab |
|---|---|
| `AppHeader` | Logo, navigasi modul, dan toggle mode |
| `ModuleStepper` | Menunjukkan urutan serta modul aktif |
| `LearningModeToggle` | Mengubah mode penjelasan global |
| `ModuleIntro` | Judul, tujuan belajar, dan pengantar modul |
| `ConceptCard` | Penjelasan konsep sesuai mode |
| `InteractiveEquation` | Rumus, nilai aktual, dan hubungan highlight ke visual |
| `SimulationControls` | Play/Pause, Step, Reset, dan kecepatan |
| `ParameterSlider` | Label, nilai, rentang, dan kontrol parameter |
| `StatusIndicator` | Status simulasi dalam teks dan visual |
| `TooltipTerm` | Definisi istilah teknis |
| `ResultPanel` | Nilai akhir, interpretasi, dan ringkasan |
| `PresetSelector` | Skenario eksperimen cepat |
| `AccessibleChartDescription` | Ringkasan tekstual untuk grafik dan visualisasi |

Setiap komponen harus memiliki tanggung jawab yang jelas. Hindari satu komponen besar yang mengelola seluruh state, logika matematika, dan tampilan sekaligus.

---

## 8. Interaction States

Setiap modul perlu mendefinisikan state berikut:

- **Idle:** parameter siap diubah, simulasi belum berjalan.
- **Running:** animasi berjalan.
- **Paused:** simulasi berhenti sementara dan dapat dilanjutkan.
- **Step complete:** satu langkah selesai dan hasil terbaru terlihat.
- **Completed:** skenario atau rangkaian simulasi selesai.
- **Reset:** seluruh parameter dan animasi kembali ke nilai awal.

### Aturan interaksi

1. Hindari dua animasi berjalan bersamaan pada modul yang sama.
2. Tombol Play berubah menjadi Pause saat simulasi berjalan.
3. Reset menghentikan animasi sebelum mengembalikan state.
4. Perubahan parameter selama animasi harus ditangani secara konsisten, misalnya menghentikan animasi sementara atau menerapkan nilai baru pada langkah berikutnya.
5. Angka, rumus, grafik, dan visualisasi harus menggunakan sumber state yang sama.
6. Semua kontrol harus dapat digunakan melalui keyboard dan perangkat sentuh.

---

## 9. Motion & Animation

Animasi harus membantu pengguna mengikuti proses komputasi.

- Gunakan gerakan singkat dan terarah untuk sinyal.
- Gunakan easing yang halus, tanpa gerakan memantul yang tidak diperlukan.
- Hindari animasi latar yang terus berjalan ketika tidak ada aktivitas belajar.
- Kecepatan simulasi memengaruhi durasi animasi, bukan hasil perhitungan.
- Hormati preferensi sistem `prefers-reduced-motion`.
- Jika animasi dinonaktifkan, tampilkan state awal dan akhir secara jelas.

Framer Motion digunakan untuk transisi UI dan animasi elemen. SVG digunakan untuk node dan koneksi. Canvas digunakan untuk input gambar atau interaksi grid yang sesuai.

---

## 10. Accessibility & Usability

- Pastikan kontras teks dan kontrol memadai.
- Jangan membedakan bobot positif dan negatif hanya dengan warna; gunakan tanda, label, atau legenda.
- Setiap slider memiliki label, nilai terkini, nilai minimum, dan maksimum.
- Tombol memiliki nama aksi yang jelas.
- Berikan focus ring yang terlihat untuk navigasi keyboard.
- Jangan mewajibkan hover untuk memperoleh informasi penting.
- Sertakan ringkasan teks untuk grafik, jaringan node, dan matriks.
- Pastikan target sentuh nyaman digunakan di layar kecil.
- Hindari efek berkedip cepat.
- Tampilkan satuan atau rentang nilai bila relevan.

---

## 11. Technical Design Constraints

### Stack yang ditetapkan

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Custom SVG
- HTML Canvas API
- KaTeX melalui `react-katex`
- Zustand untuk state global

### Prinsip arsitektur

- Simulasi inti berjalan di client; backend eksternal tidak diperlukan untuk fitur yang ditetapkan.
- Gunakan komponen client untuk fitur yang bergantung pada Canvas, event pointer, atau animasi browser.
- Pisahkan fungsi matematika murni dari komponen UI.
- Gunakan satu sumber state untuk parameter dan hasil terkait.
- Jangan menghitung hasil simulasi hanya di dalam animasi visual.
- Gunakan nilai awal yang deterministik agar hasil mudah direproduksi.
- Hindari menempatkan seluruh aplikasi di satu file.
- Jangan menyimpan informasi sensitif; aplikasi edukasi ini tidak membutuhkan akun pengguna.

### Struktur folder yang disarankan

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  layout/
    app-header.tsx
    module-stepper.tsx
    learning-mode-toggle.tsx
  shared/
    concept-card.tsx
    interactive-equation.tsx
    simulation-controls.tsx
    parameter-slider.tsx
    status-indicator.tsx
  modules/
    gradient-descent-module.tsx
    single-neuron-module.tsx
    neural-network-module.tsx
    cnn-visualizer-module.tsx
lib/
  math/
    gradient-descent.ts
    neuron.ts
    neural-network.ts
    convolution.ts
  constants.ts
  utils.ts
store/
  learning-mode-store.ts
types/
  simulation.ts
```

Struktur ini merupakan rekomendasi awal; nama dan pembagian file boleh disesuaikan selama pemisahan tanggung jawab tetap terjaga.

---

## 12. Responsive Behavior Checklist

### Desktop

- [ ] Header sticky tidak menutupi konten saat navigasi.
- [ ] Visualisasi utama memiliki ruang yang cukup.
- [ ] Panel kontrol dapat dibaca tanpa scroll horizontal.
- [ ] Tahap CNN terlihat berurutan dan mudah dibandingkan.

### Tablet

- [ ] Navigasi tetap dapat diakses.
- [ ] Panel tidak terlalu sempit.
- [ ] Grafik dan matriks tetap terbaca.
- [ ] Kontrol tidak bertumpuk secara tidak sengaja.

### Mobile

- [ ] Tidak ada horizontal overflow pada halaman.
- [ ] Slider dan tombol mudah disentuh.
- [ ] Grid 8×8 dapat digambar dengan jari.
- [ ] Kontrol animasi tetap terlihat dekat dengan visual.
- [ ] Tooltip dan highlight dapat digunakan tanpa hover.

---

## 13. Definition of Done

Aplikasi dapat dianggap siap dipublikasikan jika:

- [ ] Empat modul tersedia dan dapat dibuka melalui navigasi.
- [ ] Toggle Intuisi/Matematika mengubah penjelasan secara konsisten.
- [ ] Semua kontrol utama berfungsi, termasuk Step, Play/Pause, dan Reset.
- [ ] Nilai matematika sesuai dengan parameter dan visualisasi.
- [ ] Highlight rumus dan visual bekerja dengan hover, fokus keyboard, atau tap.
- [ ] Gradient Descent memperlihatkan efek learning rate yang benar.
- [ ] Perceptron menghitung weighted sum dan aktivasi dengan benar.
- [ ] MLP memiliki alur forward pass, perhitungan error, dan pembaruan bobot yang konsisten.
- [ ] CNN menghitung konvolusi, feature map, dan max pooling dari input aktual.
- [ ] Jika prediksi CNN hanya simulasi, UI menyatakannya dengan jelas.
- [ ] Layout diuji pada desktop, tablet, dan mobile.
- [ ] Aksesibilitas dasar dan preferensi reduced motion ditangani.
- [ ] Tidak ada placeholder kosong atau tombol yang tidak berfungsi.
- [ ] `npm run build` selesai tanpa error TypeScript atau error build.
- [ ] Proyek dapat di-deploy ke Vercel tanpa memerlukan backend eksternal.

---

## 14. Final UX Principle

NeuralLens harus terasa seperti laboratorium mini untuk belajar AI: pengguna mengubah input, mengamati proses, membandingkan hasil, dan memahami alasannya. Prioritas utama adalah **kejelasan konsep, ketepatan perhitungan, dan interaksi yang bermakna**. Efek visual hanya digunakan untuk memperkuat ketiga hal tersebut.
