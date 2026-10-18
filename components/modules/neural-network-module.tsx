'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  createInitialMLPState,
  forwardPass,
  backpropagate,
} from '@/lib/math/neural-network';
import { MLPState, MLPNode } from '@/types/simulation';
import { useLearningStore } from '@/store/learning-mode-store';
import { SimulationControls } from '@/components/shared/simulation-controls';
import { ConceptCard } from '@/components/shared/concept-card';
import { InteractiveEquation } from '@/components/shared/interactive-equation';
import { StatusIndicator, StatusVariant } from '@/components/shared/status-indicator';
import { GuidedPresetButtons, GuidedPreset } from '@/components/shared/guided-preset-buttons';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, Network, Target, CheckCircle } from 'lucide-react';

export function NeuralNetworkModule() {
  const { simulationSpeed, highlightedSymbol } = useLearningStore();

  const [mlpState, setMlpState] = useState<MLPState>(() => createInitialMLPState());
  const [isAutoTraining, setIsAutoTraining] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<MLPNode | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'forward' | 'error' | 'backprop'>('idle');

  const trainTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger single forward pass
  const handleForwardPass = useCallback(() => {
    setAnimationPhase('forward');
    setMlpState((prev) => forwardPass(prev));
    setTimeout(() => {
      setAnimationPhase('error');
    }, Math.round(500 / simulationSpeed));
  }, [simulationSpeed]);

  // Trigger single backprop step
  const handleBackprop = useCallback(() => {
    setAnimationPhase('backprop');
    setMlpState((prev) => backpropagate(prev, 0.4));
    setTimeout(() => {
      setAnimationPhase('idle');
    }, Math.round(500 / simulationSpeed));
  }, [simulationSpeed]);

  // Full cycle step
  const handleFullStep = useCallback(() => {
    handleForwardPass();
    setTimeout(() => {
      handleBackprop();
    }, Math.round(600 / simulationSpeed));
  }, [handleForwardPass, handleBackprop, simulationSpeed]);

  // Reset network
  const handleReset = useCallback(() => {
    setIsAutoTraining(false);
    if (trainTimerRef.current) clearInterval(trainTimerRef.current);
    const fresh = createInitialMLPState();
    setMlpState(fresh);
    setSelectedNode(null);
    setAnimationPhase('idle');
  }, []);

  // Auto-train loop
  useEffect(() => {
    if (isAutoTraining) {
      const intervalMs = Math.round(650 / simulationSpeed);
      trainTimerRef.current = setInterval(() => {
        setMlpState((prev) => {
          if (prev.loss < 0.01 || prev.epoch >= 100) {
            setIsAutoTraining(false);
            return prev;
          }
          return backpropagate(prev, 0.35);
        });
      }, intervalMs);
    } else {
      if (trainTimerRef.current) clearInterval(trainTimerRef.current);
    }

    return () => {
      if (trainTimerRef.current) clearInterval(trainTimerRef.current);
    };
  }, [isAutoTraining, simulationSpeed]);

  // Node position coordinates for SVG (width 620, height 320)
  const layerX = [90, 310, 520];
  const getNodePos = (layer: number, index: number, totalInLayer: number) => {
    const x = layerX[layer];
    const totalHeight = 240;
    const startY = 40 + (240 - (totalInLayer - 1) * 60) / 2;
    const y = startY + index * 60;
    return { x, y };
  };

  // Node counts
  const layerCounts = [3, 4, 2];

  // Determine status
  let statusText = 'Jaringan Siap';
  let statusVariant: StatusVariant = 'ready';
  let statusDesc = 'Kirim sinyal maju (Forward) atau mulai latih jaringan';

  if (mlpState.loss <= 0.02) {
    statusText = 'Jaringan Sangat Terlatih (Konvergen)';
    statusVariant = 'success';
    statusDesc = `Nilai galat Loss sangat kecil (E = ${mlpState.loss.toFixed(4)})`;
  } else if (isAutoTraining) {
    statusText = `Proses Belajar Berlangsung (Epoch ${mlpState.epoch})`;
    statusVariant = 'running';
    statusDesc = `Loss saat ini: ${mlpState.loss.toFixed(4)}`;
  } else if (animationPhase === 'forward') {
    statusText = 'Forward Pass: Sinyal Mengalir Maju';
    statusVariant = 'info';
    statusDesc = 'Input dikalikan bobot menuju layer tersembunyi hingga output';
  } else if (animationPhase === 'backprop') {
    statusText = 'Backpropagation: Memperbaiki Bobot';
    statusVariant = 'warning';
    statusDesc = 'Gelombang koreksi memperbarui ketebalan garis bobot';
  }

  // Guided presets
  const presets: GuidedPreset[] = [
    {
      id: 'single_cycle',
      label: '1. Satu Siklus Belajar Penuh',
      description: 'Jalankan 1 kali Forward Pass -> Hitung Error -> Backpropagation.',
      onApply: () => {
        handleFullStep();
      },
    },
    {
      id: 'train_10',
      label: '2. Latih Otomatis 10 Epoch',
      description: 'Biarkan jaringan belajar mandiri dan saksikan grafik loss menurun.',
      isActive: isAutoTraining,
      onApply: () => {
        setIsAutoTraining(true);
      },
    },
    {
      id: 'change_target',
      label: '3. Ubah Target ke [0, 1]',
      description: 'Tantang jaringan untuk belajar mengenali pola keluaran kebalikannya.',
      isActive: mlpState.targets[0] === 0.0 && mlpState.targets[1] === 1.0,
      onApply: () => {
        setMlpState((prev) => ({
          ...prev,
          targets: [0.0, 1.0],
          phase: 'idle',
        }));
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 border border-cyan-800/60">
            Modul 03
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Jaringan Saraf Tiruan (Multi-Layer Perceptron & Backpropagation)
          </h2>
        </div>
        <p className="text-sm text-slate-300">
          Memvisualisasikan arsitektur jaringan berlapis (3 Input, 4 Hidden, 2 Output). Lihat bagaimana sinyal mengalir maju (Forward Pass) dan bagaimana gelombang koreksi (Backpropagation) memperbaiki bobot jaringan.
        </p>
      </div>

      {/* Guided Presets */}
      <GuidedPresetButtons presets={presets} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Network SVG + Particle Animations */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Visualisasi Interaktif Multi-Layer Perceptron (3-4-2)
                </h3>
              </div>
              <StatusIndicator
                status={statusText}
                variant={statusVariant}
                description={statusDesc}
              />
            </div>

            {/* SVG Interactive Network */}
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950 p-2">
              <svg
                viewBox="0 0 620 320"
                className="h-auto w-full select-none"
                role="img"
                aria-label="Diagram SVG Jaringan Saraf 3 Layer dengan partikel sinyal dan node menyala"
              >
                <defs>
                  <filter id="mlpGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Layer Labels */}
                <text x={layerX[0]} y={24} fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Input Layer (3)
                </text>
                <text x={layerX[1]} y={24} fill="#06B6D4" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Hidden Layer (4)
                </text>
                <text x={layerX[2]} y={24} fill="#F59E0B" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Output Layer (2)
                </text>

                {/* Edges / Connections */}
                {mlpState.edges.map((edge) => {
                  const fromPos = getNodePos(edge.fromLayer, edge.fromIndex, layerCounts[edge.fromLayer]);
                  const toPos = getNodePos(edge.toLayer, edge.toIndex, layerCounts[edge.toLayer]);

                  const isConnectedToSelected =
                    selectedNode &&
                    ((selectedNode.layer === edge.fromLayer && selectedNode.index === edge.fromIndex) ||
                      (selectedNode.layer === edge.toLayer && selectedNode.index === edge.toIndex));

                  const isPositive = edge.weight >= 0;
                  const strokeColor = isPositive ? '#06B6D4' : '#F43F5E';
                  const thickness = Math.max(1.2, Math.min(6, Math.abs(edge.weight) * 2.8));

                  return (
                    <g key={edge.id}>
                      <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke={strokeColor}
                        strokeWidth={isConnectedToSelected ? thickness + 2 : thickness}
                        strokeOpacity={
                          selectedNode
                            ? isConnectedToSelected
                              ? 1
                              : 0.15
                            : animationPhase === 'backprop'
                            ? 0.9
                            : 0.45
                        }
                      />

                      {/* Animated Particle during Forward Pass */}
                      {animationPhase === 'forward' && (
                        <circle r="3" fill="#FDE047">
                          <animateMotion
                            path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                            dur={`${0.6 / simulationSpeed}s`}
                            repeatCount="1"
                          />
                        </circle>
                      )}

                      {/* Animated Pulse wave during Backpropagation */}
                      {animationPhase === 'backprop' && (
                        <circle r="3.5" fill="#F43F5E">
                          <animateMotion
                            path={`M ${toPos.x} ${toPos.y} L ${fromPos.x} ${fromPos.y}`}
                            dur={`${0.6 / simulationSpeed}s`}
                            repeatCount="1"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Nodes rendering */}
                {mlpState.nodes.map((layer, lIdx) =>
                  layer.map((node, nIdx) => {
                    const pos = getNodePos(lIdx, nIdx, layerCounts[lIdx]);
                    const isSelected = selectedNode?.id === node.id;

                    // Node fill color based on layer and activation intensity
                    let fillColor = '#0F172A';
                    let strokeColor = '#334155';

                    if (lIdx === 0) {
                      fillColor = '#064E3B';
                      strokeColor = '#10B981';
                    } else if (lIdx === 1) {
                      fillColor = '#083344';
                      strokeColor = '#06B6D4';
                    } else {
                      fillColor = '#451A03';
                      strokeColor = '#F59E0B';
                    }

                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        className="cursor-pointer transition-all"
                        role="button"
                        tabIndex={0}
                        aria-label={`Node ${node.id}, aktivasi ${node.activation.toFixed(2)}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedNode(isSelected ? null : node);
                          }
                        }}
                      >
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 22 : 18}
                          fill={fillColor}
                          stroke={isSelected ? '#67E8F9' : strokeColor}
                          strokeWidth={isSelected ? 3 : 2}
                          filter={isSelected ? 'url(#mlpGlow)' : undefined}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          fill="#FFFFFF"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {node.activation.toFixed(2)}
                        </text>
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* Network Legend */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-5 rounded bg-cyan-400 inline-block" />
                  <span>Bobot Positif (+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-5 rounded bg-rose-500 inline-block" />
                  <span>Bobot Negatif (-)</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Ketebalan garis = besar nilai absolut |w|. Klik lingkaran node untuk melihat detail.
              </div>
            </div>
          </div>

          {/* Target vs Prediction Error Comparison */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <h3 className="mb-2 text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span>Perbandingan Tebakan Jaringan vs Target Sebenarnya</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Output 0 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Output 1 (y₀)</span>
                  <span className="font-mono text-cyan-300">Target: {mlpState.targets[0].toFixed(1)}</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Prediksi:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {mlpState.predictions[0].toFixed(3)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, mlpState.predictions[0] * 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-rose-400 font-mono">
                    Galat: {Math.abs(mlpState.targets[0] - mlpState.predictions[0]).toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Output 1 */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Output 2 (y₁)</span>
                  <span className="font-mono text-cyan-300">Target: {mlpState.targets[1].toFixed(1)}</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Prediksi:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {mlpState.predictions[1].toFixed(3)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, mlpState.predictions[1] * 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-rose-400 font-mono">
                    Galat: {Math.abs(mlpState.targets[1] - mlpState.predictions[1]).toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Training Controls, Loss Progress & Detail Node Card */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {/* Action Control Panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Kontrol Siklus Belajar
            </h4>

            {/* Individual Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleForwardPass}
                disabled={isAutoTraining}
                className={cn(
                  'flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-cyan-700/60 bg-cyan-950/40 px-3 py-2 text-xs font-semibold text-cyan-200 transition-all',
                  'hover:bg-cyan-900/50 hover:text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                  isAutoTraining && 'opacity-40 cursor-not-allowed'
                )}
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Forward Pass</span>
              </button>

              <button
                type="button"
                onClick={handleBackprop}
                disabled={isAutoTraining}
                className={cn(
                  'flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-rose-700/60 bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-200 transition-all',
                  'hover:bg-rose-900/50 hover:text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400',
                  isAutoTraining && 'opacity-40 cursor-not-allowed'
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Backprop</span>
              </button>
            </div>

            {/* Auto-Train Bar */}
            <SimulationControls
              isRunning={isAutoTraining}
              onPlayPause={() => setIsAutoTraining((prev) => !prev)}
              onStep={handleFullStep}
              onReset={handleReset}
              stepLabel="1 Siklus Penuh"
            />
          </div>

          {/* Loss Convergence History Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Penurunan Loss (MSE)</span>
              <span className="font-mono text-amber-300">Epoch: {mlpState.epoch}</span>
            </div>

            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-cyan-400">
                {mlpState.loss.toFixed(4)}
              </span>
              <span className="text-xs text-slate-400">
                {mlpState.loss < 0.05 ? 'Hampir Sempurna!' : 'Sedang Belajar...'}
              </span>
            </div>

            {/* Simple Sparkline SVG of Loss History */}
            <div className="h-20 w-full rounded-lg border border-slate-800 bg-slate-950 p-1.5">
              <svg viewBox="0 0 200 60" className="h-full w-full" preserveAspectRatio="none">
                {mlpState.lossHistory.length > 1 && (
                  <path
                    d={mlpState.lossHistory.reduce((acc, l, idx) => {
                      const x = (idx / (mlpState.lossHistory.length - 1)) * 200;
                      const y = 55 - Math.min(50, Math.max(5, (l / 0.6) * 50));
                      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                    }, '')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Selected Node Details Card */}
          {selectedNode ? (
            <div className="rounded-xl border border-cyan-500/50 bg-cyan-950/20 p-4 backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300">
                  Detail Node Terpilih: {selectedNode.id}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>
                  Layer: <strong className="text-white">{selectedNode.layer === 0 ? 'Input' : selectedNode.layer === 1 ? 'Hidden' : 'Output'}</strong>
                </div>
                <div>
                  Aktivasi saat ini: <strong className="font-mono text-amber-300">{selectedNode.activation.toFixed(4)}</strong>
                </div>
                <div>
                  Nilai sebelum aktivasi (z): <strong className="font-mono text-cyan-300">{selectedNode.rawZ.toFixed(4)}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center text-xs text-slate-400">
              Petunjuk: Klik salah satu node lingkaran di atas untuk menyorot jalur koneksi yang terhubung langsung.
            </div>
          )}

          {/* Mathematical Equations */}
          <InteractiveEquation
            title="Rumus Siklus Maju & Mundur"
            latex="h_j = \sigma\left(\sum x_i W_{ij}\right) \quad \longleftrightarrow \quad \Delta W = -\eta \cdot \frac{\partial E}{\partial W}"
            variableMap={[
              { symbol: 'σ', label: 'Sigmoid activation', color: '#F59E0B' },
              { symbol: 'W', label: 'Bobot koneksi', color: '#06B6D4' },
              { symbol: 'E', label: 'Loss MSE', value: mlpState.loss.toFixed(3), color: '#10B981' },
            ]}
          />

          {/* Concept Card */}
          <ConceptCard
            title="Konsep: Bagaimana Jaringan Saraf Belajar"
            intuitionText={
              <p>
                Bayangkan sebuah tim pembuat animasi film: <strong>Input Layer</strong> mengumpulkan sketsa awal, <strong>Hidden Layer</strong> menggambar detail frame, dan <strong>Output Layer</strong> memperlihatkan hasil akhir kepada penonton.
                Saat penonton memberi kritik (<strong>Error</strong>), sutradara mengirim masukan balik dari belakang ke depan (<strong>Backpropagation</strong>). Anggota tim yang berkontribusi salah akan dikurangi bobotnya, sedangkan yang berkontribusi benar akan diperkuat!
              </p>
            }
            mathText={
              <p>
                Proses pembelajaran mengoptimalkan bobot melalui aturan rantai kalkulus multivariat (<span className="text-cyan-300">Chain Rule</span>).
                Forward pass menghitung keluaran deterministik <span className="font-mono">y = f(W₂ · f(W₁x))</span>.
                Fase koreksi menghitung turunan parsial galat kuadratik <span className="font-mono">∂E/∂W</span> dan memperbarui parameter dengan laju belajar <span className="font-mono text-amber-300">η</span>.
              </p>
            }
            keyTakeaway="Backpropagation mendistribusikan tanggung jawab kesalahan (error attribution) ke setiap bobot secara proporsional dari layer output mundur hingga ke input."
          />
        </div>
      </div>
    </div>
  );
}
