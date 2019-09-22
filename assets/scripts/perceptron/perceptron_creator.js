cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    const perceptronNode = this.node.parent;
    this.neuronsNode = cc.find('neurons', perceptronNode);

    this.neuronsNodesPool = new cc.NodePool();
    this.createNeuronsNodes();

    this.isNotWaitingNeuronNodeDocking = true;

    this.node.on('touchstart', this.onAddNeuronNodeToScene, this);
  },

  createNeuronsNodes(quantity = 2 ** 5) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsNodesPool.put(neuronNode);
    }
  },

  onAddNeuronNodeToScene() {
    if (this.isNotWaitingNeuronNodeDocking) {
      this.isNotWaitingNeuronNodeDocking = false;

      this.neuronsNodesPoolSizeCheck();
      this.addNeuronNodeToScene();
    }
  },

  neuronsNodesPoolSizeCheck() {
    if (this.neuronsNodesPool.size() === 0) {
      this.createNeuronsNodes();
    }
  },

  addNeuronNodeToScene() {
    const neuronNode = this.neuronsNodesPool.get();
    const neuronComponent = neuronNode.getComponent('perceptron_neuron');
    neuronComponent.externalComponentRunSchedulerDestroy({ lifeTime: 5 });

    neuronNode.setPosition(this.node.position);
    this.neuronsNode.addChild(neuronNode);
  },

  externalComponentNeuronDocked() {
    this.isNotWaitingNeuronNodeDocking = true;
  },

  externalComponentNeuronDestroyed(neuronNode) {
    this.isNotWaitingNeuronNodeDocking = true;
    this.neuronsNodesPool.put(neuronNode);
  },

  onDestroy() {
    this.node.off('touchstart', this.onAddNeuronToScene, this);
    this.neuronsNodesPool.clear();
  },
});
