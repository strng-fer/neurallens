'use client';

import React from 'react';
import { useLearningStore } from '@/store/learning-mode-store';
import { GradientDescentModule } from '@/components/modules/gradient-descent-module';
import { SingleNeuronModule } from '@/components/modules/single-neuron-module';
import { NeuralNetworkModule } from '@/components/modules/neural-network-module';
import { CNNVisualizerModule } from '@/components/modules/cnn-visualizer-module';

export default function Home() {
  const { activeModule } = useLearningStore();

  return (
    <div className="w-full pb-16">
      {/* Dynamic Module Tabpanel */}
      <section
        role="tabpanel"
        id={`panel-module-${activeModule}`}
        aria-labelledby={`tab-module-${activeModule}`}
        className="w-full focus-visible:outline-none"
      >
        {activeModule === 1 && <GradientDescentModule />}
        {activeModule === 2 && <SingleNeuronModule />}
        {activeModule === 3 && <NeuralNetworkModule />}
        {activeModule === 4 && <CNNVisualizerModule />}
      </section>
    </div>
  );
}
