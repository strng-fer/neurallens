import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/app-header';

export const metadata: Metadata = {
  title: 'NeuralLens: Visualisasi Interaktif Machine Learning & CNN untuk Pemula',
  description:
    'Platform edukasi interaktif untuk memahami konsep Machine Learning, Single Neuron, Backpropagation, dan Konvolusi CNN dari dasar matematika hingga simulasi visual.',
  keywords: [
    'Machine Learning',
    'Deep Learning',
    'CNN Visualizer',
    'Gradient Descent',
    'Neural Network',
    'Edukasi AI Pemula',
  ],
  authors: [{ name: 'NeuralLens Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              NeuralLens (c) 2026. Platform edukasi interaktif Machine Learning & CNN berbasis simulasi client-side.
            </span>
            <span className="text-slate-400 font-mono">
              Siap Dipublikasikan ke Vercel (Zero-Config)
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
