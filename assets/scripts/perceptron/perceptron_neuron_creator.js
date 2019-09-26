cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/neurons');

    this.neuronsNodesPool = new cc.NodePool();
    this.createNeuronsNodes();

    this.isNotWaitingNeuronNodeDocking = true;

    this.node.on('touchstart', this.onAddNeuronNodeToScene, this);
  },

  onDestroy() {
    this.node.off('touchstart', this.onAddNeuronToScene, this);
    this.neuronsNodesPool.clear();
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

  // todo эффект появления: частицы.
  addNeuronNodeToScene() {
    const neuronNode = this.neuronsNodesPool.get();
    neuronNode.setPosition(this.node.position);

    this.neuronsNode.addChild(neuronNode);
  },

  externalNeuronNodeDocked() {
    this.isNotWaitingNeuronNodeDocking = true;
  },

  externalNeuronNodeDestroy(neuronNode) {
    this.isNotWaitingNeuronNodeDocking = true;
    this.neuronsNodesPool.put(neuronNode);
  },
});
