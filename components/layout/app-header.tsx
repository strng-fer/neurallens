'use client';

import React from 'react';
import { ModuleStepper } from './module-stepper';
import { LearningModeToggle } from './learning-mode-toggle';
import { Network } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Top Row: Brand & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-600 shadow-xs">
              <Network className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Neural<span className="text-blue-600">Lens</span>
                </span>
                <span className="rounded-full border border-blue-200 bg-blue-50/80 px-2 py-0.5 text-[10px] font-mono font-medium text-blue-700">
                  v1.0 Edu
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Visualisasi Interaktif Machine Learning & Deep Learning untuk Pemula
              </p>
            </div>
          </div>

          {/* Global Mode Toggle Switch */}
          <div className="flex items-center">
            <LearningModeToggle />
          </div>
        </div>

        {/* Bottom Row: 4 Modules Navigation Tabs */}
        <div className="w-full">
          <ModuleStepper />
        </div>
      </div>
    </header>
  );
}
