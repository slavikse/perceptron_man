cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isCapturedNeuronNode = false;
    this.capturedNeuronNodeId = '';

    // Для предотвращения присвоения trackId,
    // когда нейрон находится на двух дорожках.
    this.isCrossingTrackEdge = false;

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.on(
      'track/crossingTrackEdge',
      this.setCrossingTrackEdge,
      this,
    );
  },

  onCollisionStay(other, self) {
    if (
      this.isCapturedNeuronNode
      && this.capturedNeuronNodeId === other.node.uuid
    ) {
      let trackId = -1;

      if (!this.isCrossingTrackEdge) {
        trackId = Number(self.node.name.match(/\d+$/)[0]);
      }

      // Проверка, что нейрон сменил дорожку.
      if (other.node.state.trackId !== trackId) {
        other.node.state.trackId = trackId;
      }
    }
  },

  onDestroy() {
    cc.director.off(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.off(
      'track/crossingTrackEdge',
      this.setCrossingTrackEdge,
      this,
    );
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    this.isCapturedNeuronNode = isCaptured;
    this.capturedNeuronNodeId = capturedNeuronNode.uuid;
  },

  setCrossingTrackEdge({ detail: { isCrossing } }) {
    this.isCrossingTrackEdge = isCrossing;
  },
});
