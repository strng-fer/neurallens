'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  computeStepDetail,
  computeFeatureMap,
  computeMaxPooling,
  flattenMap,
  predictDigitClass,
} from '@/lib/math/convolution';
import {
  CNN_IMAGE_PRESETS,
  CNN_KERNEL_PRESETS,
} from '@/lib/constants';
import { CNNImagePreset, CNNKernelPreset } from '@/types/simulation';
import { useLearningStore } from '@/store/learning-mode-store';
import { SimulationControls } from '@/components/shared/simulation-controls';
import { ParameterSlider } from '@/components/shared/parameter-slider';
import { ConceptCard } from '@/components/shared/concept-card';
import { InteractiveEquation } from '@/components/shared/interactive-equation';
import { StatusIndicator, StatusVariant } from '@/components/shared/status-indicator';
import { GuidedPresetButtons, GuidedPreset } from '@/components/shared/guided-preset-buttons';
import { cn } from '@/lib/utils';
import { Scan, Grid, Layers, BarChart3, Eraser, Check, Sparkles } from 'lucide-react';

export function CNNVisualizerModule() {
  const { simulationSpeed } = useLearningStore();

  // 1. Input Image 8x8 (Digits 1-5)
  const [image, setImage] = useState<number[][]>(() => CNN_IMAGE_PRESETS.digit1.grid);
  const [activeImagePreset, setActiveImagePreset] = useState<CNNImagePreset | 'custom'>('digit1');

  // 2. Kernel 3x3
  const [activeKernelPreset, setActiveKernelPreset] = useState<CNNKernelPreset>('vertical');
  const [kernel, setKernel] = useState<number[][]>(() => CNN_KERNEL_PRESETS.vertical.matrix);

  // 3. Scan position & status
  const [currentStep, setCurrentStep] = useState<number>(0); // 0..35
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Math derivations
  const stepDetail = computeStepDetail(image, kernel, currentStep);
  const featureMap = computeFeatureMap(image, kernel, currentStep);
  const { pooledMap, highlightedBlocks } = computeMaxPooling(featureMap);
  const flattened = flattenMap(pooledMap);
  const predictions = predictDigitClass(image, flattened);
  const topPrediction = predictions.reduce(
    (max, cur) => (cur.probability > max.probability ? cur : max),
    predictions[0]
  );

  // Step function
  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 35 ? prev + 1 : 0));
  }, []);

  // Reset scan
  const handleResetScan = useCallback(() => {
    setIsScanning(false);
    if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    setCurrentStep(0);
  }, []);

  // Toggle play/pause scan
  const handlePlayPause = () => {
    setIsScanning((prev) => !prev);
  };

  // Continuous scan effect
  useEffect(() => {
    if (isScanning) {
      const intervalMs = Math.round(450 / simulationSpeed);
      scanTimerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 35) {
            setIsScanning(false);
            return 35;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    }

    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, [isScanning, simulationSpeed]);

  // Toggle individual pixel on 8x8 drawing pad
  const togglePixel = (r: number, c: number) => {
    setImage((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
    setActiveImagePreset('custom');
  };

  // Apply image preset
  const applyImagePreset = (presetKey: CNNImagePreset) => {
    setImage(CNN_IMAGE_PRESETS[presetKey].grid);
    setActiveImagePreset(presetKey);
    setCurrentStep(0);
  };

  // Apply kernel preset
  const applyKernelPreset = (kernelKey: CNNKernelPreset) => {
    setKernel(CNN_KERNEL_PRESETS[kernelKey].matrix);
    setActiveKernelPreset(kernelKey);
    setCurrentStep(0);
  };

  // Clear canvas
  const handleClearCanvas = () => {
    setImage(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0)));
    setActiveImagePreset('custom');
    setCurrentStep(0);
  };

  // Determine status
  let statusText = 'Filter Siap Memindai';
  let statusVariant: StatusVariant = 'ready';
  let statusDesc = `Posisi baris ${stepDetail.row + 1}, kolom ${stepDetail.col + 1}`;

  if (isScanning) {
    statusText = `Memindai Langkah ${currentStep + 1} dari 36`;
    statusVariant = 'running';
    statusDesc = 'Kernel 3x3 sedang menggeser kaca pembesar';
  } else if (currentStep === 35) {
    statusText = 'Pemindaian 6x6 Selesai';
    statusVariant = 'success';
    statusDesc = 'Peta fitur penuh siap diringkas lewat Max Pooling';
  }

  // Guided presets for digit recognition
  const presets: GuidedPreset[] = [
    {
      id: 'digit1_match',
      label: '1. Deteksi Angka 1 (Batang Tegak)',
      description: 'Filter garis tegak sangat cocok dengan tiang vertikal angka 1.',
      isActive: activeImagePreset === 'digit1' && activeKernelPreset === 'vertical',
      onApply: () => {
        applyImagePreset('digit1');
        applyKernelPreset('vertical');
        setCurrentStep(35);
      },
    },
    {
      id: 'digit2_match',
      label: '2. Deteksi Angka 2 (Palang & Siku)',
      description: 'Filter horizontal mendeteksi atap dan alas angka 2.',
      isActive: activeImagePreset === 'digit2' && activeKernelPreset === 'horizontal',
      onApply: () => {
        applyImagePreset('digit2');
        applyKernelPreset('horizontal');
        setCurrentStep(35);
      },
    },
    {
      id: 'digit5_match',
      label: '3. Deteksi Angka 5 (Lengkung Bawah)',
      description: 'Filter sudut menangkap belokan khas perut angka 5.',
      isActive: activeImagePreset === 'digit5' && activeKernelPreset === 'edge',
      onApply: () => {
        applyImagePreset('digit5');
        applyKernelPreset('edge');
        setCurrentStep(35);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 border border-cyan-800/60">
            Modul 04
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Bagaimana Komputer Melihat & Mengenali Angka 1-5? (Bedah Arsitektur CNN)
          </h2>
        </div>
        <p className="text-sm text-slate-300">
          Ikuti perjalanan visual 4 tahap: Gambar Input Angka 8x8 → Konvolusi Sliding Kernel 3x3 → Peta Fitur 6x6 & Max Pooling 3x3 → Prediksi Klasifikasi Digit 1-5.
        </p>
      </div>

      {/* Guided Presets */}
      <GuidedPresetButtons presets={presets} />

      {/* Control Bar for Scan Animation */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <StatusIndicator status={statusText} variant={statusVariant} description={statusDesc} />
          <div className="hidden sm:block text-xs font-mono text-slate-400">
            Langkah: <strong className="text-cyan-300">{currentStep + 1}</strong>/36
          </div>
        </div>

        <SimulationControls
          isRunning={isScanning}
          onPlayPause={handlePlayPause}
          onStep={handleNextStep}
          onReset={handleResetScan}
          stepLabel="Geser 1 Petak"
        />
      </div>

      {/* 4-Column Connected Pipeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* =========================================
            PANEL 1: Input Image Canvas (8x8)
           ========================================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Grid className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>1. Gambar Input (8x8)</span>
            </h3>
            <button
              type="button"
              onClick={handleClearCanvas}
              title="Bersihkan Kanvas"
              aria-label="Bersihkan Kanvas Gambar"
              className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
            >
              <Eraser className="h-3 w-3" />
              <span>Kosongkan</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Klik kotak untuk menggambar angka 1-5 (0 atau 1), atau pilih angka siap pakai:
          </p>

          {/* Preset Buttons for Digits 1-5 */}
          <div className="flex flex-wrap gap-1.5">
            {(['digit1', 'digit2', 'digit3', 'digit4', 'digit5'] as CNNImagePreset[]).map((pkey) => {
              const isSelected = activeImagePreset === pkey;
              return (
                <button
                  key={pkey}
                  type="button"
                  onClick={() => applyImagePreset(pkey)}
                  className={cn(
                    'rounded border px-2.5 py-1 text-xs font-semibold transition-colors',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  )}
                >
                  {CNN_IMAGE_PRESETS[pkey].name}
                </button>
              );
            })}
          </div>

          {/* Interactive 8x8 Grid */}
          <div className="relative mx-auto my-1 flex aspect-square w-full max-w-[240px] flex-col rounded-xl border-2 border-slate-700 bg-slate-950 p-1.5 shadow-inner">
            <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-0.5">
              {image.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isInKernelWindow =
                    rIdx >= stepDetail.row &&
                    rIdx < stepDetail.row + 3 &&
                    cIdx >= stepDetail.col &&
                    cIdx < stepDetail.col + 3;

                  return (
                    <button
                      key={`pixel-${rIdx}-${cIdx}`}
                      type="button"
                      onClick={() => togglePixel(rIdx, cIdx)}
                      aria-label={`Piksel baris ${rIdx + 1}, kolom ${cIdx + 1}, nilai ${val}`}
                      className={cn(
                        'relative flex items-center justify-center rounded-sm font-mono text-[9px] font-bold transition-all',
                        val === 1 ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-600',
                        isInKernelWindow && 'ring-2 ring-amber-400 z-10'
                      )}
                    >
                      {val}
                    </button>
                  );
                })
              )}
            </div>

            {/* Bounding Box Outline Indicator for Current Kernel Step */}
            <div
              className="pointer-events-none absolute border-2 border-amber-400 bg-amber-400/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-200"
              style={{
                top: `${(stepDetail.row / 8) * 100}%`,
                left: `${(stepDetail.col / 8) * 100}%`,
                width: `${(3 / 8) * 100}%`,
                height: `${(3 / 8) * 100}%`,
              }}
            />
          </div>
          <div className="text-center text-[10px] text-amber-300 font-mono">
            Sorotan kuning: area 3x3 yang sedang dipindai
          </div>
        </div>

        {/* =========================================
            PANEL 2: Kernel Filter & Current Math
           ========================================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Scan className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span>2. Kernel / Filter (3x3)</span>
            </h3>
          </div>

          <p className="text-[11px] text-slate-400">
            Pilih detektor fitur atau ubah nilai bobot secara langsung:
          </p>

          {/* Filter Preset Buttons */}
          <div className="flex flex-col gap-1.5">
            {(['vertical', 'horizontal', 'edge'] as CNNKernelPreset[]).map((kkey) => {
              const isSelected = activeKernelPreset === kkey;
              return (
                <button
                  key={kkey}
                  type="button"
                  onClick={() => applyKernelPreset(kkey)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-2 text-left text-xs transition-colors',
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className="font-semibold">{CNN_KERNEL_PRESETS[kkey].name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>

          {/* Editable 3x3 Kernel Matrix */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-center">
            <span className="text-[10px] font-mono text-slate-400">Matriks Filter 3x3:</span>
            <div className="mx-auto mt-1 grid max-w-[150px] grid-cols-3 gap-1">
              {kernel.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`k-${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 0;
                      setKernel((prev) => {
                        const copy = prev.map((kr) => [...kr]);
                        copy[r][c] = num;
                        return copy;
                      });
                    }}
                    aria-label={`Kernel sel ${r}, ${c}`}
                    className="h-8 w-11 rounded border border-slate-700 bg-slate-900 text-center font-mono text-xs font-bold text-cyan-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  />
                ))
              )}
            </div>
          </div>

          {/* Real-time Math Breakdown Box */}
          <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-2.5">
            <div className="text-[11px] font-semibold text-cyan-300">
              Bedah Hitungan Dot Product Saat Ini:
            </div>
            <div className="mt-1 font-mono text-[10px] leading-tight text-slate-300">
              Sum = (9 piksel × 9 filter) = <span className="font-bold text-amber-300">{stepDetail.dotSum}</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-300">
              Aktivasi ReLU(Sum) = <span className="font-bold text-emerald-400">{stepDetail.reluValue}</span>
            </div>
          </div>
        </div>

        {/* =========================================
            PANEL 3: Feature Map (6x6) & Max Pooling (3x3)
           ========================================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span>3. Peta Fitur & Pooling</span>
            </h3>
          </div>

          {/* 6x6 Feature Map */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Feature Map (6x6):</span>
              <span className="font-mono text-amber-300">{stepDetail.reluValue} baru masuk</span>
            </div>
            <div className="mx-auto grid max-w-[200px] grid-cols-6 gap-0.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
              {featureMap.map((row, r) =>
                row.map((val, c) => {
                  const isCurrentCell = r === stepDetail.row && c === stepDetail.col;
                  return (
                    <div
                      key={`fm-${r}-${c}`}
                      className={cn(
                        'flex aspect-square items-center justify-center rounded font-mono text-[9px] font-bold transition-all',
                        isCurrentCell && 'ring-2 ring-cyan-400 bg-cyan-950 text-cyan-200',
                        val === null
                          ? 'bg-slate-900/40 text-slate-700'
                          : val > 0
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-900 text-slate-500'
                      )}
                    >
                      {val !== null ? val : '·'}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2x2 Max Pooling into 3x3 */}
          <div className="mt-2 border-t border-slate-800/80 pt-2">
            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Hasil Max Pooling 2x2 (3x3):</span>
              <span className="text-[10px] text-cyan-300 font-mono">Puncak Terbesar</span>
            </div>
            <div className="mx-auto grid max-w-[130px] grid-cols-3 gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1.5">
              {pooledMap.map((pRow, pr) =>
                pRow.map((pVal, pc) => (
                  <div
                    key={`pool-${pr}-${pc}`}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded border font-mono text-xs font-bold',
                      pVal !== null && pVal > 0
                        ? 'border-emerald-600/60 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-600'
                    )}
                  >
                    {pVal !== null ? pVal : '·'}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            Max Pooling mengambil nilai terbesar dari setiap blok 2x2 untuk menjaga fitur penting.
          </div>
        </div>

        {/* =========================================
            PANEL 4: Flattening & Prediction Bar Chart
           ========================================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <BarChart3 className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <span>4. Prediksi Akhir</span>
            </h3>
          </div>

          {/* Flattening representation */}
          <div>
            <div className="mb-1 text-[11px] text-slate-400">
              Vektor Flattening (9 Angka 1D):
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1.5 font-mono text-[10px]">
              {flattened.map((v, i) => (
                <span
                  key={`flat-${i}`}
                  className={cn(
                    'rounded px-1 py-0.5',
                    v > 0 ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-600'
                  )}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Top Digit Winner Badge */}
          <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-2.5 text-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Tebakan Angka Terkuat:
            </span>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-xl font-extrabold font-mono text-cyan-300">
                {topPrediction.label}
              </span>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-200 border border-cyan-500/40">
                {topPrediction.probability}%
              </span>
            </div>
          </div>

          {/* Prediction Bars for Digits 1-5 */}
          <div className="space-y-2 mt-1">
            <div className="text-[11px] font-semibold text-slate-300">
              Probabilitas Tiap Digit (1-5):
            </div>
            {predictions.map((pred) => {
              const isWinner = pred.digit === topPrediction.digit;
              return (
                <div key={pred.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={cn('font-medium', isWinner ? 'text-cyan-300 font-bold' : 'text-slate-300')}>
                      {pred.label} {isWinner && '(Terpilih)'}
                    </span>
                    <span className={cn('font-mono font-bold', isWinner ? 'text-cyan-300' : 'text-slate-400')}>
                      {pred.probability}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        isWinner
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : pred.probability >= 25
                          ? 'bg-amber-400'
                          : 'bg-slate-600'
                      )}
                      style={{ width: `${pred.probability}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Honest Educational Classification Disclaimer */}
          <div className="mt-auto rounded-lg border border-slate-800/80 bg-slate-950/70 p-2.5 text-[10px] text-slate-400">
            <strong className="text-slate-200">Catatan Simulasi: </strong>
            Prediksi dihitung dari korelasi fitur pooling dan kemiripan bentuk angka 1-5 (simulasi klasifikasi edukatif CNN).
          </div>
        </div>
      </div>

      {/* Manual Slider for Scan Step */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <ParameterSlider
          id="slider-cnn-step"
          label="Langkah Pemindaian Konvolusi (Posisi Filter)"
          symbol="s"
          value={currentStep + 1}
          min={1}
          max={36}
          step={1}
          onChange={(val) => {
            setIsScanning(false);
            setCurrentStep(val - 1);
          }}
          color="#F59E0B"
          tooltip="Geser untuk melihat posisi filter secara manual dari 1 hingga 36"
        />
      </div>

      {/* Educational Math Equation & Concept Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InteractiveEquation
          title="Rumus Matematika Operasi Konvolusi & Max Pooling"
          latex="(I * K)_{r,c} = \text{ReLU}\left(\sum_{i=0}^2 \sum_{j=0}^2 I_{r+i, c+j} \cdot K_{i,j}\right)"
          variableMap={[
            { symbol: 'I', label: 'Input gambar angka 8x8', color: '#10B981' },
            { symbol: 'K', label: 'Kernel filter 3x3', color: '#06B6D4' },
            { symbol: 'ReLU', label: 'Fungsi aktivasi max(0, x)', color: '#F59E0B' },
          ]}
        />

        <ConceptCard
          title="Konsep: Bagaimana Komputer Mengenali Angka 1 sampai 5"
          intuitionText={
            <p>
              Saat kamu menggambar angka, komputer tidak membaca angka itu secara ajaib. Komputer menggunakan <strong>Filter (Kaca Pembesar)</strong> untuk mencari potongan-potongan ciri khas:
              <strong>Filter garis tegak</strong> mencari tiang lurus angka 1 atau 4.
              <strong>Filter garis mendatar</strong> mencari atap dan alas angka 2, 3, dan 5.
              <strong>Filter sudut</strong> mencari lengkungan khas angka 2, 3, 4, dan 5.
              Dari gabungan temuan potongan ini, komputer menyimpulkan angka mana yang paling cocok!
            </p>
          }
          mathText={
            <p>
              Operasi konvolusi 2D diskrit menerapkan perkalian elemen-demi-elemen dengan kernel bobot terbagi (weight sharing).
              Hasil pooling membentuk vektor fitur representasi 9 dimensi yang menjadi dasar perhitungan probabilitas fungsi Softmax pada 5 kelas angka <span className="font-mono text-cyan-300">d ∈ &#123;1, 2, 3, 4, 5&#125;</span>.
            </p>
          }
          keyTakeaway="Prinsip utama CNN dalam pengenalan angka (seperti dataset MNIST) adalah menyederhanakan gambar piksel kompleks menjadi kombinasi pola fitur primitif lokal (garis dan lengkungan)."
        />
      </div>
    </div>
  );
}
