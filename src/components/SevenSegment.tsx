import React, { useState, useRef, useEffect } from "react";

const SevenSegmentDisplay = ({ inputs }) => {
  const getValue = () => {
    if (!inputs || inputs.length !== 4) return null;
    const binaryStr = inputs.map((v) => (v ? "1" : "0")).join("");
    return parseInt(binaryStr, 2);
  };

  const value = getValue();

  const patterns = {
    0: [1, 1, 1, 1, 1, 1, 0],
    1: [0, 1, 1, 0, 0, 0, 0],
    2: [1, 1, 0, 1, 1, 0, 1],
    3: [1, 1, 1, 1, 0, 0, 1],
    4: [0, 1, 1, 0, 0, 1, 1],
    5: [1, 0, 1, 1, 0, 1, 1],
    6: [1, 0, 1, 1, 1, 1, 1],
    7: [1, 1, 1, 0, 0, 0, 0],
    9: [1, 1, 1, 1, 0, 1, 1],
    8: [1, 1, 1, 1, 1, 1, 1],
    10: [1, 1, 1, 0, 1, 1, 1], // (this goes A to f because why waste bits?)
    11: [0, 0, 1, 1, 1, 1, 1],
    12: [1, 0, 0, 1, 1, 1, 0],
    13: [0, 1, 1, 1, 1, 0, 1],
    14: [1, 0, 0, 1, 1, 1, 1],
    15: [1, 0, 0, 0, 1, 1, 1],
  };

  const segments = value !== null ? patterns[value] : [0, 0, 0, 0, 0, 0, 0];
  const active = "fill-red-500";
  const inactive = "fill-gray-200";

  return (
    <svg viewBox="0 0 60 100" className="w-24 h-32">
      <polygon
        points="10,10 50,10 45,15 15,15"
        className={`${segments[0] ? active : inactive} transition-colors`}
      />

      <polygon
        points="52,12 47,17 47,43 52,48"
        className={`${segments[1] ? active : inactive} transition-colors`}
      />

      <polygon
        points="52,52 47,57 47,83 52,88"
        className={`${segments[2] ? active : inactive} transition-colors`}
      />

      <polygon
        points="10,90 50,90 45,85 15,85"
        className={`${segments[3] ? active : inactive} transition-colors`}
      />

      <polygon
        points="8,52 13,57 13,83 8,88"
        className={`${segments[4] ? active : inactive} transition-colors`}
      />

      <polygon
        points="8,12 13,17 13,43 8,48"
        className={`${segments[5] ? active : inactive} transition-colors`}
      />

      <polygon
        points="10,50 15,45 45,45 50,50 45,55 15,55"
        className={`${segments[6] ? active : inactive} transition-colors`}
      />
    </svg>
  );
};

export default SevenSegmentDisplay;
