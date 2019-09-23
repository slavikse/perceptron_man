cc.Class({
  extends: cc.Component,

  onLoad() {
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
    this.removeEventsListeners();
  },

  removeEventsListeners() {
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
    this.node.position = this.node.position.add(e.getDelta());
  },

  onEndCapture() {
    // todo закрепленный в сети нейрон будет ловить клик для разрушения нейрона и его соединения.
    // this.removeEventsListeners();

    // todo только после закрепления в сети вызывать: NeuronNodeDocked и MountingShadowConnections.
    // todo эффект пристыковки: частицы.
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDocked();
    this.perceptronConnectionsComponent.externalMountingShadowConnectionsNodes();

    // todo удалять, если нейрон не был закреплен в сети.
    // this.neuronDestroyed();
  },

  // todo эффект разрушения нейрона: частицы.
  neuronNodeDestroy() {
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },
});
