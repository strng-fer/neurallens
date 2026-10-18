'use client';

import React from 'react';
import { ModuleStepper } from './module-stepper';
import { LearningModeToggle } from './learning-mode-toggle';
import { Network } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Top Row: Brand & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Network className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  Neural<span className="text-cyan-400">Lens</span>
                </span>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  v1.0 Edu
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
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
