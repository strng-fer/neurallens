import { MLPEdge, MLPNode, MLPState } from '@/types/simulation';

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
}

function sigmoidDerivative(a: number): number {
  return a * (1 - a);
}

/**
 * Creates deterministic initial network state with 3 Input, 4 Hidden, and 2 Output nodes
 */
export function createInitialMLPState(): MLPState {
  // Initial deterministic weights
  const initialW1: number[][] = [
    // from x0 to h0, h1, h2, h3
    [0.7, -0.5, 0.9, -0.3],
    // from x1
    [-0.4, 0.8, -0.6, 0.5],
    // from x2
    [0.6, -0.2, 0.4, -0.7],
  ];

  const initialW2: number[][] = [
    // from h0, h1, h2, h3 to y0, y1
    [0.8, -0.6],
    [-0.7, 0.9],
    [0.5, -0.4],
    [-0.3, 0.7],
  ];

  const nodes: MLPNode[][] = [
    // Layer 0: Input (3 nodes)
    [
      { id: 'in-0', layer: 0, index: 0, activation: 0.85, rawZ: 0.85 },
      { id: 'in-1', layer: 0, index: 1, activation: 0.4, rawZ: 0.4 },
      { id: 'in-2', layer: 0, index: 2, activation: 0.65, rawZ: 0.65 },
    ],
    // Layer 1: Hidden (4 nodes)
    [
      { id: 'hid-0', layer: 1, index: 0, activation: 0.5, rawZ: 0 },
      { id: 'hid-1', layer: 1, index: 1, activation: 0.5, rawZ: 0 },
      { id: 'hid-2', layer: 1, index: 2, activation: 0.5, rawZ: 0 },
      { id: 'hid-3', layer: 1, index: 3, activation: 0.5, rawZ: 0 },
    ],
    // Layer 2: Output (2 nodes)
    [
      { id: 'out-0', layer: 2, index: 0, activation: 0.5, rawZ: 0 },
      { id: 'out-1', layer: 2, index: 1, activation: 0.5, rawZ: 0 },
    ],
  ];

  const edges: MLPEdge[] = [];

  // Layer 0 -> 1 edges
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      edges.push({
        id: `e-0-${i}-1-${j}`,
        from: `in-${i}`,
        to: `hid-${j}`,
        fromLayer: 0,
        fromIndex: i,
        toLayer: 1,
        toIndex: j,
        weight: initialW1[i][j],
      });
    }
  }

  // Layer 1 -> 2 edges
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 2; k++) {
      edges.push({
        id: `e-1-${j}-2-${k}`,
        from: `hid-${j}`,
        to: `out-${k}`,
        fromLayer: 1,
        fromIndex: j,
        toLayer: 2,
        toIndex: k,
        weight: initialW2[j][k],
      });
    }
  }

  const state: MLPState = {
    nodes,
    edges,
    inputs: [0.85, 0.4, 0.65],
    targets: [1.0, 0.0],
    predictions: [0.5, 0.5],
    loss: 0.5,
    phase: 'idle',
    epoch: 0,
    lossHistory: [0.5],
    selectedNodeId: null,
  };

  // Run forward pass once to calculate initial valid activations
  return forwardPass(state);
}

/**
 * Computes forward pass through the 3-4-2 network
 */
