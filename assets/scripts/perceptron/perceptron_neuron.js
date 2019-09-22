cc.Class({
  extends: cc.Component,

  onLoad() {
    const perceptronNode = this.node.parent.parent; // node.neuronsNode.perceptronNode
    const creatorNode = cc.find('creator', perceptronNode);
    this.creatorComponent = creatorNode.getComponent('perceptron_creator');

    this.connectionsComponent = this.node.getComponent('perceptron_connections');

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
  externalComponentRunSchedulerNeuronNodeDestroy({ lifeTime }) {
    this.scheduleOnce(this.neuronNodeDestroyed, lifeTime);
  },

  // todo эффект разрушения нейрона: частицы.
  neuronNodeDestroyed() {
    this.creatorComponent.externalComponentNeuronNodeDestroyed(this.node);
  },

  // todo разрушение нейрона и его соединения. (разрушение через долгое зажатие)
  onStartCapture(e) {
    console.log('e', e);

    this.unschedule(this.neuronNodeDestroyed, this);
    this.connectionsComponent.externalComponentCreateShadowConnections(this.node);
  },

  // todo связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  onMoveCaptured(e) {
    this.node.position = this.node.position.add(e.getDelta());
  },

  // todo после установки в сеть - нейрон нельзя перетаскивать, только разрешить.
  // todo появляются новые возможности: разрушение при двойном клике
  onEndCapture() {
    // todo только после закрепления в сети
    //  после закрепления отправляет флаг готовности.
    // todo эффект пристыковки: частицы.
    this.creatorComponent.externalComponentNeuronNodeDocked();
    this.connectionsComponent.externalComponentMountingShadowConnections();

    // todo если нейрон не был закреплен в сети и просто отпущен.
    // this.neuronDestroyed();
  },
});
