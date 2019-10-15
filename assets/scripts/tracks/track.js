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

  onCollisionStay(other, self) {
    if (
      this.isCapturedNeuronNode
      && this.capturedNeuronNodeId === other.node.uuid
    ) {
      const [trackId] = self.node.name.match(/\d+$/);

      // Проверка, что нейрон сменил дорожку.
      if (other.node.state.trackId !== trackId) {
        this.neuronNodeTrackChange(Number(trackId));
      }
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
    this.capturedNeuronNodeId = capturedNeuronNode.uuid;
  },

  neuronNodeTrackChange(trackId) {
    const e = new cc.Event.EventCustom(
      `perceptron/neuronNodeTrackChange/${this.capturedNeuronNodeId}`,
    );
    e.detail = { trackId };
    cc.director.dispatchEvent(e);
  },
});
