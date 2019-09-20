cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');

    this.neuronsPool = new cc.NodePool();
    this.createNeurons();

    this.isNotWaitingNeuronDocking = true;

    this.node.on('touchstart', this.onAddNeuronToScene, this);
  },

  createNeurons(quantity = 2 ** 5) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsPool.put(neuronNode);
    }
  },

  onAddNeuronToScene() {
    if (this.isNotWaitingNeuronDocking) {
      this.isNotWaitingNeuronDocking = false;

      this.neuronsPoolSizeCheck();
      this.addNeuronToScene();
    }
  },

  neuronsPoolSizeCheck() {
    if (this.neuronsPool.size() === 0) {
      this.createNeurons();
    }
  },

  addNeuronToScene() {
    const neuronNode = this.neuronsPool.get();
    neuronNode.setPosition(this.node.position);

    this.neuronsNode.addChild(neuronNode);
  },

  externalComponentNeuronDocked() {
    this.isNotWaitingNeuronDocking = true;
  },

  externalComponentNeuronDestroyed(neuronNode) {
    this.neuronsPool.put(neuronNode);
  },

  onDestroy() {
    this.node.off('touchstart', this.onAddNeuronToScene, this);

    this.neuronsPool.clear();
  },
});
