import { GradientDescentBehavior, GradientPoint } from '@/types/simulation';

/**
 * Loss function: L(w) = (w - 3)^2 + 1
 * Optimum at w = 3, L(3) = 1
 */
export function calculateLoss(w: number): number {
  return Math.pow(w - 3, 2) + 1;
}

/**
 * Gradient: dL/dw = 2 * (w - 3)
 */
export function calculateGradient(w: number): number {
  return 2 * (w - 3);
}

/**
 * Single Gradient Descent Step
 * w_new = w - alpha * (dL/dw)
 */
export function takeGradientStep(
  currentW: number,
  learningRate: number
): {
  newW: number;
  newLoss: number;
  gradient: number;
  stepDelta: number;
  behavior: GradientDescentBehavior;
} {
  const gradient = calculateGradient(currentW);
  const stepDelta = learningRate * gradient;
  const newW = currentW - stepDelta;
  const newLoss = calculateLoss(newW);

  // Analyze behavior based on learning rate & loss change
  let behavior: GradientDescentBehavior = 'normal';

  if (learningRate >= 1.0) {
    // For f(w) = (w-3)^2 + 1, dL/dw = 2(w-3)
    // w_{t+1} - 3 = (1 - 2*alpha)(w_t - 3)
    // If alpha = 1.0, 1 - 2*alpha = -1 (oscillates indefinitely)
    // If alpha > 1.0, |1 - 2*alpha| > 1 (diverges / overshoots heavily)
    behavior = 'overshooting';
  } else if (learningRate <= 0.08) {
    behavior = 'slow';
  } else {
    behavior = 'normal';
  }

  return {
    newW: Number(newW.toFixed(4)),
    newLoss: Number(newLoss.toFixed(4)),
    gradient: Number(gradient.toFixed(4)),
    stepDelta: Number(stepDelta.toFixed(4)),
    behavior,
  };
}

/**
 * Generates sample points for rendering the 2D valley curve
 */
export function generateLossCurve(minW = -1.5, maxW = 7.5, step = 0.1): GradientPoint[] {
  const points: GradientPoint[] = [];
  for (let w = minW; w <= maxW; w += step) {
    points.push({
      w: Number(w.toFixed(2)),
      loss: Number(calculateLoss(w).toFixed(4)),
    });
  }
  return points;
}

/**
 * Tangent line endpoints for SVG visualization centered at w
 */
export function getTangentLine(w: number, length = 1.2): { x1: number; y1: number; x2: number; y2: number } {
  const slope = calculateGradient(w);
  const y = calculateLoss(w);
  const dx = length / Math.sqrt(1 + slope * slope);
  const dy = slope * dx;

  return {
    x1: w - dx,
    y1: y - dy,
    x2: w + dx,
    y2: y + dy,
  };
}
