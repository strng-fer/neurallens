'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { useLearningStore } from '@/store/learning-mode-store';
import { cn } from '@/lib/utils';

interface InteractiveEquationProps {
  latex: string;
  variableMap?: {
    symbol: string;
    label: string;
    value?: string | number;
    color?: string;
  }[];
  className?: string;
  title?: string;
}

export function InteractiveEquation({
  latex,
  variableMap = [],
  className,
  title,
}: InteractiveEquationProps) {
  const { highlightedSymbol, setHighlightedSymbol } = useLearningStore();

  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  }, [latex]);

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-xs transition-colors',
        className
      )}
    >
      {title && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <span>{title}</span>
          <span className="text-[11px] text-blue-600 font-mono font-medium">Mode Rumus Interaktif</span>
        </div>
      )}

      {/* Main LaTeX equation */}
      <div
        className="overflow-x-auto py-2 text-center text-slate-900 focus-visible:outline-none"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      {/* Interactive Variable Chips */}
      {variableMap.length > 0 && (
        <div className="mt-3 border-t border-slate-200/80 pt-3">
          <div className="mb-1.5 text-[11px] font-medium text-slate-500">
            Arahkan kursor atau fokus pada variabel untuk menyorot elemen visual:
          </div>
          <div className="flex flex-wrap gap-2">
            {variableMap.map((item) => {
              const isSelected = highlightedSymbol === item.symbol;
              return (
                <button
                  key={item.symbol}
                  type="button"
                  onMouseEnter={() => setHighlightedSymbol(item.symbol)}
                  onMouseLeave={() => setHighlightedSymbol(null)}
                  onFocus={() => setHighlightedSymbol(item.symbol)}
                  onBlur={() => setHighlightedSymbol(null)}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
                    isSelected
                      ? 'border-blue-400 bg-blue-50 text-blue-900 ring-2 ring-blue-300 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Sorot variabel ${item.label} (${item.symbol})`}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: item.color || '#2563EB' }}
                  >
                    {item.symbol}
                  </span>
                  <span className="text-slate-400 font-sans text-[11px]">:</span>
                  <span className="text-slate-800 font-sans">{item.label}</span>
                  {item.value !== undefined && (
                    <span className="ml-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800">
                      {item.value}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
