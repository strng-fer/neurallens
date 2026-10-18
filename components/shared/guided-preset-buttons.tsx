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
        'rounded-xl border border-slate-200/80 bg-white/80 p-3.5 backdrop-blur-md shadow-xs',
        className
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
        <Sparkles className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
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
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
              preset.isActive
                ? 'border-blue-400 bg-blue-50/80 text-blue-900 shadow-xs ring-1 ring-blue-300'
                : 'border-slate-200/80 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
              {preset.label}
            </span>
            <span className="mt-1 text-[11px] leading-tight text-slate-500">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
