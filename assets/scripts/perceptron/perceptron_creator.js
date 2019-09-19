cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.perceptronNode = cc.find('level/perceptron');

    this.neuronsPool = this.createNeuronsPool();

    this.node.on('touchstart', this.onAddNeuronToScene, this);
  },

  onDestroy() {
    this.neuronsPool.clear();

    this.node.off('touchstart', this.onAddNeuronToScene, this);
  },

  createNeuronsPool() {
    const quantity = 30;
    const neuronsPool = new cc.NodePool('neurons');

    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      neuronsPool.put(neuronNode);
    }

    return neuronsPool;
  },

  onAddNeuronToScene() {
    let neuronNode;

    if (this.neuronsPool.size() > 0) {
      neuronNode = this.neuronsPool.get();
    } else {
      neuronNode = cc.instantiate(this.neuronPrefab);
    }

    neuronNode.setPosition(this.node.position);
    this.perceptronNode.addChild(neuronNode);
  },

  externalComponentNeuronDestroyed(neuronNode) {
    this.neuronsPool.put(neuronNode);
  },
});
