cc.Class({
  extends: cc.Component,

  // TODO наложение радиции на соседей + эффект радиции.
  onLoad() {
    const { width, height } = cc.find('level');
    this.levelNodeSize = { width, height };

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // TODO эффект появления: частицы.
  onEnable() {
    // TODO вводить через событие
    // this.node.state.trackId = -1;
    this.trackNodeId = -1;
  },

  // TODO эффект разрушения: частицы.
  onDisable() {
    this.destroingConnectionsNodes();
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
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

  // Выполняет роль: setPositionLimitedByLevelSize
  onMoveCaptured(e) {
    const { x, y } = this.node.position.add(e.getDelta());

    const halfLevelWidth = this.levelNodeSize.width / 2;
    const halfLevelHeight = this.levelNodeSize.height / 2;

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
    e.detail = { destroyedNeuronNode: this.node };
    cc.director.dispatchEvent(e);
  },
});
