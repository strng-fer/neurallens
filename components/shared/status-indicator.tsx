'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Clock, Activity, PauseCircle } from 'lucide-react';

export type StatusVariant = 'ready' | 'running' | 'paused' | 'success' | 'warning' | 'info';

interface StatusIndicatorProps {
  status: string;
  variant?: StatusVariant;
  description?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  variant = 'info',
  description,
  className,
}: StatusIndicatorProps) {
  const config = {
    ready: {
      border: 'border-slate-700',
      bg: 'bg-slate-900/80',
      text: 'text-slate-300',
      icon: <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />,
    },
    running: {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-300',
      icon: <Activity className="h-4 w-4 text-cyan-400 animate-pulse" aria-hidden="true" />,
    },
    paused: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/40',
      text: 'text-amber-300',
      icon: <PauseCircle className="h-4 w-4 text-amber-400" aria-hidden="true" />,
    },
    success: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
    },
    warning: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" aria-hidden="true" />,
    },
    info: {
      border: 'border-cyan-800/40',
      bg: 'bg-slate-900',
      text: 'text-slate-200',
      icon: <Clock className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
    },
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all',
        config.border,
        config.bg,
        config.text,
        className
      )}
      role="status"
    >
      {config.icon}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="font-semibold">{status}</span>
        {description && (
          <span className="text-[11px] text-slate-400 font-normal">
            ({description})
          </span>
        )}
      </div>
    </div>
  );
}
