cc.Class({
  extends: cc.Component,

  onLoad() {
    const { width, height } = cc.find('level/perceptron');
    this.perceptronNodeSize = { width, height };
  },

  onEnable() {
    // isBase: Когда нейрон на последней дорожке, значит он будет базовым.
    // trackId: Новый нейрон: -2 | Установлен где запрещено: -1.
    this.node.state = {
      isBase: false,
      trackId: -2,
    };

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  onDisable() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);

    this.destroingConnectionsNodes();
  },

  onStartCapture() {
    this.captureNeuronNode({ isCaptured: true });
    this.addingConnectionsNodes();
  },

  captureNeuronNode({ isCaptured }) {
    const e = new cc.Event.EventCustom('perceptron/captureNeuronNode');
    e.detail = { isCaptured, capturedNeuronNode: this.node };
    cc.director.dispatchEvent(e);
  },

  addingConnectionsNodes() {
    const e = new cc.Event.EventCustom('perceptron/addingConnectionsNodes');
    e.detail = { capturedNeuronNode: this.node };
    cc.director.dispatchEvent(e);
  },

  onMoveCaptured(e) {
    const { x, y } = this.node.position.add(e.getDelta());

    const halfLevelWidth = this.perceptronNodeSize.width / 2;
    const halfLevelHeight = this.perceptronNodeSize.height / 2;

    const halfNodeWidth = this.node.width / 2;
    const halfNodeHeight = this.node.height / 2;

    const border = 2;

    if (
      y < halfLevelHeight - halfNodeHeight - border // top
      && x < halfLevelWidth - halfNodeWidth - border // right
      && y > -halfLevelHeight + halfNodeHeight + border // bottom
      && x > -halfLevelWidth + halfNodeWidth + border // left
    ) {
      this.node.position = cc.v2(x, y);
    }
  },

  onEndCapture() {
    this.captureNeuronNode({ isCaptured: false });
  },

  destroingConnectionsNodes() {
    const e = new cc.Event.EventCustom('perceptron/destroingConnectionsNodes');
    e.detail = { nodeDestroyed: this.node };
    cc.director.dispatchEvent(e);
  },
});
