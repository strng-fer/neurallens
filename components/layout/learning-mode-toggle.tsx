'use client';

import React from 'react';
import { useLearningStore } from '@/store/learning-mode-store';
import { cn } from '@/lib/utils';
import { Lightbulb, Calculator } from 'lucide-react';

export function LearningModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useLearningStore();
  const isIntuition = mode === 'intuition';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1 shadow-sm',
        className
      )}
      role="group"
      aria-label="Pilihan mode penjelasan"
    >
      {/* Mode Intuisi Option */}
      <button
        type="button"
        role="radio"
        aria-checked={isIntuition}
        onClick={() => setMode('intuition')}
        className={cn(
          'inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
          isIntuition
            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Lightbulb className={cn('h-3.5 w-3.5', isIntuition ? 'text-amber-400' : 'text-slate-500')} aria-hidden="true" />
        <span>Mode Intuisi (Analogi)</span>
      </button>

      {/* Mode Matematika Option */}
      <button
        type="button"
        role="radio"
        aria-checked={!isIntuition}
        onClick={() => setMode('math')}
        className={cn(
          'inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
          !isIntuition
            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Calculator className={cn('h-3.5 w-3.5', !isIntuition ? 'text-cyan-400' : 'text-slate-500')} aria-hidden="true" />
        <span>Mode Matematika (Rumus)</span>
      </button>
    </div>
  );
}
