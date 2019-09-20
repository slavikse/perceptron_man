cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.perceptronNode = cc.find('level/perceptron');

    this.neuronsPool = new cc.NodePool('neurons');
    this.createNeurons();

    this.node.on('touchstart', this.onAddNeuronToScene, this);
  },

  createNeurons(quantity = 30) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsPool.put(neuronNode);
    }
  },

  // todo пока ящик не освобожден от созданного нейрона - новый создавать нельзя.
  onAddNeuronToScene() {
    this.neuronsPoolSizeCheck();
    this.addNeuronToScene();
  },

  neuronsPoolSizeCheck() {
    if (this.neuronsPool.size() === 0) {
      this.createNeurons();
    }
  },

  addNeuronToScene() {
    const neuronNode = this.neuronsPool.get();
    neuronNode.setPosition(this.node.position);

    this.perceptronNode.addChild(neuronNode);
  },

  externalComponentNeuronDestroyed(neuronNode) {
    this.neuronsPool.put(neuronNode);
  },

  onDestroy() {
    this.node.off('touchstart', this.onAddNeuronToScene, this);

    this.neuronsPool.clear();
  },
});
