cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isCapturedNeuronNode = false;
    this.capturedNeuronNodeId = '';

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );
  },

  // TODO проверить, если заталкать нейрон захваченным на другую дорожку.
  // TODO проверять, в какой части нейрон находится больше.
  onCollisionStay(other, self) {
    if (
      this.isCapturedNeuronNode
      && this.capturedNeuronNodeId === other.node.uuid
    ) {
      const [trackId] = self.node.name.match(/\d+$/);
      this.neuronNodeTrackChange(Number(trackId));
    }
  },

  onDestroy() {
    cc.director.off(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    this.isCapturedNeuronNode = isCaptured;

    if (isCaptured) {
      this.capturedNeuronNodeId = capturedNeuronNode.uuid;
    } else {
      this.capturedNeuronNodeId = '';
    }
  },

  neuronNodeTrackChange(trackId) {
    const e = new cc.Event.EventCustom(
      `perceptron/neuronNodeTrackChange/${this.capturedNeuronNodeId}`,
    );
    e.detail = { trackId };
    cc.director.dispatchEvent(e);
  },
});
