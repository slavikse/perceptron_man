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
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },

  // todo эффект времени до уничтожения.
  externalRunSchedulerNeuronNodeDestroy({ lifeTime }) {
    this.scheduleOnce(this.neuronNodeDestroy, lifeTime);
  },

  // todo эффект разрушения нейрона: частицы.
  neuronNodeDestroy() {
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDestroy(this.node);
  },

  // fixme если нажать на размещенный узел, дублируются соединения.

  // todo нейрон не будет ловить нажатия после размещения, только зажатие для разрушения.
  // todo разрушение нейрона и его соединения. (разрушение через долгое зажатие)
  onStartCapture() {
    this.unschedule(this.neuronNodeDestroy, this);
    this.perceptronConnectionsComponent.externalCreateShadowConnectionsNodes(this.node);
  },

  // todo связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  onMoveCaptured(e) {
    // todo только целые числа. под пиксельный стиль.
    this.node.position = this.node.position.add(e.getDelta());
  },

  // todo после установки в сеть - нейрон нельзя перетаскивать, только разрешить.
  // todo появляются новые возможности: разрушение при двойном клике
  onEndCapture() {
    // todo только после закрепления в сети
    //  после закрепления отправляет флаг готовности.
    // todo эффект пристыковки: частицы.
    this.perceptronNeuronCreatorComponent.externalNeuronNodeDocked();
    this.perceptronConnectionsComponent.externalMountingShadowConnectionsNodes();

    // todo если нейрон не был закреплен в сети и просто отпущен.
    // this.neuronDestroyed();
  },
});
