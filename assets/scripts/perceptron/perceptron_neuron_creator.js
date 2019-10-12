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

    cc.director.on(
      'perceptron/neuron/creator/setReadyCreateNeuronNode',
      this.setReadyCreateNeuronNode,
      this,
    );

    this.node.on('touchstart', this.onAddNeuronNodeToScene, this);
  },

  onDestroy() {
    cc.director.off(
      'perceptron/neuron/creator/setReadyCreateNeuronNode',
      this.setReadyCreateNeuronNode,
      this,
    );

    this.node.off('touchstart', this.onAddNeuronNodeToScene, this);

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

  setReadyCreateNeuronNode({ detail: { isReady } }) {
    this.isReadyCreateNeuronNode = isReady;
  },

  // TODO анимация при создании.
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
    neuronNode.position = this.node.position;

    this.neuronsNode.addChild(neuronNode);
  },

  // TODO анимация готовности создателя нейронов принять нейрон для уничтожения.
  //  две стадии создателя: когда пересекается с нейроном - подготовливается,
  //  когда нейрон полностью в создателе - готов к уничтожению.
  preparationNeuronNodeDestroying(neuron, creator) {
    if (this.isReadyCreateNeuronNode) {
      const [{ x, y }] = creator.world.points; // top left
      const { width, height } = creator.node;
      const creatorCenterPoint = cc.v2(x + width / 2, y - height / 2);
      const isNeuronInside = cc.Intersection.pointInPolygon(
        creatorCenterPoint,
        neuron.world.points,
      );

      if (isNeuronInside) {
        this.neuronNodeDestroy(neuron.node);
      }
    } else {
      // TODO если брошен на этой стадии, то?
    }
  },

  neuronNodeDestroy(neuronNode) {
    this.neuronsNodesPool.put(neuronNode);
    this.isReadyCreateNeuronNode = true;
  },

  // TODO ослабление связности через собятие.
  // externalNeuronNodeDestroy(neuronNode) {
  //   this.neuronNodeDestroy(neuronNode);
  // },
});
