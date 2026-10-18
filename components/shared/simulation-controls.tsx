'use client';

import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react';
import { useLearningStore } from '@/store/learning-mode-store';
import { SimulationSpeed } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface SimulationControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  stepDisabled?: boolean;
  playDisabled?: boolean;
  className?: string;
  stepLabel?: string;
}

export function SimulationControls({
  isRunning,
  onPlayPause,
  onStep,
  onReset,
  stepDisabled = false,
  playDisabled = false,
  className,
  stepLabel = '1 Langkah',
}: SimulationControlsProps) {
  const { simulationSpeed, setSimulationSpeed } = useLearningStore();

  const speeds: SimulationSpeed[] = [0.5, 1, 2];

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-3 backdrop-blur-md shadow-xs',
        className
      )}
    >
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={onPlayPause}
          disabled={playDisabled}
          aria-label={isRunning ? 'Jeda simulasi' : 'Jalankan simulasi otomatis'}
          className={cn(
            'inline-flex min-h-[44px] min-w-[130px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            isRunning
              ? 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-xs'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs',
            playDisabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" />
              <span>Jeda (Pause)</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              <span>Jalan Otomatis</span>
            </>
          )}
        </button>

        {/* Step Button */}
        <button
          type="button"
          onClick={onStep}
          disabled={isRunning || stepDisabled}
          aria-label={`Jalankan ${stepLabel}`}
          className={cn(
            'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-all shadow-xs',
            'hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            (isRunning || stepDisabled) && 'cursor-not-allowed opacity-40'
          )}
        >
          <SkipForward className="h-4 w-4" aria-hidden="true" />
          <span>{stepLabel}</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          aria-label="Kembalikan simulasi ke kondisi awal"
          className={cn(
            'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all shadow-xs',
            'hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1">
        <span className="flex items-center gap-1 px-2 text-xs font-medium text-slate-600">
          <Gauge className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>Kecepatan:</span>
        </span>
        {speeds.map((s) => {
          const isCurrent = simulationSpeed === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSimulationSpeed(s)}
              aria-label={`Ubah kecepatan simulasi ke ${s} kali`}
              aria-pressed={isCurrent}
              className={cn(
                'min-h-[32px] min-w-[36px] rounded px-2 text-xs font-mono font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isCurrent
                  ? 'bg-white text-blue-800 border border-blue-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {s}x
            </button>
          );
        })}
      </div>
    </div>
  );
}
