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
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md',
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
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
            isRunning
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:bg-cyan-600',
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
            'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition-all',
            'hover:border-slate-600 hover:bg-slate-700 hover:text-white active:bg-slate-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
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
            'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-300 transition-all',
            'hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-800/90 bg-slate-950/70 p-1">
        <span className="flex items-center gap-1 px-2 text-xs font-medium text-slate-400">
          <Gauge className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
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
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                isCurrent
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
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
