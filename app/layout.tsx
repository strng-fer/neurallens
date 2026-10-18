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
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-8 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              NeuralLens (c) 2026. Platform edukasi interaktif Machine Learning & CNN berbasis simulasi client-side.
            </span>
            <span className="text-slate-600 font-mono">
              Siap Dipublikasikan ke Vercel (Zero-Config)
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
