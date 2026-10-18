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
        'rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md transition-colors',
        className
      )}
    >
      {title && (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <span>{title}</span>
          <span className="text-[11px] text-cyan-400 font-mono">Mode Rumus Interaktif</span>
        </div>
      )}

      {/* Main LaTeX equation */}
      <div
        className="overflow-x-auto py-2 text-center text-slate-100 focus-visible:outline-none"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      {/* Interactive Variable Chips */}
      {variableMap.length > 0 && (
        <div className="mt-3 border-t border-slate-800/80 pt-3">
          <div className="mb-1.5 text-[11px] font-medium text-slate-400">
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
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Sorot variabel ${item.label} (${item.symbol})`}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: item.color || '#06B6D4' }}
                  >
                    {item.symbol}
                  </span>
                  <span className="text-slate-400 font-sans text-[11px]">:</span>
                  <span className="text-slate-200 font-sans">{item.label}</span>
                  {item.value !== undefined && (
                    <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-300">
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
