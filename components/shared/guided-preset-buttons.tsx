'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GuidedPreset {
  id: string;
  label: string;
  description: string;
  onApply: () => void;
  isActive?: boolean;
}

interface GuidedPresetButtonsProps {
  presets: GuidedPreset[];
  title?: string;
  className?: string;
}

export function GuidedPresetButtons({
  presets,
  title = 'Skenario Eksperimen Cepat untuk Pemula:',
  className,
}: GuidedPresetButtonsProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md',
        className
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
        <span>{title}</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={preset.onApply}
            aria-pressed={preset.isActive}
            className={cn(
              'group flex flex-col items-start rounded-lg border p-2.5 text-left transition-all',
              'min-h-[44px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
              preset.isActive
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            )}
          >
            <span className="text-xs font-semibold group-hover:text-cyan-300 transition-colors">
              {preset.label}
            </span>
            <span className="mt-1 text-[11px] leading-tight text-slate-400">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
