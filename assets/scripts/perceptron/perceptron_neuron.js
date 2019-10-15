cc.Class({
  extends: cc.Component,

  // TODO блокировать пересечения нейронов с помощью проверки пересечения.
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
    this.node.state = { trackId: -1 };

    cc.director.on(
      `perceptron/neuronNodeTrackChange/${this.node.uuid}`,
      this.neuronNodeTrackChange,
      this,
    );
  },

  // TODO эффект разрушения: частицы.
  onDisable() {
    this.destroingConnectionsNodes();

    cc.director.off(
      `perceptron/neuronNodeTrackChange/${this.node.uuid}`,
      this.neuronNodeTrackChange,
      this,
    );
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

  neuronNodeTrackChange({ detail: { trackId } }) {
    this.node.state.trackId = trackId;
  },

  destroingConnectionsNodes() {
    const e = new cc.Event.EventCustom('perceptron/destroingConnectionsNodes');
    e.detail = { destroyedNeuronNode: this.node };
    cc.director.dispatchEvent(e);
  },
});
