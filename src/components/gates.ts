export const gate_types = {
  INPUT_HIGH: {
    inputs: 0,
    outputs: 1,
    label: "HIGH (1)",
    color: "bg-green-100",
  },
  INPUT_LOW: { inputs: 0, outputs: 1, label: "LOW (0)", color: "bg-red-100" },
  AND: { inputs: 2, outputs: 1, label: "AND", color: "bg-blue-100" },
  OR: { inputs: 2, outputs: 1, label: "OR", color: "bg-purple-100" },
  NOT: { inputs: 1, outputs: 1, label: "NOT", color: "bg-yellow-100" },
  XOR: { inputs: 2, outputs: 1, label: "XOR", color: "bg-indigo-100" },
  SEVEN_SEG: {
    inputs: 4,
    outputs: 0,
    label: "SEVEN SEG (beta)",
    color: "bg-slate-100",
  },
  SPLITTER: { inputs: 1, outputs: 2, label: "SPLITTER", color: "bg-amber-100" },
  NAND: { inputs: 2, outputs: 1, label: "NAND", color: "bg-teal-100" },
  NOR: { inputs: 2, outputs: 1, label: "NOR", color: "bg-rose-100" },
  XNOR: { inputs: 2, outputs: 1, label: "XNOR", color: "bg-cyan-100" },
  OUTPUT: { inputs: 1, outputs: 1, label: "OUTPUT", color: "bg-gray-100" },
};

export const calcOut = (node, vals_in) => {
  switch (node.gateType) {
    case "INPUT_HIGH":
      return [true];
    case "INPUT_LOW":
      return [false];
    case "AND":
      return [vals_in.every((v) => v)];
    case "OR":
      return [vals_in.some((v) => v)];
    case "NOT":
      return [!vals_in[0]];
    case "XOR":
      return [vals_in.reduce((a, b) => a !== b)];
    case "SPLITTER":
      return [vals_in[0], vals_in[0]];
    case "NAND":
      return [!vals_in.every((v) => v)];
    case "NOR":
      return [!vals_in.some((v) => v)];
    case "XNOR":
      return [vals_in.reduce((a, b) => a === b)];
    case "OUTPUT":
      return [vals_in[0]];
    default:
      return [];
  }
};

export function simulate(nodes, connections) {
  const outs = new Map();
  const ins = new Map();
  nodes.forEach((node) => {
    ins.set(node.id, Array(gate_types[node.gateType].inputs).fill(false));
  });

  nodes.forEach((node) => {
    if (node.gateType === "INPUT_HIGH" || node.gateType === "INPUT_LOW") {
      outs.set(node.id, calcOut(node, []));
    }
  });

  let changed = true;
  while (changed) {
    changed = false;
    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const fromOutputs = outs.get(fromNode.id);
      if (fromOutputs) {
        const toNode = nodes.find((n) => n.id === conn.to);
        const inputs = ins.get(toNode.id);
        inputs[conn.toPoint.index] = fromOutputs[conn.fromPoint.index];
        ins.set(toNode.id, inputs);
        const newOuts = calcOut(toNode, inputs);
        if (JSON.stringify(newOuts) !== JSON.stringify(outs.get(toNode.id))) {
          outs.set(toNode.id, newOuts);
          changed = true;
        }
      }
    });
  }

  return { nodeOuts: outs, nodeIns: ins };
}

export const getConnectionpoints = (nodeId, nodes, connections) => {
  const { nodeIns, nodeOuts } = simulate(nodes, connections);
  const nodeConns = connections.filter(
    (conn) => conn.from === nodeId || conn.to === nodeId
  );

  const points = {
    inputs: Array(4).fill(false),
    outputs: Array(4).fill(false),
  };

  const values = {
    inputs: nodeIns.get(nodeId) || [],
    outputs: nodeOuts.get(nodeId) || [],
  };

  nodeConns.forEach((conn) => {
    if (conn.from === nodeId) {
      points.outputs[conn.fromPoint.index] = true;
    }
    if (conn.to === nodeId) {
      points.inputs[conn.toPoint.index] = true;
    }
  });

  return { points, values };
};
