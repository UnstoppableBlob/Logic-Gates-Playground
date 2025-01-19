import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { calcOut, gate_types, getConnectionpoints, simulate } from "./gates";
import { nodes_def, connections_def } from "./default";
import GateNode from "./ui/Node";
import { ConnectionLine } from "./ui/Connection";

const PlaygroundMain = () => {
  const [nodes, setNodes] = useState(() => nodes_def);
  const [connections, setConnections] = useState(() => connections_def);
  const [drag, setDrag] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connFrom, setConnFrom] = useState(null);
  const [mpos, setMpos] = useState({ x: 0, y: 0 });
  const container = useRef(null);

  const ondown = (e, nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDrag(true);
    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const onmove = (e) => {
    if (!container.current) return;

    const containerRect = container.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    setMpos({ x, y });

    if (drag && draggedNode !== null) {
      const nodes_new = nodes.map((node) => {
        if (node.id === draggedNode) {
          return {
            ...node,
            x: Math.max(0, x - dragOffset.x),
            y: Math.max(0, y - dragOffset.y),
          };
        }
        return node;
      });
      setNodes(nodes_new);
    }
  };

  const onup = () => {
    setDrag(false);
    setDraggedNode(null);
    setConnFrom(null);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onmove);
    document.addEventListener("mouseup", onup);
    return () => {
      document.removeEventListener("mousemove", onmove);
      document.removeEventListener("mouseup", onup);
    };
  }, [drag, draggedNode, dragOffset]);

  const addGate = (type) => {
    const newNode = {
      id: Date.now(),
      x: 50,
      y: 50,
      gateType: type,
    };
    setNodes([...nodes, newNode]);
  };

  const delNode = (nodeId) => {
    setNodes(nodes.filter((node) => node.id !== nodeId));
    setConnections(
      connections.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)
    );
  };

  const delConn = (connectionId) => {
    setConnections(connections.filter((_, index) => index !== connectionId));
  };

  const newConn = (nodeId, type, index) => {
    if (type === "input") return;
    setConnFrom({ nodeId, type, index });
  };

  const complete = (nodeId, type, index) => {
    if (!connFrom || connFrom.nodeId === nodeId) return;
    if (type === "output") return;

    const t = connections.some(
      (conn) => conn.to === nodeId && conn.toPoint.index === index
    );
    const s = connections.some(
      (conn) =>
        conn.from === connFrom.nodeId && conn.fromPoint.index === connFrom.index
    );

    if (!t && !s) {
      setConnections([
        ...connections,
        {
          from: connFrom.nodeId,
          to: nodeId,
          fromPoint: { type: "output", index: connFrom.index },
          toPoint: { type: "input", index },
        },
      ]);
    }
    setConnFrom(null);
  };

  const getCval = (fromNode, fromPointIndex) => {
    const { nodeOuts } = simulate(nodes, connections);
    const outputs = nodeOuts.get(fromNode.id) || [];
    return outputs[fromPointIndex] || false;
  };

  // TODO move these to other file I made and make them take params
  const exportCircuit = () => {
    const circuitData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        x: node.x,
        y: node.y,
        gateType: node.gateType,
      })),
      connections: connections,
    };

    const dataStr = JSON.stringify(circuitData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "logic-circuit.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importCircuit = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const circuitData = JSON.parse(e.target.result);
        if (
          !Array.isArray(circuitData.nodes) ||
          !Array.isArray(circuitData.connections)
        ) {
          throw new Error("Invalid circuit data structure");
        }
        if (
          !circuitData.nodes.every(
            (node) =>
              node.id &&
              typeof node.x === "number" &&
              typeof node.y === "number" &&
              node.gateType &&
              gate_types[node.gateType]
          )
        ) {
          throw new Error("Invalid node data");
        }

        if (
          !circuitData.connections.every(
            (conn) =>
              conn.from &&
              conn.to &&
              conn.fromPoint &&
              conn.toPoint &&
              typeof conn.fromPoint.type === "string" &&
              typeof conn.toPoint.type === "string" &&
              typeof conn.fromPoint.index === "number" &&
              typeof conn.toPoint.index === "number"
          )
        ) {
          throw new Error("Invalid connection data");
        }

        setNodes(circuitData.nodes);
        setConnections(circuitData.connections);
      } catch (error) {
        alert("Error importing circuit: " + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 p-8">
      {" "}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {" "}
        <div className="flex-1 flex flex-wrap items-center gap-4">
          {" "}
          {Object.entries(gate_types).map(([type, config]) => (
            <button
              key={type}
              onClick={() => addGate(type)}
              className={`flex items-center gap-2 px-4 py-2 ${config.color} border border-gray-300 text-gray-700 rounded hover:bg-opacity-80 transition-colors`}
            >
              <Plus size={16} />
              {config.label}{" "}
            </button>
          ))}{" "}
        </div>{" "}
        <div className="flex items-center gap-4">
          {" "}
          <button
            onClick={() => {
              setNodes([]);
              setConnections([]);
            }}
            className="px-4 py-2 bg-red-100 border border-red-300 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Clear Circuit{" "}
          </button>{" "}
          <input
            type="file"
            accept=".json"
            onChange={importCircuit}
            className="hidden"
            id="circuit-import"
          />{" "}
          <label
            htmlFor="circuit-import"
            className="px-4 py-2 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Import Circuit{" "}
          </label>{" "}
          <button
            onClick={exportCircuit}
            className="px-4 py-2 bg-violet-100 border border-violet-300 text-violet-700 rounded hover:bg-violet-200 transition-colors"
          >
            Export Circuit{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div
        ref={container}
        className="relative w-full h-full min-h-screen bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        {" "}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: "100vh" }}
        >
          {" "}
          {connFrom && (
            <ConnectionLine
              fromNode={nodes.find((n) => n.id === connFrom.nodeId)}
              fromPoint={connFrom}
              mousePos={mpos}
              isTemp={true}
              value={getCval(
                nodes.find((n) => n.id === connFrom.nodeId),
                connFrom.index
              )}
            />
          )}{" "}
          {connections.map((conn, index) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <ConnectionLine
                key={index}
                id={index}
                fromNode={fromNode}
                toNode={toNode}
                fromPoint={conn.fromPoint}
                toPoint={conn.toPoint}
                value={getCval(fromNode, conn.fromPoint.index)}
                ondelete={delConn}
              />
            );
          })}{" "}
        </svg>{" "}
        {nodes.map((node) => {
          const { points, values } = getConnectionpoints(
            node.id,
            nodes,
            connections
          );
          return (
            <GateNode
              key={node.id}
              node={node}
              ondrag={ondown}
              onstart={(type, index) => newConn(node.id, type, index)}
              oncomplete={(type, index) => complete(node.id, type, index)}
              ondelete={delNode}
              connectionPoints={points}
              connectionValues={values}
            />
          );
        })}{" "}
      </div>{" "}
    </div>
  );
};

export default PlaygroundMain;
