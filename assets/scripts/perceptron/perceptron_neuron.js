cc.Class({
  extends: cc.Component,

  onLoad() {
    this.levelNode = cc.find('level');

    this.connectionsComponent = cc.find('level/perceptron/connections')
      .getComponent('perceptron_connections');

    this.neuronCreatorComponent = cc.find('level/perceptron/neuron_creator')
      .getComponent('perceptron_neuron_creator');

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },

  onStartCapture() {
    this.connectionsComponent.externalCreateConnectionsNodes(this.node);
  },

  // TODO связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  onMoveCaptured(e) {
    this.setPositionLimitedByLevelSize(e);
  },

  setPositionLimitedByLevelSize(e) {
    const { x, y } = this.node.position.add(e.getDelta());

    const halfLevelWidth = this.levelNode.width / 2;
    const halfLevelHeight = this.levelNode.height / 2;

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
    // TODO только после закрепления в сети вызывать: NeuronNodeDocked и MountingShadowConnections.
    // TODO эффект пристыковки: частицы.
    this.neuronCreatorComponent.externalNeuronNodeDocked();
    this.connectionsComponent.externalMountingConnectionsNodes();

    // TODO удалять, если нейрон не был закреплен в сети.
    // this.neuronDestroyed();
  },

  // TODO эффект разрушения нейрона: частицы.
  neuronNodeDestroy() {
    this.neuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },
});

// TODO не нужны отдельные кадры для поворота нейрона, просто крутить один нейрон.
// TODO не крутить на пульсировать: scale?
