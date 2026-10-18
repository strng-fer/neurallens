export type LearningMode = 'intuition' | 'math';

export type ModuleId = 1 | 2 | 3 | 4;

export type SimulationSpeed = 0.5 | 1 | 2;

export type SimulationStatus = 'ready' | 'running' | 'paused' | 'step_complete' | 'completed';

// Module 1 Types
export type GradientDescentBehavior = 'normal' | 'slow' | 'overshooting';

export interface GradientPoint {
  w: number;
  loss: number;
}

export interface GradientDescentState {
  w: number;
  loss: number;
  gradient: number;
  stepCount: number;
  learningRate: number;
  history: GradientPoint[];
  behaviorStatus: GradientDescentBehavior;
}

// Module 2 Types
export type ActivationFunctionType = 'step' | 'sigmoid' | 'relu';

export interface WeatherDataPoint {
  x1: number; // Kelembaban (0 - 1)
  x2: number; // Ketebalan Awan (0 - 1)
  label: 'cerah' | 'hujan';
}

export interface PerceptronState {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  b: number;
  activation: ActivationFunctionType;
  z: number; // w1*x1 + w2*x2 + b
  output: number;
  predictedClass: 'cerah' | 'hujan';
}

// Module 3 Types
export type MLPPhase = 'idle' | 'forward' | 'error' | 'backprop';

export interface MLPNode {
  id: string;
  layer: number;
  index: number;
  activation: number;
  rawZ: number;
  errorSignal?: number;
}

export interface MLPEdge {
  id: string;
  from: string;
  to: string;
  fromLayer: number;
  fromIndex: number;
  toLayer: number;
  toIndex: number;
  weight: number;
  deltaWeight?: number;
}

export interface MLPState {
  nodes: MLPNode[][];
  edges: MLPEdge[];
  inputs: [number, number, number];
  targets: [number, number];
  predictions: [number, number];
  loss: number;
  phase: MLPPhase;
  epoch: number;
  lossHistory: number[];
  selectedNodeId: string | null;
}

// Module 4 Types
export type CNNKernelPreset = 'vertical' | 'horizontal' | 'edge';

export type CNNImagePreset = 'digit1' | 'digit2' | 'digit3' | 'digit4' | 'digit5';

export interface CNNStepDetail {
  step: number; // 0 to 35
  row: number; // 0 to 5
  col: number; // 0 to 5
  subGrid: number[][]; // 3x3
  kernel: number[][]; // 3x3
  multiplications: number[][]; // 3x3 dot products
  dotSum: number;
  reluValue: number;
}

export interface DigitPrediction {
  label: string;
  digit: number;
  probability: number;
}

export interface CNNState {
  inputImage: number[][]; // 8x8
  kernel: number[][]; // 3x3
  currentStep: number; // 0..35
  featureMap: (number | null)[][]; // 6x6
  pooledMap: (number | null)[][]; // 3x3
  flattened: number[]; // 9 values
  predictions: DigitPrediction[];
  isScanning: boolean;
}
