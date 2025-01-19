import React, { useState, useRef, useEffect } from "react";
import { gate_types } from "../gates";

const ConnectionPoint = ({
  x,
  y,
  type,
  index,
  onstart,
  oncomplete,
  connected,
  value,
}) => {
  return (
    <div
      className={`absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rounded-full border ${
        value ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"
      } hover:bg-blue-200 cursor-pointer transition-colors`}
      style={{
        left: x,
        top: y,
      }}
      onClick={() => onstart(type, index)}
      onMouseUp={() => oncomplete(type, index)}
    />
  );
};

const ConnectionLine = ({
  fromNode,
  toNode,
  fromPoint,
  toPoint,
  isTemp,
  mousePos,
  value,
  ondelete,
  id,
}) => {
  const connectionCoords = (node, point, type) => {
    const gateConf = gate_types[node.gateType];
    const x = node.x + (type === "output" ? 120 : 0);
    let y = node.y;
    if (type === "output") {
      if (node.gateType === "SPLITTER") {
        y += (60 * (point.index + 1)) / 3;
      } else {
        y += 30;
      }
    } else {
      y += (60 * (point.index + 1)) / (gateConf.inputs + 1);
    }
    return { x, y };
  };

  if (isTemp && mousePos) {
    const start = connectionCoords(fromNode, fromPoint, fromPoint.type);
    return (
      <path
        d={`M ${start.x} ${start.y} L ${mousePos.x} ${mousePos.y}`}
        stroke={value ? "#22C55E" : "#EF4444"}
        strokeWidth="2"
        strokeDasharray="4"
        fill="none"
        className="pointer-events-none"
      />
    );
  }

  const start = connectionCoords(fromNode, fromPoint, fromPoint.type);
  const end = connectionCoords(toNode, toPoint, toPoint.type);
  const midX = (start.x + end.x) / 2;

  const path = `M ${start.x} ${start.y}
 C ${midX} ${start.y},
 ${midX} ${end.y},
 ${end.x} ${end.y}`;

  return (
    <g>
      {" "}
      <path
        d={path}
        stroke={value ? "#22C55E" : "#EF4444"}
        strokeWidth="2"
        fill="none"
        className="pointer-events-none"
      />{" "}
      <polygon
        points="-6,-4 0,0 -6,4"
        fill={value ? "#22C55E" : "#EF4444"}
        transform={`translate(${end.x},${end.y}) rotate(0)`}
        className="pointer-events-none"
      />{" "}
      <g
        transform={`translate(${midX},${(start.y + end.y) / 2})`}
        onClick={() => ondelete(id)}
        className="cursor-pointer"
      >
        {" "}
        <circle
          r="8"
          fill="white"
          stroke="#EF4444"
          strokeWidth="1.5"
          className="hover:fill-red-50"
        />{" "}
        <path
          d="M-4,-4 L4,4 M-4,4 L4,-4"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />{" "}
      </g>{" "}
    </g>
  );
};

export { ConnectionLine, ConnectionPoint };
