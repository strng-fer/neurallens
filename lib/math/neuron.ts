import { ActivationFunctionType } from '@/types/simulation';

/**
 * Weighted sum calculation: z = w1*x1 + w2*x2 + b
 */
export function calculateWeightedSum(x1: number, x2: number, w1: number, w2: number, b: number): number {
  return x1 * w1 + x2 * w2 + b;
}

/**
 * Activation function implementations
 */
export function activate(z: number, type: ActivationFunctionType): number {
  switch (type) {
    case 'step':
      return z >= 0 ? 1 : 0;
    case 'sigmoid':
      return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
    case 'relu':
      return Math.max(0, z);
    default:
      return z;
  }
}

/**
 * Classify output into binary label
 */
export function classifyOutput(output: number, type: ActivationFunctionType): 'cerah' | 'hujan' {
  if (type === 'step') {
    return output >= 0.5 ? 'hujan' : 'cerah';
  }
  if (type === 'sigmoid') {
    return output >= 0.5 ? 'hujan' : 'cerah';
  }
  // For ReLU, if activated value >= 0.5 it's classified as hujan
  return output >= 0.5 ? 'hujan' : 'cerah';
}

/**
 * Decision boundary calculation in coordinate space [0, 1] x [0, 1]
 * Boundary equation: w1*x1 + w2*x2 + b = 0
 * Returns two points (x1, x2) defining the line segment within [0, 1]
 */
export function getDecisionBoundaryLine(
  w1: number,
  w2: number,
  b: number
): { p1: [number, number]; p2: [number, number]; isValid: boolean } {
  const eps = 1e-6;
  const intersections: [number, number][] = [];

  // If both weights are nearly 0, no meaningful boundary exists
  if (Math.abs(w1) < eps && Math.abs(w2) < eps) {
    return { p1: [0, 0], p2: [1, 1], isValid: false };
  }

  // Check intersection with x1 = 0 => x2 = -b / w2
  if (Math.abs(w2) > eps) {
    const x2 = -b / w2;
    if (x2 >= 0 && x2 <= 1) intersections.push([0, x2]);
  }

  // Check intersection with x1 = 1 => x2 = -(w1 + b) / w2
  if (Math.abs(w2) > eps) {
    const x2 = -(w1 + b) / w2;
    if (x2 >= 0 && x2 <= 1) intersections.push([1, x2]);
  }

  // Check intersection with x2 = 0 => x1 = -b / w1
  if (Math.abs(w1) > eps) {
    const x1 = -b / w1;
    if (x1 >= 0 && x1 <= 1) {
      if (!intersections.some(([ix, iy]) => Math.abs(ix - x1) < eps && Math.abs(iy) < eps)) {
        intersections.push([x1, 0]);
      }
    }
  }

  // Check intersection with x2 = 1 => x1 = -(w2 + b) / w1
  if (Math.abs(w1) > eps) {
    const x1 = -(w2 + b) / w1;
    if (x1 >= 0 && x1 <= 1) {
      if (!intersections.some(([ix, iy]) => Math.abs(ix - x1) < eps && Math.abs(iy - 1) < eps)) {
        intersections.push([x1, 1]);
      }
    }
  }

  if (intersections.length >= 2) {
    return {
      p1: intersections[0],
      p2: intersections[1],
      isValid: true,
    };
  }

  // Fallback: draw clamped boundary through center
  if (Math.abs(w2) > eps) {
    return {
      p1: [0, Math.max(0, Math.min(1, -b / w2))],
      p2: [1, Math.max(0, Math.min(1, -(w1 + b) / w2))],
      isValid: true,
    };
  } else {
    const x = Math.max(0, Math.min(1, -b / w1));
    return {
      p1: [x, 0],
      p2: [x, 1],
      isValid: true,
    };
  }
}
