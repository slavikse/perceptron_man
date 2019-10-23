function searchActiveAndConnectedToBaseNeuronsNodes(connectionsNodes) {
  const activeConnectionsNodes = new Set();
  const neuronsNodesConnectedToBase = new Set();

  connectionsNodes.forEach((connectionNode) => {
    if (connectionNode.active) {
      activeConnectionsNodes.add(connectionNode);

      const {
        neuronsNodes: {
          capturedNeuronNode,
          neuronNode,
        },
      } = connectionNode;

      if (capturedNeuronNode.state.isBase) {
        neuronsNodesConnectedToBase.add(capturedNeuronNode);
      } else if (neuronNode.state.isBase) {
        neuronsNodesConnectedToBase.add(neuronNode);
      }
    }
  });

  return {
    activeConnectionsNodes,
    neuronsNodesConnectedToBase,
  };
}

module.exports = searchActiveAndConnectedToBaseNeuronsNodes;
