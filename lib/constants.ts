import { CNNImagePreset, CNNKernelPreset, WeatherDataPoint } from '@/types/simulation';

export const SEMANTIC_COLORS = {
  background: '#020617', // slate-950
  surface: 'rgba(15, 23, 42, 0.8)',
  surfaceElevated: '#0F172A',
  border: '#1E293B',
  borderHighlight: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  inputData: '#10B981', // Emerald
  weightPositive: '#06B6D4', // Cyan
  weightNegative: '#F43F5E', // Rose
  biasActivation: '#F59E0B', // Amber
  focus: '#67E8F9', // Focus cyan
};

export interface ModuleMetadata {
  id: 1 | 2 | 3 | 4;
  number: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
  pedagogicalObjective: string;
}

export const MODULES_METADATA: ModuleMetadata[] = [
  {
    id: 1,
    number: '01',
    shortTitle: 'Cara Mesin Belajar',
    fullTitle: 'Bagaimana Mesin Belajar dari Kesalahan?',
    subtitle: 'Loss dan Gradient Descent',
    pedagogicalObjective: 'Memahami bahwa model memperbaiki parameter dengan bergerak ke arah yang menurunkan nilai loss, serta mengamati dampak variasi learning rate.',
  },
  {
    id: 2,
    number: '02',
    shortTitle: 'Satu Sel Neuron',
    fullTitle: 'Mengenal Satu Sel Otak Buatan',
    subtitle: 'Single Neuron / Perceptron',
    pedagogicalObjective: 'Memahami hubungan input, bobot, bias, penjumlahan terbobot, fungsi aktivasi, dan pergeseran garis keputusan (decision boundary).',
  },
  {
    id: 3,
    number: '03',
    shortTitle: 'Jaringan Saraf',
    fullTitle: 'Jaringan Saraf Tiruan Berlapis',
    subtitle: 'MLP dan Backpropagation',
    pedagogicalObjective: 'Memahami bagaimana sinyal mengalir maju (Forward Pass), bagaimana galat dihitung, dan bagaimana gelombang koreksi (Backpropagation) memperbaiki bobot.',
  },
  {
    id: 4,
    number: '04',
    shortTitle: 'Mata Komputer',
    fullTitle: 'Bagaimana Komputer Melihat dan Mengenali Angka 1-5?',
    subtitle: 'Konvolusi dan Klasifikasi Digit CNN',
    pedagogicalObjective: 'Memahami bagaimana filter konvolusi memindai pola garis tegak, mendatar, dan lengkungan pada gambar angka 1-5, meringkasnya lewat max pooling, dan menghasilkan probabilitas tebakan angka.',
  },
];

// Presets for Module 2: Weather dataset
export const WEATHER_SAMPLE_DATA: WeatherDataPoint[] = [
  { x1: 0.2, x2: 0.2, label: 'cerah' },
  { x1: 0.3, x2: 0.4, label: 'cerah' },
  { x1: 0.15, x2: 0.5, label: 'cerah' },
  { x1: 0.4, x2: 0.25, label: 'cerah' },
  { x1: 0.35, x2: 0.35, label: 'cerah' },
  { x1: 0.7, x2: 0.8, label: 'hujan' },
  { x1: 0.85, x2: 0.75, label: 'hujan' },
  { x1: 0.6, x2: 0.85, label: 'hujan' },
  { x1: 0.75, x2: 0.65, label: 'hujan' },
  { x1: 0.9, x2: 0.9, label: 'hujan' },
  { x1: 0.5, x2: 0.7, label: 'hujan' },
  { x1: 0.45, x2: 0.6, label: 'cerah' },
];

// Presets for Module 4: CNN Digits 1-5 on 8x8 bitmap
export const CNN_IMAGE_PRESETS: Record<CNNImagePreset, { name: string; digit: number; grid: number[][] }> = {
  digit1: {
    name: 'Angka 1',
    digit: 1,
    grid: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  digit2: {
    name: 'Angka 2',
    digit: 2,
    grid: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  digit3: {
    name: 'Angka 3',
    digit: 3,
    grid: [
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  digit4: {
    name: 'Angka 4',
    digit: 4,
    grid: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 1, 1, 0, 0, 0],
      [1, 1, 0, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  digit5: {
    name: 'Angka 5',
    digit: 5,
    grid: [
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
};

// Presets for Module 4: 3x3 Kernels specialized for digit recognition
export const CNN_KERNEL_PRESETS: Record<CNNKernelPreset, { name: string; description: string; matrix: number[][] }> = {
  vertical: {
    name: 'Pendeteksi Garis Tegak (Batang 1 & 4)',
    description: 'Menonjolkan garis vertikal lurus yang menjadi ciri khas angka 1 dan tiang angka 4.',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  horizontal: {
    name: 'Pendeteksi Garis Mendatar (Palang 2, 3, 5)',
    description: 'Menonjolkan garis horizontal mendatar pada atap dan alas angka 2, 3, dan 5.',
    matrix: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1],
    ],
  },
  edge: {
    name: 'Pendeteksi Sudut & Lengkungan (Belokan 2, 3, 4, 5)',
    description: 'Menangkap perubahan arah dan sudut siku pada lekukan angka 2, 3, 4, dan 5.',
    matrix: [
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1],
    ],
  },
};