export function forwardPass(state: MLPState): MLPState {
  const newNodes = state.nodes.map((layer) => layer.map((node) => ({ ...node })));
  const { inputs, targets } = state;

  // Set input layer activations
  inputs.forEach((val, idx) => {
    newNodes[0][idx].activation = val;
    newNodes[0][idx].rawZ = val;
  });

  // Calculate hidden layer
  for (let j = 0; j < 4; j++) {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      const edge = state.edges.find((e) => e.fromIndex === i && e.toIndex === j && e.fromLayer === 0);
      const w = edge ? edge.weight : 0;
      sum += inputs[i] * w;
    }
    const act = sigmoid(sum);
    newNodes[1][j].rawZ = Number(sum.toFixed(4));
    newNodes[1][j].activation = Number(act.toFixed(4));
  }

  // Calculate output layer
  const predictions: [number, number] = [0, 0];
  for (let k = 0; k < 2; k++) {
    let sum = 0;
    for (let j = 0; j < 4; j++) {
      const edge = state.edges.find((e) => e.fromIndex === j && e.toIndex === k && e.fromLayer === 1);
      const w = edge ? edge.weight : 0;
      sum += newNodes[1][j].activation * w;
    }
    const act = sigmoid(sum);
    newNodes[2][k].rawZ = Number(sum.toFixed(4));
    newNodes[2][k].activation = Number(act.toFixed(4));
    predictions[k] = Number(act.toFixed(4));
  }

  // Calculate Mean Squared Error
  const loss =
    0.5 * (Math.pow(targets[0] - predictions[0], 2) + Math.pow(targets[1] - predictions[1], 2));

  return {
    ...state,
    nodes: newNodes,
    predictions,
    loss: Number(loss.toFixed(4)),
    phase: 'forward',
  };
}

/**
 * Executes one backpropagation step with given learning rate
 */
export function backpropagate(state: MLPState, learningRate = 0.35): MLPState {
  const { nodes, edges, targets } = state;
  const newNodes = nodes.map((layer) => layer.map((n) => ({ ...n })));
  const newEdges = edges.map((e) => ({ ...e }));

  // 1. Output error signal: delta_k = (y_k - target_k) * sigmoid_derivative(y_k)
  const outputDeltas: number[] = [0, 0];
  for (let k = 0; k < 2; k++) {
    const y = newNodes[2][k].activation;
    const err = y - targets[k];
    outputDeltas[k] = err * sigmoidDerivative(y);
    newNodes[2][k].errorSignal = Number(outputDeltas[k].toFixed(4));
  }

  // 2. Hidden error signal: delta_j = sum_k(delta_k * W_jk) * sigmoid_derivative(h_j)
  const hiddenDeltas: number[] = [0, 0, 0, 0];
  for (let j = 0; j < 4; j++) {
    const h = newNodes[1][j].activation;
    let sum = 0;
    for (let k = 0; k < 2; k++) {
      const edge = edges.find((e) => e.fromIndex === j && e.toIndex === k && e.fromLayer === 1);
      const w = edge ? edge.weight : 0;
      sum += outputDeltas[k] * w;
    }
    hiddenDeltas[j] = sum * sigmoidDerivative(h);
    newNodes[1][j].errorSignal = Number(hiddenDeltas[j].toFixed(4));
  }

  // 3. Update Hidden -> Output weights
  for (const edge of newEdges) {
    if (edge.fromLayer === 1) {
      const j = edge.fromIndex;
      const k = edge.toIndex;
      const h = newNodes[1][j].activation;
      const grad = outputDeltas[k] * h;
      const deltaW = -learningRate * grad;
      edge.deltaWeight = Number(deltaW.toFixed(4));
      edge.weight = Number((edge.weight + deltaW).toFixed(4));
    }
  }

  // 4. Update Input -> Hidden weights
  for (const edge of newEdges) {
    if (edge.fromLayer === 0) {
      const i = edge.fromIndex;
      const j = edge.toIndex;
      const x = newNodes[0][i].activation;
      const grad = hiddenDeltas[j] * x;
      const deltaW = -learningRate * grad;
      edge.deltaWeight = Number(deltaW.toFixed(4));
      edge.weight = Number((edge.weight + deltaW).toFixed(4));
    }
  }

  // Run forward pass with new weights to compute new loss
  const updatedForward = forwardPass({
    ...state,
    nodes: newNodes,
    edges: newEdges,
  });

  const newLossHistory = [...state.lossHistory.slice(-29), updatedForward.loss];

  return {
    ...updatedForward,
    phase: 'backprop',
    epoch: state.epoch + 1,
    lossHistory: newLossHistory,
  };
}
