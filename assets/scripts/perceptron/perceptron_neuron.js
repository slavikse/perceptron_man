cc.Class({
  extends: cc.Component,

  onLoad() {
    const levelNode = cc.find('level');
    this.levelNodeSize = { width: levelNode.width, height: levelNode.height };

    this.particleNode = cc.find('particle', this.node);

    this.spriteAnimationComponentState = cc
      .find('sprite', this.node)
      .getComponent(cc.Animation)
      .getAnimationState('sprite');

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // TODO эффект появления: частицы.
  onEnable() {},

  // TODO эффект разрушения нейрона.
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
    this.setReadyCreateNeuronNode({ isReady: false });
    this.addConnectionsNodes();
  },

  setReadyCreateNeuronNode({ isReady }) {
    const event = new cc.Event.EventCustom(
      'perceptron/neuron/setReadyCreateNeuronNode',
    );
    event.detail = { isReady };
    cc.director.dispatchEvent(event);
  },

  addConnectionsNodes() {
    const event = new cc.Event.EventCustom(
      'perceptron/neuron/addConnectionsNodes',
    );
    event.detail = { capturedNeuronNode: this.node };
    cc.director.dispatchEvent(event);
  },

  // TODO если нет соединений.
  // this.spriteAnimationComponentState.stop('neuron');

  // setPositionLimitedByLevelSize
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
    // TODO только после закрепления в сети.
    this.particleNode.active = true;

    // TODO только после закрепления в сети.
    if (!this.spriteAnimationComponentState.isPlaying) {
      this.spriteAnimationComponentState.play('sprite');
    }

    // TODO только после закрепления в сети вызывать: NeuronNodeDocked и MountingShadowConnections.
    // TODO эффект пристыковки.

    this.setReadyCreateNeuronNode({ isReady: true });
    this.mountingConnectionsNodes();

    // TODO удалять, если нейрон не был закреплен в сети.
    // TODO эффект разрушения нейрона.
    // TODO наложение радиции на соседей + эффект радиции.
    // this.neuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },

  mountingConnectionsNodes() {
    const event = new cc.Event.EventCustom(
      'perceptron/neuron/mountingConnectionsNodes',
    );
    cc.director.dispatchEvent(event);
  },

  destroingConnectionsNodes() {
    const event = new cc.Event.EventCustom(
      'perceptron/neuron/destroingConnectionsNodes',
    );
    event.detail = { nodeDestroyed: this.node };
    cc.director.dispatchEvent(event);
  },
});
