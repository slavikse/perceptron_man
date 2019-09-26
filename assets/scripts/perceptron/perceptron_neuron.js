cc.Class({
  extends: cc.Component,

  onLoad() {
    this.levelNode = cc.director.getScene().getChildByName('level');

    const perceptronNode = this.node.parent.parent; // neuronNode.neuronsNode.perceptronNode

    this.perceptronConnectionsComponent = cc.find('connections', perceptronNode)
      .getComponent('perceptron_connections');

    this.perceptronNeuronCreatorComponent = cc.find('neuron_creator', perceptronNode)
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
    this.perceptronConnectionsComponent.externalCreateShadowConnectionsNodes(this.node);
  },

  // todo связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  onMoveCaptured(e) {
    this.setPositionLimitedByLevelSize(e);
  },

  onEndCapture() {
    // todo только после закрепления в сети вызывать: NeuronNodeDocked и MountingShadowConnections.
    // todo эффект пристыковки: частицы.
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDocked();
    this.perceptronConnectionsComponent.externalMountingShadowConnectionsNodes();

    // todo удалять, если нейрон не был закреплен в сети.
    // this.neuronDestroyed();
  },

  setPositionLimitedByLevelSize(e) {
    const { x, y } = this.node.position.add(e.getDelta());

    const halfLevelWidth = this.levelNode.width / 2;
    const halfLevelHeight = this.levelNode.height / 2;

    const halfNodeWidth = this.node.width / 2;
    const halfNodeHeight = this.node.height / 2;

    if (
      x > -halfLevelWidth + halfNodeWidth
      && x < halfLevelWidth - halfNodeWidth
      && y > -halfLevelHeight + halfNodeHeight
      && y < halfLevelHeight - halfNodeHeight
    ) {
      this.node.position = cc.v2(x, y);
    }
  },

  // todo эффект разрушения нейрона: частицы.
  neuronNodeDestroy() {
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },
});
