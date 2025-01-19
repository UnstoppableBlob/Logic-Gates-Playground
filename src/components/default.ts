// TODO this should probably load from JSON
export const nodes_def = [
  {
    id: 1,
    x: 46.015625,
    y: 135,
    gateType: "INPUT_HIGH",
  },
  {
    id: 2,
    x: 46.03125,
    y: 295,
    gateType: "INPUT_HIGH",
  },
  {
    id: 3,
    x: 403.765625,
    y: 174,
    gateType: "AND",
  },
  {
    id: 4,
    x: 210.453125,
    y: 297,
    gateType: "NOT",
  },
  {
    id: 5,
    x: 572.140625,
    y: 231,
    gateType: "OR",
  },
  {
    id: 6,
    x: 768.5390625,
    y: 177,
    gateType: "OUTPUT",
  },
  {
    id: 1736821400607,
    x: 212.9140625,
    y: 135,
    gateType: "SPLITTER",
  },
];

export const connections_def = [
  {
    from: 3,
    to: 5,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 0,
    },
  },
  {
    from: 4,
    to: 5,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 1,
    },
  },
  {
    from: 5,
    to: 6,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 0,
    },
  },
  {
    from: 2,
    to: 4,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 0,
    },
  },
  {
    from: 1,
    to: 1736821400607,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 0,
    },
  },
  {
    from: 1736821400607,
    to: 3,
    fromPoint: {
      type: "output",
      index: 1,
    },
    toPoint: {
      type: "input",
      index: 1,
    },
  },
  {
    from: 1736821400607,
    to: 3,
    fromPoint: {
      type: "output",
      index: 0,
    },
    toPoint: {
      type: "input",
      index: 0,
    },
  },
];
