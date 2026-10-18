'use client';

import React from 'react';
import { useLearningStore } from '@/store/learning-mode-store';
import { MODULES_METADATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ModuleId } from '@/types/simulation';

export function ModuleStepper({ className }: { className?: string }) {
  const { activeModule, setActiveModule } = useLearningStore();

  return (
    <nav
      aria-label="Tahapan Modul Pembelajaran"
      className={cn('w-full overflow-x-auto py-1', className)}
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex min-w-max items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md"
      >
        {MODULES_METADATA.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              role="tab"
              id={`tab-module-${mod.id}`}
              aria-controls={`panel-module-${mod.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveModule(mod.id as ModuleId)}
              className={cn(
                'group flex min-h-[44px] items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
                isActive
                  ? 'border border-cyan-500/40 bg-cyan-950/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:border-slate-700/60 hover:bg-slate-800/50 hover:text-slate-200'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] font-bold',
                  isActive
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                )}
              >
                {mod.number}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-semibold">{mod.shortTitle}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden md:inline">
                  {mod.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
