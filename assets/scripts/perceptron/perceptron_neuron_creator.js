cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');

    this.neuronsNodesPool = new cc.NodePool();
    this.createNeuronsNodes();

    this.isReadyCreateNeuronNode = true;

    this.node.on('touchstart', this.onAddNeuronNodeToScene, this);
  },

  onDestroy() {
    this.node.off('touchstart', this.onAddNeuronToScene, this);
    this.neuronsNodesPool.clear();
  },

  onCollisionStay(other, self) {
    if (other.node.name === 'neuron') {
      this.preparationNeuronNodeDestroying(other, self);
    }
  },

  createNeuronsNodes(quantity = 2 ** 5) {
    for (let i = 0; i < quantity; i++) {
      const neuronNode = cc.instantiate(this.neuronPrefab);
      this.neuronsNodesPool.put(neuronNode);
    }
  },

  onAddNeuronNodeToScene() {
    if (this.isReadyCreateNeuronNode) {
      this.isReadyCreateNeuronNode = false;

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
    neuronNode.setPosition(this.node.position);

    this.neuronsNode.addChild(neuronNode);
  },

  // TODO анимация готовности создателя нейронов принять нейрон для уничтожения.
  //  две стадии создателя: когда пересекается с нейроном - подготовливается,
  //  когда нейрон полностью в создателе - готов к уничтожению.
  preparationNeuronNodeDestroying(other, self) {
    if (this.isReadyCreateNeuronNode) {
      const [{ x, y }] = self.world.points; // top left
      const { width, height } = self.node;
      const centerPoint = cc.v2(x + width / 2, y - height / 2); // neuron creator
      const isIntersection = cc.Intersection.pointInPolygon(centerPoint, other.world.points);

      if (isIntersection) {
        this.neuronNodeDestroy(other.node);
      }
    } else {
      // TODO если брошен на этой стадии, то?
    }
  },

  neuronNodeDestroy(neuronNode) {
    this.neuronsNodesPool.put(neuronNode);
    this.isReadyCreateNeuronNode = true;
  },

  externalSetReadyCreateNeuronNode({ isReady }) {
    this.isReadyCreateNeuronNode = isReady;
  },

  externalNeuronNodeDestroy(neuronNode) {
    this.neuronNodeDestroy(neuronNode);
  },
});
