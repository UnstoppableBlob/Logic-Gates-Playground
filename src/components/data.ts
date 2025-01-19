export const exportCircuit = () => {
  const d = {
    nodes: nodes.map((node) => ({
      id: node.id,
      x: node.x,
      y: node.y,
      gateType: node.gateType,
    })),
    connections: connections,
  };

  const dataStr = JSON.stringify(d, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = "logicgates-circuit.json";
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};
