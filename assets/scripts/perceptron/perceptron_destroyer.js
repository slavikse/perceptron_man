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
    this.destroyNeuronNodeId = neuronNode.node.uuid;
    this.isNeuronNodeInside = true;
  },

  onCollisionExit() {
    this.destroyNeuronNodeId = '';
    this.isNeuronNodeInside = false;
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    if (
      this.isNeuronNodeInside
      && !isCaptured
      && this.destroyNeuronNodeId === capturedNeuronNode.uuid
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
