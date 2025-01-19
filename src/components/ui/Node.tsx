import { gate_types } from "../gates";
import React, { useState, useRef, useEffect } from "react";
import { ConnectionLine, ConnectionPoint } from "./Connection";
import { X } from "lucide-react";
import SevenSegmentDisplay from "../SevenSegment";

const gateNode = ({
  node,
  ondrag,
  onstart,
  oncomplete,
  ondelete,
  connectionPoints,
  connectionValues,
}) => {
  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 60;
  const gateConf = gate_types[node.gateType];

  const inpoints = Array(gateConf.inputs)
    .fill(0)
    .map((_, i) => ({
      x: -3,
      y: (NODE_HEIGHT * (i + 1)) / (gateConf.inputs + 1),
    }));

  const outpoints = Array(gateConf.outputs)
    .fill(0)
    .map((_, i) => ({
      x: NODE_WIDTH,
      y:
        node.gateType === "SPLITTER"
          ? (NODE_HEIGHT * (i + 1)) / 3
          : NODE_HEIGHT / 2,
    }));

  return (
    <div
      className={`absolute flex items-center ${gateConf.color} border border-gray-300 rounded shadow-sm`}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        cursor: node.isDragging ? "grabbing" : "grab",
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
    >
      {inpoints.map((point, i) => (
        <ConnectionPoint
          key={`input-${i}`}
          x={point.x}
          y={point.y}
          type="input"
          index={i}
          onstart={onstart}
          oncomplete={oncomplete}
          connected={connectionPoints.inputs[i]}
          value={connectionValues.inputs[i]}
        />
      ))}

      {outpoints.map((point, i) => (
        <ConnectionPoint
          key={`output-${i}`}
          x={point.x}
          y={point.y}
          type="output"
          index={i}
          onstart={onstart}
          oncomplete={oncomplete}
          connected={connectionPoints.outputs[i]}
          value={connectionValues.outputs[i]}
        />
      ))}

      <div
        className="w-full h-full flex items-center justify-center px-4 relative"
        onMouseDown={(e) => ondrag(e, node.id)}
      >
        {node.gateType === "OUTPUT" ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">{gateConf.label}</span>
            <div
              className={`w-4 h-4 rounded-full ${
                connectionValues.inputs[0]
                  ? "bg-green-500 shadow-lg shadow-green-200 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs font-medium">
              {connectionValues.inputs[0] ? "ON" : "OFF"}
            </span>
          </div>
        ) : node.gateType === "SEVEN_SEG" ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium">{gateConf.label}</span>
            <SevenSegmentDisplay inputs={connectionValues.inputs} />
            <span className="text-xs text-gray-500 mt-1">
              Value:{" "}
              {connectionValues.inputs.map((v) => (v ? "1" : "0")).join("")}
            </span>
          </div>
        ) : (
          <span className="text-sm font-medium">{gateConf.label}</span>
        )}
        <button
          className="absolute top-1 right-1 p-1 text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => ondelete(node.id)}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default gateNode;
