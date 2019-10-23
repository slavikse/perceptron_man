function preventReAddingConnectionNode(
  connectionsNodes,
  { capturedNeuronNode, neuronNode },
) {
  let isPrevented = false;

  connectionsNodes.forEach(({ neuronsNodes }) => {
    if (
      (capturedNeuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid
        && neuronNode.uuid === neuronsNodes.neuronNode.uuid)
      || (capturedNeuronNode.uuid === neuronsNodes.neuronNode.uuid
        && neuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid)
    ) {
      isPrevented = true;
    }
  });

  return isPrevented;
}

module.exports = preventReAddingConnectionNode;
