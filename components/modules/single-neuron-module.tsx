'use client';

import React, { useState } from 'react';
import {
  calculateWeightedSum,
  activate,
  classifyOutput,
  getDecisionBoundaryLine,
} from '@/lib/math/neuron';
import { WEATHER_SAMPLE_DATA } from '@/lib/constants';
import { ActivationFunctionType } from '@/types/simulation';
import { useLearningStore } from '@/store/learning-mode-store';
import { ParameterSlider } from '@/components/shared/parameter-slider';
import { ConceptCard } from '@/components/shared/concept-card';
import { InteractiveEquation } from '@/components/shared/interactive-equation';
import { GuidedPresetButtons, GuidedPreset } from '@/components/shared/guided-preset-buttons';
import { cn } from '@/lib/utils';
import { CloudRain, Sun, Activity } from 'lucide-react';

export function SingleNeuronModule() {
  const { highlightedSymbol, setHighlightedSymbol } = useLearningStore();

  const [x1, setX1] = useState<number>(0.65);
  const [x2, setX2] = useState<number>(0.75);
  const [w1, setW1] = useState<number>(1.8);
  const [w2, setW2] = useState<number>(2.0);
  const [b, setB] = useState<number>(-1.5);
  const [activation, setActivation] = useState<ActivationFunctionType>('sigmoid');

  // Math computations
  const z = calculateWeightedSum(x1, x2, w1, w2, b);
  const output = activate(z, activation);
  const predictedClass = classifyOutput(output, activation);

  // Decision boundary geometry
  const boundary = getDecisionBoundaryLine(w1, w2, b);

  // Scatter plot SVG dimensions
  const scatterSize = 280;
  const padding = 30;

  const toScatterX = (val: number) => padding + val * (scatterSize - padding * 2);
  const toScatterY = (val: number) => scatterSize - padding - val * (scatterSize - padding * 2);

  // Guided presets
  const presets: GuidedPreset[] = [
    {
      id: 'accurate',
      label: '1. Pemisah Akurat',
      description: 'Bobot seimbang membagi titik Cerah & Hujan dengan tepat.',
      isActive: w1 === 1.8 && w2 === 2.0 && b === -1.5,
      onApply: () => {
        setW1(1.8);
        setW2(2.0);
        setB(-1.5);
        setX1(0.7);
        setX2(0.75);
      },
    },
    {
      id: 'cloud_focused',
      label: '2. Hanya Peduli Awan',
      description: 'Bobot kelembapan (w1) nol, keputusan murni dari ketebalan awan.',
      isActive: w1 === 0.0 && w2 === 2.5 && b === -1.2,
      onApply: () => {
        setW1(0.0);
        setW2(2.5);
        setB(-1.2);
        setX1(0.5);
        setX2(0.8);
      },
    },
    {
      id: 'optimistic',
      label: '3. Bias Optimis (Cenderung Cerah)',
      description: 'Bias sangat negatif (b = -2.8), butuh kelembaban ekstrem untuk hujan.',
      isActive: w1 === 1.5 && w2 === 1.5 && b === -2.8,
      onApply: () => {
        setW1(1.5);
        setW2(1.5);
        setB(-2.8);
        setX1(0.6);
        setX2(0.6);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 border border-cyan-800/60">
            Modul 02
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Mengenal Satu Sel Otak Buatan (Single Neuron / Perceptron)
          </h2>
        </div>
        <p className="text-sm text-slate-300">
          Melihat langsung bagaimana sebuah neuron buatan menimbang input, menjumlahkan bobot dan bias, lalu mengambil keputusan biner lewat fungsi aktivasi.
        </p>
      </div>

      {/* Guided Presets */}
      <GuidedPresetButtons presets={presets} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Visual Area: SVG Neuron + 2D Decision Boundary */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* 1. SVG Neuron Architecture Diagram */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>Arsitektur Fisik 1 Neuron</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Aktivasi:</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-amber-300 uppercase font-semibold">
                  {activation}
                </span>
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950 p-3">
              <svg
                viewBox="0 0 540 260"
                className="h-auto w-full select-none"
                role="img"
                aria-label="Diagram Perceptron dengan 2 Input, Garis Bobot, Node Penjumlahan, dan Output"
              >
                <defs>
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection lines from Input x1 to Neuron */}
                <line
                  x1="100"
                  y1="75"
                  x2="250"
                  y2="130"
                  stroke={w1 >= 0 ? '#06B6D4' : '#F43F5E'}
                  strokeWidth={Math.max(1.5, Math.min(8, Math.abs(w1) * 2.2))}
                  strokeOpacity={highlightedSymbol === 'w1' ? 1 : 0.75}
                />
                {/* Connection line label w1 */}
                <rect
                  x="160"
                  y="85"
                  width="46"
                  height="18"
                  rx="4"
                  fill="#0F172A"
                  stroke={w1 >= 0 ? '#06B6D4' : '#F43F5E'}
                  strokeWidth="1"
                />
                <text
                  x="183"
                  y="98"
                  fill="#F8FAFC"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  w₁={w1 > 0 ? `+${w1.toFixed(1)}` : w1.toFixed(1)}
                </text>

                {/* Connection lines from Input x2 to Neuron */}
                <line
                  x1="100"
                  y1="185"
                  x2="250"
                  y2="130"
                  stroke={w2 >= 0 ? '#06B6D4' : '#F43F5E'}
                  strokeWidth={Math.max(1.5, Math.min(8, Math.abs(w2) * 2.2))}
                  strokeOpacity={highlightedSymbol === 'w2' ? 1 : 0.75}
                />
                {/* Connection line label w2 */}
                <rect
                  x="160"
                  y="155"
                  width="46"
                  height="18"
                  rx="4"
                  fill="#0F172A"
                  stroke={w2 >= 0 ? '#06B6D4' : '#F43F5E'}
                  strokeWidth="1"
                />
                <text
                  x="183"
                  y="168"
                  fill="#F8FAFC"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  w₂={w2 > 0 ? `+${w2.toFixed(1)}` : w2.toFixed(1)}
                </text>

                {/* Connection line from Neuron to Output */}
                <line
                  x1="330"
                  y1="130"
                  x2="440"
                  y2="130"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                />
                <polygon points="436,126 444,130 436,134" fill="#F59E0B" />

                {/* Input Node 1 (Kelembaban x1) */}
                <circle
                  cx="100"
                  cy="75"
                  r="28"
                  fill="#064E3B"
                  stroke={highlightedSymbol === 'x1' ? '#67E8F9' : '#10B981'}
                  strokeWidth="2.5"
                  filter="url(#nodeGlow)"
                />
                <text x="100" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  x₁: {x1.toFixed(2)}
                </text>
                <text x="100" y="85" fill="#A7F3D0" fontSize="9" textAnchor="middle">
                  Kelembapan
                </text>

                {/* Input Node 2 (Awan x2) */}
                <circle
                  cx="100"
                  cy="185"
                  r="28"
                  fill="#064E3B"
                  stroke={highlightedSymbol === 'x2' ? '#67E8F9' : '#10B981'}
                  strokeWidth="2.5"
                  filter="url(#nodeGlow)"
                />
                <text x="100" y="180" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  x₂: {x2.toFixed(2)}
                </text>
                <text x="100" y="195" fill="#A7F3D0" fontSize="9" textAnchor="middle">
                  Awan
                </text>

                {/* Central Neuron Node (Big Circle with Divider) */}
                <circle
                  cx="290"
                  cy="130"
                  r="45"
                  fill="#0F172A"
                  stroke={highlightedSymbol === 'z' ? '#67E8F9' : '#334155'}
                  strokeWidth="2.5"
                />
                <line x1="290" y1="85" x2="290" y2="175" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Left Half: Summation + Bias */}
                <text x="272" y="122" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Σ + b
                </text>
                <text x="272" y="142" fill="#38BDF8" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  z={z.toFixed(2)}
                </text>

                {/* Right Half: Activation */}
                <text x="310" y="122" fill="#94A3B8" fontSize="11" textAnchor="middle" fontWeight="bold">
                  f(z)
                </text>
                <text x="310" y="142" fill="#F59E0B" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {output.toFixed(2)}
                </text>

                {/* Bias tag below neuron */}
                <rect
                  x="265"
                  y="185"
                  width="50"
                  height="18"
                  rx="4"
                  fill="#1E293B"
                  stroke={highlightedSymbol === 'b' ? '#F59E0B' : '#475569'}
                  strokeWidth="1"
                />
                <text
                  x="290"
                  y="198"
                  fill="#F59E0B"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  b = {b.toFixed(1)}
                </text>

                {/* Output Node */}
                <circle
                  cx="465"
                  cy="130"
                  r="30"
                  fill={predictedClass === 'hujan' ? '#064E3B' : '#1E3A8A'}
                  stroke={predictedClass === 'hujan' ? '#10B981' : '#38BDF8'}
                  strokeWidth="2.5"
                  filter="url(#nodeGlow)"
                />
                <text x="465" y="125" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                  ŷ: {output.toFixed(2)}
                </text>
                <text
                  x="465"
                  y="142"
                  fill={predictedClass === 'hujan' ? '#A7F3D0' : '#BAE6FD'}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="uppercase"
                >
                  {predictedClass}
                </text>
              </svg>
            </div>

            {/* Prediction Result Pill */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex items-center gap-2">
                {predictedClass === 'hujan' ? (
                  <CloudRain className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400" aria-hidden="true" />
                )}
                <div>
                  <div className="text-xs text-slate-400">Keputusan Akhir Prediksi:</div>
                  <div className="text-sm font-bold text-slate-100">
                    Hari Ini Diprediksi <span className={predictedClass === 'hujan' ? 'text-emerald-400 uppercase' : 'text-amber-400 uppercase'}>{predictedClass}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Skor Probabilitas:</div>
                <div className="font-mono text-sm font-bold text-cyan-300">
                  {(output * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* 2. 2D Decision Boundary Scatter Plot */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Plot 2D Garis Keputusan (Decision Boundary)
                </h3>
                <p className="text-xs text-slate-400">
                  Garis pembatas bergerak secara langsung saat slider bobot dan bias digeser
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-sky-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500 inline-block" />
                  <span>Cerah</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Hujan</span>
                </span>
              </div>
            </div>

            <div className="flex justify-center p-1">
              <svg
                viewBox={`0 0 ${scatterSize} ${scatterSize}`}
                className="h-auto w-full max-w-[340px] rounded-xl border border-slate-800 bg-slate-950"
                role="img"
                aria-label="Plot data cuaca dengan garis pemisah decision boundary"
              >
                {/* Plot Background Grid */}
                <rect x={padding} y={padding} width={scatterSize - padding * 2} height={scatterSize - padding * 2} fill="#020617" />
                <line x1={padding} y1={scatterSize - padding} x2={scatterSize - padding} y2={scatterSize - padding} stroke="#334155" />
                <line x1={padding} y1={padding} x2={padding} y2={scatterSize - padding} stroke="#334155" />

                {/* Grid guidelines */}
                {[0.25, 0.5, 0.75].map((g) => (
                  <g key={`grid-${g}`}>
                    <line
                      x1={toScatterX(g)}
                      y1={padding}
                      x2={toScatterX(g)}
                      y2={scatterSize - padding}
                      stroke="#1E293B"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={padding}
                      y1={toScatterY(g)}
                      x2={scatterSize - padding}
                      y2={toScatterY(g)}
                      stroke="#1E293B"
                      strokeDasharray="2 2"
                    />
                  </g>
                ))}

                {/* Decision Boundary Line */}
                {boundary.isValid && (
                  <line
                    x1={toScatterX(boundary.p1[0])}
                    y1={toScatterY(boundary.p1[1])}
                    x2={toScatterX(boundary.p2[0])}
                    y2={toScatterY(boundary.p2[1])}
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Fixed Weather Sample Points */}
                {WEATHER_SAMPLE_DATA.map((pt, idx) => (
                  <circle
                    key={`pt-${idx}`}
                    cx={toScatterX(pt.x1)}
                    cy={toScatterY(pt.x2)}
                    r="4.5"
                    fill={pt.label === 'hujan' ? '#10B981' : '#38BDF8'}
                    stroke="#020617"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                ))}

                {/* Current Active Input Marker (Pulse) */}
                <circle
                  cx={toScatterX(x1)}
                  cy={toScatterY(x2)}
                  r="7"
                  fill="#F43F5E"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <circle
                  cx={toScatterX(x1)}
                  cy={toScatterY(x2)}
                  r="12"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-ping"
                />

                {/* Axis Labels */}
                <text x={scatterSize / 2} y={scatterSize - 8} fill="#94A3B8" fontSize="10" textAnchor="middle">
                  Kelembapan (x₁) →
                </text>
                <text
                  x={12}
                  y={scatterSize / 2}
                  fill="#94A3B8"
                  fontSize="10"
                  textAnchor="middle"
                  transform={`rotate(-90 12 ${scatterSize / 2})`}
                >
                  Awan (x₂) →
                </text>
              </svg>
            </div>
            <div className="mt-2 text-center text-[11px] text-slate-400">
              Titik merah berdenyut menunjukkan posisi input saat ini (x₁={x1.toFixed(2)}, x₂={x2.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Activation Choice, Equations */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Activation Function Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <label className="mb-2 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Pilihan Fungsi Aktivasi f(z):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sigmoid', 'relu', 'step'] as ActivationFunctionType[]).map((type) => {
                const isSelected = activation === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActivation(type)}
                    className={cn(
                      'min-h-[44px] rounded-lg border px-3 py-2 text-xs font-mono font-medium transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    )}
                  >
                    {type.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Parameter Input & Bobot
            </h4>

            {/* x1 and x2 input sliders */}
            <ParameterSlider
              id="slider-x1"
              label="Kelembapan Udara"
              symbol="x₁"
              value={x1}
              min={0.0}
              max={1.0}
              step={0.05}
              onChange={setX1}
              color="#10B981"
            />
            <ParameterSlider
              id="slider-x2"
              label="Ketebalan Awan"
              symbol="x₂"
              value={x2}
              min={0.0}
              max={1.0}
              step={0.05}
              onChange={setX2}
              color="#10B981"
            />

            {/* w1 and w2 weight sliders */}
            <ParameterSlider
              id="slider-w1"
              label="Bobot Kelembapan"
              symbol="w₁"
              value={w1}
              min={-3.0}
              max={3.0}
              step={0.1}
              onChange={setW1}
              color={w1 >= 0 ? '#06B6D4' : '#F43F5E'}
              tooltip="Pengaruh kelembapan ke keputusan"
            />
            <ParameterSlider
              id="slider-w2"
              label="Bobot Ketebalan Awan"
              symbol="w₂"
              value={w2}
              min={-3.0}
              max={3.0}
              step={0.1}
              onChange={setW2}
              color={w2 >= 0 ? '#06B6D4' : '#F43F5E'}
              tooltip="Pengaruh awan ke keputusan"
            />

            {/* Bias slider */}
            <ParameterSlider
              id="slider-b"
              label="Bias / Ambang Batas Awal"
              symbol="b"
              value={b}
              min={-4.0}
              max={4.0}
              step={0.1}
              onChange={setB}
              color="#F59E0B"
              tooltip="Kecenderungan awal sebelum melihat data"
            />
          </div>

          {/* Interactive Formula */}
          <InteractiveEquation
            title="Perhitungan Matematis di Dalam Neuron"
            latex="z = (x_1 \cdot w_1) + (x_2 \cdot w_2) + b \quad \longrightarrow \quad \hat{y} = f(z)"
            variableMap={[
              { symbol: 'x₁', label: 'Kelembaban', value: x1.toFixed(2), color: '#10B981' },
              { symbol: 'w₁', label: 'Bobot kelembaban', value: w1.toFixed(1), color: '#06B6D4' },
              { symbol: 'x₂', label: 'Ketebalan awan', value: x2.toFixed(2), color: '#10B981' },
              { symbol: 'w₂', label: 'Bobot awan', value: w2.toFixed(1), color: '#06B6D4' },
              { symbol: 'b', label: 'Bias', value: b.toFixed(1), color: '#F59E0B' },
              { symbol: 'z', label: 'Jumlah terbobot', value: z.toFixed(2), color: '#38BDF8' },
            ]}
          />

          {/* Concept Card */}
          <ConceptCard
            title="Konsep: Bagaimana Satu Neuron Mengambil Keputusan"
            intuitionText={
              <p>
                Bayangkan neuron seperti seorang juru masak: <strong>Input (x)</strong> adalah takaran bahan, <strong>Bobot (w)</strong> adalah seberapa penting rasa bahan tersebut bagi kelezatan masakan, dan <strong>Bias (b)</strong> adalah selera bawaan si juru masak (apakah ia dasarnya suka manis atau asin).
                Semua dicampur jadi satu (<strong>z</strong>), lalu dicicipi lewat filter rasa (<strong>Fungsi Aktivasi</strong>) untuk memutuskan apakah masakan ini enak (1) atau tidak (0).
              </p>
            }
            mathText={
              <p>
                Perceptron menghitung kombinasi linear <span className="font-mono text-cyan-300">z = w^T x + b</span>.
                Garis batas keputusan diperoleh ketika <span className="font-mono text-amber-300">z = 0</span>, yang menghasilkan persamaan garis linear <span className="font-mono text-slate-200">w₁x₁ + w₂x₂ + b = 0</span>.
                Fungsi aktivasi non-linear seperti Sigmoid <span className="font-mono">σ(z) = 1 / (1 + e^-z)</span> memetakan nilai z ke interval probabilitas <span className="font-mono">[0, 1]</span>.
              </p>
            }
            keyTakeaway="Perceptron tunggal hanya mampu memisahkan data yang dapat dibagi secara linear (linearly separable). Perubahan bobot memutar kemiringan garis pemisah, sedangkan bias menggeser garis maju-mundur."
          />
        </div>
      </div>
    </div>
  );
}
