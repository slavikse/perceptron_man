cc.Class({
  extends: cc.Component,

  // todo эффект появления: частицы.
  onLoad() {
    const perceptronNode = this.node.parent.parent; // node -> neuronsNode -> perceptronNode
    const creatorNode = cc.find('creator', perceptronNode);
    this.creatorComponent = creatorNode.getComponent('perceptron_creator');

    this.connectionsComponent = this.node.getComponent('perceptron_connections');

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // todo эффект времени до уничтожения.
  externalComponentRunSchedulerDestroy({ lifeTime }) {
    this.scheduleOnce(this.neuronDestroyed, lifeTime);
  },

  onStartCapture() {
    this.unschedule(this.neuronDestroyed, this);
    this.connectionsComponent.externalComponentCreateShadowConnections();
  },

  onMoveCaptured(e) {
    this.node.position = this.node.position.add(e.getDelta());
  },

  // todo после установки в сеть - нейрон нельзя перетаскивать, только разрешить.
  // todo появляются новые возможности: разрушение при двойном клике
  onEndCapture() {
    // todo если нейрон не был закреплен в сети и просто отпущен.
    // this.neuronDestroyed();

    // todo только после закрепления в сети
    // todo эффект пристыковки: частицы.
    this.creatorComponent.externalComponentNeuronDocked();
    this.connectionsComponent.externalComponentMountingShadowConnections();
  },

  // todo эффект разрушения: частицы.
  neuronDestroyed() {
    this.creatorComponent.externalComponentNeuronDestroyed(this.node);
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },
});
