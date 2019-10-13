cc.Class({
  extends: cc.Component,

  onLoad() {
    const levelNode = cc.find('level');
    this.levelNodeSize = { width: levelNode.width, height: levelNode.height };

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // TODO эффект появления: частицы.
  onEnable() {
    this.isAnimationFirstRunning = true;
  },

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
      'perceptron/neuron/creator/setReadyCreateNeuronNode',
    );
    event.detail = { isReady };
    cc.director.dispatchEvent(event);
  },

  addConnectionsNodes() {
    const event = new cc.Event.EventCustom(
      'perceptron/connections/addConnectionsNodes',
    );
    event.detail = { capturedNeuronNode: this.node };
    cc.director.dispatchEvent(event);
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
    if (this.isAnimationFirstRunning) {
      this.isAnimationFirstRunning = false;

      // TODO только после закрепления в сети.
      this.playSpriteAnimation();
      this.activateParticleRadiation();
      this.mountingConnectionsNodes();
    }

    // TODO только после закрепления в сети.
    // TODO эффект пристыковки.
    this.setReadyCreateNeuronNode({ isReady: true });

    // TODO удалять, если нейрон не был закреплен в сети.
    // TODO эффект разрушения нейрона.
    // TODO наложение радиции на соседей + эффект радиции.
    // this.neuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },

  playSpriteAnimation() {
    cc.director.dispatchEvent(
      new cc.Event.EventCustom('perceptron/neuron/sprite/playSpriteAnimation'),
    );
  },

  activateParticleRadiation() {
    cc.director.dispatchEvent(
      new cc.Event.EventCustom(
        'perceptron/neuron/radiation/activateParticleRadiation',
      ),
    );
  },

  mountingConnectionsNodes() {
    cc.director.dispatchEvent(
      new cc.Event.EventCustom(
        'perceptron/connections/mountingConnectionsNodes',
      ),
    );
  },

  // TODO когда удалены все нейроны, проверить, что все соединения сброшены
  //  так как первый нейрон будет питать из реактора, то вероятно всё нормально.
  destroingConnectionsNodes() {
    const event = new cc.Event.EventCustom(
      'perceptron/connections/destroingConnectionsNodes',
    );
    event.detail = { nodeDestroyed: this.node };
    cc.director.dispatchEvent(event);
  },
});
