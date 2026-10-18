'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useLearningStore } from '@/store/learning-mode-store';

interface ParameterSliderProps {
  id: string;
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  color?: string;
  tooltip?: string;
  className?: string;
}

export function ParameterSlider({
  id,
  label,
  symbol,
  value,
  min,
  max,
  step = 0.01,
  unit = '',
  onChange,
  color = '#06B6D4',
  tooltip,
  className,
}: ParameterSliderProps) {
  const { highlightedSymbol, setHighlightedSymbol } = useLearningStore();
  const isHighlighted = symbol && highlightedSymbol === symbol;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all',
        isHighlighted
          ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700/80',
        className
      )}
      onMouseEnter={() => symbol && setHighlightedSymbol(symbol)}
      onMouseLeave={() => symbol && setHighlightedSymbol(null)}
    >
      {/* Top Header: Label & Value */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300"
        >
          {symbol && (
            <span
              className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] font-bold"
              style={{ color }}
            >
              {symbol}
            </span>
          )}
          <span>{label}</span>
        </label>

        <span className="font-mono text-xs font-semibold text-slate-100">
          {value.toFixed(step < 0.1 ? 2 : 1)}
          {unit && <span className="ml-1 text-[11px] text-slate-400">{unit}</span>}
        </span>
      </div>

      {/* Slider Input */}
      <div className="relative flex items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onFocus={() => symbol && setHighlightedSymbol(symbol)}
          onBlur={() => symbol && setHighlightedSymbol(null)}
          aria-label={`${label} (${symbol || ''})`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400 transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          )}
        />
      </div>

      {/* Min and Max scale markers */}
      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{min}</span>
        {tooltip && <span className="text-slate-400 font-sans italic">{tooltip}</span>}
        <span>{max}</span>
      </div>
    </div>
  );
}
