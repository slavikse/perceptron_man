function getNeuronsNodesAdjacentToBase({
  activeConnectionsNodes,
  neuronsNodesConnectedToBase,
}) {
  let wasDeletion = false;

  activeConnectionsNodes.forEach((connectionNode) => {
    const {
      neuronsNodes: {
        capturedNeuronNode,
        neuronNode,
      },
    } = connectionNode;

    if (neuronsNodesConnectedToBase.has(capturedNeuronNode)) {
      neuronsNodesConnectedToBase.add(neuronNode);

      activeConnectionsNodes.delete(connectionNode);
      wasDeletion = true;
    } else if (neuronsNodesConnectedToBase.has(neuronNode)) {
      neuronsNodesConnectedToBase.add(capturedNeuronNode);

      activeConnectionsNodes.delete(connectionNode);
      wasDeletion = true;
    }
  });

  if (wasDeletion) {
    getNeuronsNodesAdjacentToBase({
      activeConnectionsNodes,
      neuronsNodesConnectedToBase,
    });
  }

  return neuronsNodesConnectedToBase;
}

module.exports = getNeuronsNodesAdjacentToBase;
