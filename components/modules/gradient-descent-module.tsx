'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  calculateLoss,
  calculateGradient,
  takeGradientStep,
  generateLossCurve,
  getTangentLine,
} from '@/lib/math/gradient-descent';
import { useLearningStore } from '@/store/learning-mode-store';
import { SimulationControls } from '@/components/shared/simulation-controls';
import { ParameterSlider } from '@/components/shared/parameter-slider';
import { StatusIndicator, StatusVariant } from '@/components/shared/status-indicator';
import { ConceptCard } from '@/components/shared/concept-card';
import { InteractiveEquation } from '@/components/shared/interactive-equation';
import { GuidedPresetButtons, GuidedPreset } from '@/components/shared/guided-preset-buttons';
import { GradientPoint } from '@/types/simulation';

export function GradientDescentModule() {
  const { simulationSpeed, highlightedSymbol } = useLearningStore();

  const [w, setW] = useState<number>(0.5);
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<GradientPoint[]>([{ w: 0.5, loss: calculateLoss(0.5) }]);
  const [stepCount, setStepCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLoss = calculateLoss(w);
  const currentGradient = calculateGradient(w);

  // SVG coordinate transformation helpers
  // w range: [-1.5, 7.5] => SVG X: [40, 560] (width 600)
  // Loss range: [0, 22] => SVG Y: [280, 20] (height 320)
  const svgWidth = 600;
  const svgHeight = 320;
  const minW = -1.5;
  const maxW = 7.5;
  const minLoss = 0;
  const maxLoss = 22;

  const toSvgX = useCallback(
    (valW: number) => {
      return 40 + ((valW - minW) / (maxW - minW)) * (svgWidth - 80);
    },
    [minW, maxW, svgWidth]
  );

  const toSvgY = useCallback(
    (valLoss: number) => {
      const clamped = Math.max(minLoss, Math.min(maxLoss, valLoss));
      return svgHeight - 40 - ((clamped - minLoss) / (maxLoss - minLoss)) * (svgHeight - 80);
    },
    [minLoss, maxLoss, svgHeight]
  );

  // Step function
  const handleStep = useCallback(() => {
    const { newW, newLoss } = takeGradientStep(w, learningRate);
    setW(newW);
    setHistory((prev) => [...prev.slice(-20), { w: newW, loss: newLoss }]);
    setStepCount((prev) => prev + 1);
  }, [w, learningRate]);

  // Reset function
  const handleReset = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const initialW = 0.5;
    setW(initialW);
    setHistory([{ w: initialW, loss: calculateLoss(initialW) }]);
    setStepCount(0);
  }, []);

  // Play/Pause toggle
  const handlePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Continuous execution effect
  useEffect(() => {
    if (isRunning) {
      const intervalMs = Math.round(500 / simulationSpeed);
      timerRef.current = setInterval(() => {
        setW((prevW) => {
          // If already very close to optimum, stop
          if (Math.abs(prevW - 3) < 0.001) {
            setIsRunning(false);
            return 3;
          }
          const { newW, newLoss } = takeGradientStep(prevW, learningRate);
          setHistory((hist) => [...hist.slice(-20), { w: newW, loss: newLoss }]);
          setStepCount((s) => s + 1);
          return newW;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, learningRate, simulationSpeed]);

  // Determine behavior status
  let statusText = 'Siap Melangkah';
  let statusVariant: StatusVariant = 'ready';
  let statusDescription = 'Tekan tombol Langkah atau Jalankan Otomatis';

  if (Math.abs(w - 3) < 0.05) {
    statusText = 'Lembah Tercapai (Konvergen Optimal)';
    statusVariant = 'success';
    statusDescription = 'Nilai loss mendekati batas terendah minimum L(3) = 1';
  } else if (learningRate >= 1.0) {
    statusText = 'Overshooting (Melompat Terlalu Jauh)';
    statusVariant = 'warning';
    statusDescription = 'Ukuran langkah terlalu besar hingga memantul melewati dasar lembah';
  } else if (learningRate <= 0.08) {
    statusText = 'Langkah Sangat Lambat';
    statusVariant = 'info';
    statusDescription = 'Perubahan bobot sangat kecil, butuh banyak langkah untuk sampai';
  } else if (isRunning) {
    statusText = 'Sedang Turun Menuju Titik Terendah';
    statusVariant = 'running';
    statusDescription = `Langkah ke-${stepCount}, gradien = ${currentGradient.toFixed(2)}`;
  }

  // Curve points path
  const curvePoints = generateLossCurve(minW, maxW, 0.15);
  const pathD = curvePoints.reduce((acc, pt, idx) => {
    const x = toSvgX(pt.w);
    const y = toSvgY(pt.loss);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Tangent line endpoints
  const tangent = getTangentLine(w, 0.9);
  const tx1 = toSvgX(tangent.x1);
  const ty1 = toSvgY(tangent.y1);
  const tx2 = toSvgX(tangent.x2);
  const ty2 = toSvgY(tangent.y2);

  // Ball position
  const ballX = toSvgX(w);
  const ballY = toSvgY(currentLoss);

  // Target minimum point (w = 3, loss = 1)
  const targetX = toSvgX(3);
  const targetY = toSvgY(1);

  // Guided presets
  const presets: GuidedPreset[] = [
    {
      id: 'ideal',
      label: '1. Turun Stabil (Ideal)',
      description: 'Langkah wajar (alpha = 0.18) menuju lembah secara mantap.',
      isActive: learningRate === 0.18 && w === 0.5,
      onApply: () => {
        handleReset();
        setLearningRate(0.18);
        setW(0.5);
      },
    },
    {
      id: 'slow',
      label: '2. Terlalu Lambat',
      description: 'Langkah terlalu kecil (alpha = 0.05), pergerakan sangat lambat.',
      isActive: learningRate === 0.05 && w === 0.5,
      onApply: () => {
        handleReset();
        setLearningRate(0.05);
        setW(0.5);
      },
    },
    {
      id: 'overshoot',
      label: '3. Overshooting (Melompat)',
      description: 'Langkah raksasa (alpha = 1.05) memantul melewati lembah.',
      isActive: learningRate === 1.05 && w === 0.5,
      onApply: () => {
        handleReset();
        setLearningRate(1.05);
        setW(0.5);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Heading & Objective */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 border border-blue-200">
            Modul 01
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Bagaimana Mesin Belajar dari Kesalahan?
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Mengamati bagaimana algoritma Gradient Descent memandu bobot parameter bergerak menuruni kurva kesalahan (Loss Landscape) hingga mencapai titik paling optimal.
        </p>
      </div>

      {/* Guided Tour Presets */}
      <GuidedPresetButtons presets={presets} />

      {/* Main Grid: Visualizer & Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive 2D Loss Landscape Graph */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-xs lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Lembah Kesalahan (Loss Landscape) 2D
              </h3>
              <p className="text-xs text-slate-500">
                Titik bola menunjukkan posisi parameter bobot w saat ini
              </p>
            </div>
            <StatusIndicator
              status={statusText}
              variant={statusVariant}
              description={statusDescription}
            />
          </div>

          {/* SVG Canvas */}
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/70 p-2 shadow-xs">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="h-auto w-full select-none"
              role="img"
              aria-label={`Grafik kurva loss dengan bola pada w = ${w.toFixed(2)}, loss = ${currentLoss.toFixed(2)}`}
            >
              {/* Grid Lines */}
              <defs>
                <filter id="shadowBall" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Horizontal axis grid */}
              {[0, 5, 10, 15, 20].map((ly) => {
                const yPos = toSvgY(ly);
                return (
                  <g key={`y-${ly}`}>
                    <line
                      x1={40}
                      y1={yPos}
                      x2={svgWidth - 40}
                      y2={yPos}
                      stroke="#CBD5E1"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={32}
                      y={yPos + 4}
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {ly}
                    </text>
                  </g>
                );
              })}

              {/* Vertical axis grid */}
              {[-1, 1, 3, 5, 7].map((lw) => {
                const xPos = toSvgX(lw);
                return (
                  <g key={`x-${lw}`}>
                    <line
                      x1={xPos}
                      y1={20}
                      x2={xPos}
                      y2={svgHeight - 40}
                      stroke="#CBD5E1"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={xPos}
                      y={svgHeight - 22}
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {lw}
                    </text>
                  </g>
                );
              })}

              {/* Optimum Valley Target (w = 3, loss = 1) */}
              <circle
                cx={targetX}
                cy={targetY}
                r="6"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <text
                x={targetX}
                y={targetY + 20}
                fill="#059669"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                Minimum Ideal (w=3)
              </text>

              {/* Main Loss Valley Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* History Step Dots & Path */}
              {history.map((pt, idx) => (
                <circle
                  key={`hist-${idx}`}
                  cx={toSvgX(pt.w)}
                  cy={toSvgY(pt.loss)}
                  r={idx === history.length - 1 ? 2 : 2.5}
                  fill="#D97706"
                  opacity={0.5 + (idx / history.length) * 0.5}
                />
              ))}

              {/* Tangent Slope Line */}
              <line
                x1={tx1}
                y1={ty1}
                x2={tx2}
                y2={ty2}
                stroke={highlightedSymbol === 'gradient' ? '#D97706' : '#E11D48'}
                strokeWidth={highlightedSymbol === 'gradient' ? '3' : '2'}
                strokeDasharray="4 2"
              />

              {/* Current Ball */}
              <circle
                cx={ballX}
                cy={ballY}
                r="7.5"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#shadowBall)"
              />

              {/* Current Value Tooltip Label above the ball */}
              <g transform={`translate(${Math.max(60, Math.min(svgWidth - 90, ballX))}, ${Math.max(35, ballY - 14)})`}>
                <rect
                  x="-45"
                  y="-18"
                  width="90"
                  height="20"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-4"
                  fill="#0F172A"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  w = {w.toFixed(2)}
                </text>
              </g>

              {/* Axis labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 4}
                fill="#475569"
                fontSize="11"
                textAnchor="middle"
                fontWeight="500"
              >
                Parameter Bobot (w)
              </text>
              <text
                x={12}
                y={svgHeight / 2}
                fill="#475569"
                fontSize="11"
                textAnchor="middle"
                fontWeight="500"
                transform={`rotate(-90 12 ${svgHeight / 2})`}
              >
                Tingkat Kesalahan Loss L(w)
              </text>
            </svg>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-2.5 text-center shadow-xs">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">Bobot Saat Ini (w)</span>
              <span className="font-mono text-base font-bold text-blue-700">
                {w.toFixed(3)}
              </span>
            </div>
            <div className="flex flex-col border-x border-slate-200">
              <span className="text-[11px] text-slate-500">Nilai Loss L(w)</span>
              <span className="font-mono text-base font-bold text-amber-700">
                {currentLoss.toFixed(3)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">Gradien Kemiringan</span>
              <span className="font-mono text-base font-bold text-rose-700">
                {currentGradient > 0 ? `+${currentGradient.toFixed(2)}` : currentGradient.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Sliders, and Interactive Equations */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Simulation Control Bar */}
          <SimulationControls
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            onStep={handleStep}
            onReset={handleReset}
            stepLabel="1 Langkah Turun"
          />

          {/* Sliders Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-xs space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Pengatur Eksperimen
            </h4>

            {/* Parameter w slider */}
            <ParameterSlider
              id="slider-w"
              label="Posisi Awal Bobot"
              symbol="w"
              value={w}
              min={-1.0}
              max={7.0}
              step={0.05}
              onChange={(newW) => {
                setIsRunning(false);
                setW(newW);
                setHistory([{ w: newW, loss: calculateLoss(newW) }]);
              }}
              color="#2563EB"
              tooltip="Geser posisi awal bola di lereng"
            />

            {/* Learning Rate slider */}
            <ParameterSlider
              id="slider-lr"
              label="Ukuran Langkah (Learning Rate)"
              symbol="α"
              value={learningRate}
              min={0.05}
              max={1.05}
              step={0.05}
              onChange={(newLr) => setLearningRate(newLr)}
              color="#D97706"
              tooltip="Besar lompatan setiap kali melangkah"
            />
          </div>

          {/* Interactive KaTeX Formula */}
          <InteractiveEquation
            title="Rumus Matematis Pembaruan Parameter"
            latex="w_{\text{baru}} = w - \alpha \cdot \frac{dL}{dw}"
            variableMap={[
              { symbol: 'w', label: 'Bobot saat ini', value: w.toFixed(2), color: '#2563EB' },
              { symbol: 'α', label: 'Learning rate', value: learningRate.toFixed(2), color: '#D97706' },
              { symbol: 'gradient', label: 'Gradien (2(w-3))', value: currentGradient.toFixed(2), color: '#E11D48' },
              { symbol: 'loss', label: 'Loss L(w)', value: currentLoss.toFixed(2), color: '#059669' },
            ]}
          />

          {/* Adaptive Concept Card */}
          <ConceptCard
            title="Konsep: Cara Mesin Belajar dari Kesalahan"
            intuitionText={
              <p>
                Bayangkan kamu berada di atas lereng bukit berkabut sangat tebal dan harus mencari dasar lembah terdalam. Kamu tidak bisa melihat sekeliling, tetapi kamu bisa merasakan kemiringan tanah di bawah kakimu (<strong>gradien</strong>).
                Jika kamu mengambil langkah yang pas, kamu akan stabil tiba di dasar lembah. Namun jika langkahmu terlalu besar (<strong>learning rate berlebih</strong>), kamu bisa melompat terlalu jauh dan terlempar melewati dasar lembah!
              </p>
            }
            mathText={
              <p>
                Fungsi loss kuadratik <span className="font-mono font-semibold text-blue-700">L(w) = (w - 3)² + 1</span> memiliki titik stasioner minimum global di <span className="font-mono font-semibold text-emerald-700">w = 3</span> dengan nilai minimum <span className="font-mono font-semibold text-slate-800">1</span>.
                Gradien <span className="font-mono font-semibold text-rose-700">dL/dw = 2(w - 3)</span> menunjukkan arah kenaikan tertajam. Oleh karena itu, kita mengurangkan bobot dengan arah gradien dikalikan koefisien <span className="font-mono font-semibold text-amber-700">α</span> agar bergerak menuju nilai minimum.
              </p>
            }
            keyTakeaway="Learning rate (α) mengatur kompromi antara kecepatan konvergensi dan kestabilan. Terlalu kecil lambat sampai, terlalu besar menyebabkan osilasi atau divergen (overshooting)."
          />
        </div>
      </div>
    </div>
  );
}
