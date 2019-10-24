function getNeuronsNodesAdjacentToBase({
  activeConnectionsNodes,
  neuronsNodesConnectedToBase,
}) {
  let wasConnectionDeletion = false;

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
      wasConnectionDeletion = true;
    } else if (neuronsNodesConnectedToBase.has(neuronNode)) {
      neuronsNodesConnectedToBase.add(capturedNeuronNode);

      activeConnectionsNodes.delete(connectionNode);
      wasConnectionDeletion = true;
    }
  });

  if (wasConnectionDeletion) {
    getNeuronsNodesAdjacentToBase({
      activeConnectionsNodes,
      neuronsNodesConnectedToBase,
    });
  }

  return neuronsNodesConnectedToBase;
}

module.exports = getNeuronsNodesAdjacentToBase;
