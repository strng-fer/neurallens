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
        className="flex min-w-max items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 p-1.5 backdrop-blur-md shadow-xs"
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
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
                isActive
                  ? 'border border-blue-200 bg-blue-50/90 text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:border-slate-200 hover:bg-slate-100/70 hover:text-slate-900'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] font-bold',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-800'
                )}
              >
                {mod.number}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-semibold">{mod.shortTitle}</span>
                <span className="text-[10px] text-slate-500 font-normal hidden md:inline">
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
