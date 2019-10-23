cc.Class({
  extends: cc.Component,

  onLoad() {
    const tracksNode = cc.find('level/tracks');
    this.countOfTracks = Math.ceil(tracksNode.height / this.node.height);

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
      this.crossingTrackEdge,
      this,
    );
  },

  onCollisionStay(neuron, track) {
    if (
      this.isCapturedNeuronNode
      && this.capturedNeuronNodeId === neuron.node.uuid
    ) {
      let trackId = -1;

      if (!this.isCrossingTrackEdge) {
        trackId = Number(track.node.name.match(/\d+$/)[0]);
      }

      // Проверка, что нейрон сменил дорожку.
      if (neuron.node.state.trackId !== trackId) {
        // Последний нейрон, является базовым.
        neuron.node.state.isBase = trackId === this.countOfTracks;
        neuron.node.state.trackId = trackId;
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
      this.crossingTrackEdge,
      this,
    );
  },

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    this.isCapturedNeuronNode = isCaptured;
    this.capturedNeuronNodeId = capturedNeuronNode.uuid;
  },

  crossingTrackEdge({ detail: { isCrossing } }) {
    this.isCrossingTrackEdge = isCrossing;
  },
});
