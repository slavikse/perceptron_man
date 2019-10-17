cc.Class({
  extends: cc.Component,

  onLoad() {
    this.isCapturedNeuronNode = false;
    this.capturedNeuronNodeId = '';

    // Будет равняться 2, когда нейрон находится на 2х дорожках.
    // this.doubleCrossing = 0;

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );
  },

  update() {
    // this.doubleCrossing = 0;
  },

  // onCollisionEnter(other, self) {
  //   const [trackId] = self.node.name.match(/\d+$/);
  //   console.log(trackId, other.node.state.trackId);
  //   console.log('start');
  //   // Проверка, что нейрон сменил дорожку.
  //   if (other.node.state.trackId !== Number(trackId)) {
  //     other.node.state.trackId = Number(trackId);
  //   }
  // },

  // TODO: нужно дождаться, когда сработают оба пересечения, если 2 дорожки.
  onCollisionStay(other, self) {
    // this.doubleCrossing += 1;
    // TODO игнорировать пересечения с той дорожкой, на которой нейрон был
    // if (
    //   // this.doubleCrossing === 1
    //   this.isCapturedNeuronNode
    //   && this.capturedNeuronNodeId === other.node.uuid
    // ) {
    //   const [trackId] = self.node.name.match(/\d+$/);
    //   // console.log(trackId, other.node.state.trackId);
    //   // Проверка, что нейрон сменил дорожку.
    //   if (other.node.state.trackId !== Number(trackId)) {
    //     other.node.state.trackId = Number(trackId);
    //   }
    // }
  },

  // onCollisionExit(other, self) {
  //   const [trackId] = self.node.name.match(/\d+$/);
  //   console.log(trackId, other.node.state.trackId);

  //   console.log('exit');

  //   // Проверка, что нейрон сменил дорожку.
  //   if (other.node.state.trackId !== Number(trackId)) {
  //     other.node.state.trackId = Number(trackId);
  //   }
  // },

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
});
