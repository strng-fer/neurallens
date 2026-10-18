import { CNNStepDetail } from '@/types/simulation';

/**
 * Extracts a 3x3 subgrid from an 8x8 image starting at top-left (r, c)
 */
export function extractSubGrid(image: number[][], r: number, c: number): number[][] {
  const sub: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const row: number[] = [];
    for (let j = 0; j < 3; j++) {
      row.push(image[r + i][c + j]);
    }
    sub.push(row);
  }
  return sub;
}

/**
 * Performs a single step of convolution at step index 0..35
 */
export function computeStepDetail(
  image: number[][],
  kernel: number[][],
  stepIndex: number
): CNNStepDetail {
  const row = Math.floor(stepIndex / 6);
  const col = stepIndex % 6;
  const subGrid = extractSubGrid(image, row, col);

  const multiplications: number[][] = [];
  let dotSum = 0;

  for (let i = 0; i < 3; i++) {
    const multRow: number[] = [];
    for (let j = 0; j < 3; j++) {
      const prod = subGrid[i][j] * kernel[i][j];
      multRow.push(Number(prod.toFixed(2)));
      dotSum += prod;
    }
    multiplications.push(multRow);
  }

  const reluValue = Math.max(0, dotSum);

  return {
    step: stepIndex,
    row,
    col,
    subGrid,
    kernel,
    multiplications,
    dotSum: Number(dotSum.toFixed(2)),
    reluValue: Number(reluValue.toFixed(2)),
  };
}

/**
 * Computes full 6x6 feature map up to a given step (or all 36 steps)
 */
export function computeFeatureMap(
  image: number[][],
  kernel: number[][],
  upToStep = 35
): (number | null)[][] {
  const map: (number | null)[][] = Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => null)
  );

  for (let s = 0; s <= upToStep; s++) {
    const r = Math.floor(s / 6);
    const c = s % 6;
    const detail = computeStepDetail(image, kernel, s);
    map[r][c] = detail.reluValue;
  }

  return map;
}

/**
 * Performs 2x2 Max Pooling with stride 2 over a 6x6 Feature Map
 * Produces a 3x3 Pooled Matrix
 */
export function computeMaxPooling(featureMap: (number | null)[][]): {
  pooledMap: (number | null)[][];
  highlightedBlocks: { br: number; bc: number; maxVal: number; maxPos: [number, number] }[];
} {
  const pooledMap: (number | null)[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => null)
  );
  const highlightedBlocks: {
    br: number;
    bc: number;
    maxVal: number;
    maxPos: [number, number];
  }[] = [];

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const rStart = br * 2;
      const cStart = bc * 2;

      let maxVal = -Infinity;
      let maxPos: [number, number] = [rStart, cStart];
      let hasComputed = false;

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          const val = featureMap[rStart + i][cStart + j];
          if (val !== null) {
            hasComputed = true;
            if (val > maxVal) {
              maxVal = val;
              maxPos = [rStart + i, cStart + j];
            }
          }
        }
      }

      if (hasComputed && maxVal !== -Infinity) {
        pooledMap[br][bc] = Number(maxVal.toFixed(2));
        highlightedBlocks.push({ br, bc, maxVal, maxPos });
      }
    }
  }

  return { pooledMap, highlightedBlocks };
}

/**
 * Flattens a 3x3 pooled map into a 1D vector of length 9
 */
export function flattenMap(pooledMap: (number | null)[][]): number[] {
  const vec: number[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      vec.push(pooledMap[r][c] ?? 0);
    }
  }
  return vec;
}

import { CNN_IMAGE_PRESETS } from '@/lib/constants';
import { DigitPrediction } from '@/types/simulation';

/**
 * Educational digit classification (digits 1 to 5) based on feature map and pixel overlap
 */
export function predictDigitClass(
  image: number[][],
  flattened: number[]
): DigitPrediction[] {
  const digits = [1, 2, 3, 4, 5] as const;

  // Calculate pixel match score against canonical 8x8 templates
  const scores = digits.map((d) => {
    const key = `digit${d}` as keyof typeof CNN_IMAGE_PRESETS;
    const template = CNN_IMAGE_PRESETS[key].grid;

    let matchCount = 0;
    let mismatchCount = 0;
    let templateOnCount = 0;
    let imageOnCount = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const imgVal = image[r][c];
        const tplVal = template[r][c];

        if (tplVal === 1) templateOnCount++;
        if (imgVal === 1) imageOnCount++;

        if (imgVal === 1 && tplVal === 1) {
          matchCount += 2.0; // True positive reward
        } else if (imgVal === 1 && tplVal === 0) {
          mismatchCount += 1.0; // False positive penalty
        } else if (imgVal === 0 && tplVal === 1) {
          mismatchCount += 0.8; // False negative penalty
        }
      }
    }

    // Structural feature bonuses from pooled map (flattened 9 values: 3x3)
    // indices:
    // [0, 1, 2] -> top
    // [3, 4, 5] -> middle
    // [6, 7, 8] -> bottom
    let structuralBonus = 0;
    if (d === 1) {
      // Digit 1 has high energy in central column (idx 1, 4, 7)
      const centerCol = (flattened[1] + flattened[4] + flattened[7]) / 3;
      const sideCols = (flattened[0] + flattened[2] + flattened[3] + flattened[5] + flattened[6] + flattened[8]) / 6;
      structuralBonus += (centerCol - sideCols) * 2;
    } else if (d === 2) {
      // Digit 2 has top and bottom horizontal bars
      structuralBonus += ((flattened[1] + flattened[7]) / 2) * 1.5;
    } else if (d === 3) {
      // Digit 3 has right-side energy (idx 2, 5, 8) and top/mid/bottom
      structuralBonus += ((flattened[2] + flattened[5] + flattened[8]) / 3) * 1.5;
    } else if (d === 4) {
      // Digit 4 has mid horizontal cross and vertical stem
      structuralBonus += ((flattened[3] + flattened[4] + flattened[5]) / 3) * 1.5;
    } else if (d === 5) {
      // Digit 5 has top bar and bottom-right curve
      structuralBonus += ((flattened[0] + flattened[1] + flattened[7] + flattened[8]) / 4) * 1.5;
    }

    const rawScore = matchCount - mismatchCount * 0.7 + structuralBonus;
    return {
      digit: d,
      label: `Angka ${d}`,
      raw: Math.max(0.1, rawScore),
    };
  });

  // Softmax normalization with scaling temperature
  const maxScore = Math.max(...scores.map((s) => s.raw));
  const temperature = 2.2;
  const exps = scores.map((s) => Math.exp((s.raw - maxScore) * temperature));
  const sumExp = exps.reduce((a, b) => a + b, 0) || 1;

  return scores.map((s, idx) => ({
    digit: s.digit,
    label: s.label,
    probability: Math.round((exps[idx] / sumExp) * 100),
  }));
}
