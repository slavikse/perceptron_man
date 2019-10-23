cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('neurons', this.node.parent);
    this.neuronsNodesPool = new cc.NodePool();

    // TODO:
    this.isFirst = true;

    this.createNeuronsNodes();
    this.addNeuronNode();

    this.isNeuronNodeInside = true;

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
    this.isNeuronNodeInside = true;
  },

  onCollisionExit() {
    this.isNeuronNodeInside = false;
  },

  createNeuronsNodes(quantity = 2 ** 5) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsNodesPool.put(neuronNode);
    }
  },

  // TODO: стартовая площадка не будет иметь возможности держать на себе нейрон:
  // когда нейрон схвачен, то площадка закрывается (анимация),
  // обратно положить нейрон нельзя!
  addNeuronNode() {
    const neuronNode = this.neuronsNodesPool.get();
    neuronNode.position = this.node.position;

    // TODO: когда в сеть добавляется самый первый нейрон - он базовый.
    // базовый, когда подключён к питанию!
    neuronNode.state = {
      // TODO: если будет нужно переназначить основной нейрон при уничтожении
      // или создавать несколько.
      // TODO: корневых будет несколько.
      isBase: this.isFirst,
    };

    this.isFirst = false;

    this.neuronsNode.addChild(neuronNode);
  },

  captureNeuronNode({ detail: { isCaptured } }) {
    if (!this.isNeuronNodeInside && !isCaptured) {
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
