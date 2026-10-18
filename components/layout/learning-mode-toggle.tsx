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
        'inline-flex items-center rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 shadow-xs',
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
          isIntuition
            ? 'bg-white text-amber-900 border border-amber-300 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        <Lightbulb className={cn('h-3.5 w-3.5', isIntuition ? 'text-amber-600' : 'text-slate-400')} aria-hidden="true" />
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          !isIntuition
            ? 'bg-white text-blue-900 border border-blue-300 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        <Calculator className={cn('h-3.5 w-3.5', !isIntuition ? 'text-blue-600' : 'text-slate-400')} aria-hidden="true" />
        <span>Mode Matematika (Rumus)</span>
      </button>
    </div>
  );
}
