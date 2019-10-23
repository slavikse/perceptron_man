function changeConnectionNodeParameters(connectionNode) {
  const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
  const subtractedPosition = capturedNeuronNode.position.sub(
    neuronNode.position,
  );

  const { x, y } = subtractedPosition;
  const degB = Math.atan(x / y) * cc.macro.DEG;

  connectionNode.position = neuronNode.position;
  connectionNode.width = subtractedPosition.mag();

  if (y >= 0) {
    connectionNode.angle = 90 - degB;
  } else {
    connectionNode.angle = 270 - degB;
  }
}

module.exports = changeConnectionNodeParameters;
