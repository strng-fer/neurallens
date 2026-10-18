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
      border: 'border-slate-300',
      bg: 'bg-white/80',
      text: 'text-slate-700',
      icon: <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />,
    },
    running: {
      border: 'border-blue-300',
      bg: 'bg-blue-50/80',
      text: 'text-blue-900',
      icon: <Activity className="h-4 w-4 text-blue-600 animate-pulse" aria-hidden="true" />,
    },
    paused: {
      border: 'border-amber-300',
      bg: 'bg-amber-50/80',
      text: 'text-amber-900',
      icon: <PauseCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />,
    },
    success: {
      border: 'border-emerald-300',
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-900',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />,
    },
    warning: {
      border: 'border-rose-300',
      bg: 'bg-rose-50/80',
      text: 'text-rose-900',
      icon: <AlertTriangle className="h-4 w-4 text-rose-600" aria-hidden="true" />,
    },
    info: {
      border: 'border-sky-300',
      bg: 'bg-sky-50/80',
      text: 'text-sky-900',
      icon: <Clock className="h-4 w-4 text-sky-600" aria-hidden="true" />,
    },
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all shadow-xs',
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
          <span className="text-[11px] text-slate-500 font-normal">
            ({description})
          </span>
        )}
      </div>
    </div>
  );
}
