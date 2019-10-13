cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('neurons', this.node.parent);

    this.neuronsNodesPool = new cc.NodePool();

    this.createNeuronsNodes();
    this.addNeuronNode();

    this.isInsideNeuronNode = true;

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.on(
      'perceptron/neuronNodeDestroy',
      this.neuronNodeDestroy,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.off(
      'perceptron/neuronNodeDestroy',
      this.neuronNodeDestroy,
      this,
    );

    this.neuronsNodesPool.clear();
  },

  onCollisionStay() {
    this.isInsideNeuronNode = true;
  },

  onCollisionExit() {
    this.isInsideNeuronNode = false;
  },

  createNeuronsNodes(quantity = 2 ** 5) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsNodesPool.put(neuronNode);
    }
  },

  // TODO анимация создания.
  addNeuronNode() {
    const neuronNode = this.neuronsNodesPool.get();
    // TODO со смещением под будущую подставку.
    neuronNode.position = this.node.position;

    this.neuronsNode.addChild(neuronNode);
  },

  captureNeuronNode({ detail: { isCaptured } }) {
    if (!this.isInsideNeuronNode && !isCaptured) {
      this.neuronsNodesPoolSizeCheck();
      this.addNeuronNode();
    }
  },

  neuronsNodesPoolSizeCheck() {
    if (this.neuronsNodesPool.size() === 0) {
      this.createNeuronsNodes();
    }
  },

  neuronNodeDestroy({ detail: { nodeDestroyed } }) {
    this.neuronsNodesPool.put(nodeDestroyed);
  },
});
