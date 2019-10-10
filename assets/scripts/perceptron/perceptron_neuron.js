cc.Class({
  extends: cc.Component,

  onLoad() {
    const levelNode = cc.find('level');
    this.levelNodeSize = { width: levelNode.width, height: levelNode.height };

    const perceptronNode = cc.find('perceptron', levelNode);
    this.neuronCreatorComponent = cc.find('creator', perceptronNode).getComponent('perceptron_creator');
    this.connectionsComponent = cc.find('connections', perceptronNode).getComponent('perceptron_connections');

    this.radiationNode = cc.find('radiation', this.node);
    this.textureAnimationComponent = cc.find('texture', this.node).getComponent(cc.Animation);

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // TODO эффект появления: частицы.
  onEnable() {},

  // TODO эффект разрушения нейрона.
  onDisable() {
    this.connectionsComponent.externalDestroingConnectionsNodes(this.node);
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },

  onStartCapture() {
    this.neuronCreatorComponent.externalSetReadyCreateNeuronNode({ isReady: false });
    this.connectionsComponent.externalCreateConnectionsNodes(this.node);
  },

  onMoveCaptured(e) {
    this.setPositionLimitedByLevelSize(e);

    // TODO если нет соединений.
    // this.textureAnimationComponent.stop('neuron');
  },

  setPositionLimitedByLevelSize(e) {
    const { x, y } = this.node.position.add(e.getDelta());

    const halfLevelWidth = this.levelNodeSize.width / 2;
    const halfLevelHeight = this.levelNodeSize.height / 2;

    const halfNodeWidth = this.node.width / 2;
    const halfNodeHeight = this.node.height / 2;

    const border = 4;

    if (
      x > -halfLevelWidth + halfNodeWidth + border
      && x < halfLevelWidth - halfNodeWidth - border
      && y > -halfLevelHeight + halfNodeHeight + border
      && y < halfLevelHeight - halfNodeHeight - border
    ) {
      this.node.position = cc.v2(x, y);
    }
  },

  onEndCapture() {
    // TODO только после закрепления в сети.
    // TODO не перезапускать при перемещениях, пока не разорвутся все связи.
    this.radiationNode.active = true;

    // TODO только после закрепления в сети.
    if (!this.textureAnimationComponent.getAnimationState('neuron').isPlaying) {
      this.textureAnimationComponent.play('neuron');
    }

    // TODO только после закрепления в сети вызывать: NeuronNodeDocked и MountingShadowConnections.
    // TODO эффект пристыковки.
    this.neuronCreatorComponent.externalSetReadyCreateNeuronNode({ isReady: true });
    this.connectionsComponent.externalMountingConnectionsNodes();

    // TODO удалять, если нейрон не был закреплен в сети.
    // TODO эффект разрушения нейрона.
    // TODO наложение радиции на соседей + эффект радиции.
    // this.neuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },
});
