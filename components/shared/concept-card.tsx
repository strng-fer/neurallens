'use client';

import React from 'react';
import { useLearningStore } from '@/store/learning-mode-store';
import { cn } from '@/lib/utils';
import { Lightbulb, Calculator } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  intuitionText: React.ReactNode;
  mathText: React.ReactNode;
  keyTakeaway?: string;
  className?: string;
}

export function ConceptCard({
  title,
  intuitionText,
  mathText,
  keyTakeaway,
  className,
}: ConceptCardProps) {
  const { mode } = useLearningStore();
  const isIntuition = mode === 'intuition';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md transition-all',
        className
      )}
    >
      {/* Header bar with Mode Badge */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-100 text-sm tracking-wide flex items-center gap-2">
          {isIntuition ? (
            <Lightbulb className="h-4 w-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Calculator className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          )}
          <span>{title}</span>
        </h3>

        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border',
            isIntuition
              ? 'border-amber-500/30 bg-amber-950/40 text-amber-300'
              : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300'
          )}
        >
          <span>{isIntuition ? 'Mode Intuisi' : 'Mode Matematika'}</span>
        </div>
      </div>

      {/* Main explanation content */}
      <div className="text-sm leading-relaxed text-slate-300">
        {isIntuition ? intuitionText : mathText}
      </div>

      {/* Optional key takeaway footer */}
      {keyTakeaway && (
        <div className="mt-4 rounded-lg border border-slate-800/90 bg-slate-950/60 p-3 text-xs text-slate-400">
          <strong className="text-slate-200">Kunci Pemahaman: </strong>
          {keyTakeaway}
        </div>
      )}
    </div>
  );
}
