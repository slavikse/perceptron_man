cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isNeuronNodeInside = false;
    this.destroyNeuronNodeId = '';

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );
  },

  onCollisionEnter(neuronNode) {
    this.isNeuronNodeInside = true;
    this.destroyNeuronNodeId = neuronNode.node.uuid;
  },

  onCollisionExit() {
    this.isNeuronNodeInside = false;
    this.destroyNeuronNodeId = '';
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    if (
      this.isNeuronNodeInside
      && !isCaptured
      && capturedNeuronNode.uuid === this.destroyNeuronNodeId
    ) {
      this.neuronNodeDestroy(capturedNeuronNode);
    }
  },

  neuronNodeDestroy(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },
});
