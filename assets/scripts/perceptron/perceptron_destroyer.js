cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isNeuronNodeInside = false;

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

  onCollisionEnter() {
    this.isNeuronNodeInside = true;
  },

  onCollisionExit() {
    this.isNeuronNodeInside = false;
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    if (this.isNeuronNodeInside && !isCaptured) {
      this.neuronNodeDestroy(capturedNeuronNode);
      this.destroingConnectionsNodes(capturedNeuronNode);
    }
  },

  neuronNodeDestroy(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },

  destroingConnectionsNodes(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/destroingConnectionsNodes');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },
});
