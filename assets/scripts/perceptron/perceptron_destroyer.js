cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isInsideNeuronNode = false;

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

  // TODO удаляется не тот нейрон, если его затолкнуть захваченным нейроном.
  onCollisionEnter() {
    this.isInsideNeuronNode = true;
  },

  onCollisionExit() {
    this.isInsideNeuronNode = false;
  },

  captureNeuronNode({ detail: { isCaptured, neuronNode } }) {
    if (this.isInsideNeuronNode && !isCaptured) {
      this.neuronNodeDestroy(neuronNode);
    }
  },

  neuronNodeDestroy(neuronNode) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed: neuronNode };
    cc.director.dispatchEvent(e);
  },
});
