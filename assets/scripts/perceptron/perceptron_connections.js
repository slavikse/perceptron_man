cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');

    this.isCreatedConnectionsNodes = false;

    this.connectionsNodes = new Set();
    this.connectionsNodesPool = new cc.NodePool();

    this.createConnectionsNodes();
  },

  update() {
    if (this.isCreatedConnectionsNodes) {
      this.connectionsNodes.forEach(this.changeConnectionNodeParameters);
    }
  },

  onDestroy() {
    this.connectionsNodes.clear();
    this.connectionsNodesPool.clear();
  },

  createConnectionsNodes(quantity = 2 ** 7) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

  // TODO связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  externalCreateConnectionsNodes(capturedNeuronNode) {
    this.isCreatedConnectionsNodes = false;

    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения для схваченного узла с самим собой.
      if (capturedNeuronNode.uuid !== neuronNode.uuid) {
        this.connectionsNodesPoolSizeCheck();
        this.addConnectionNodeToScene({ capturedNeuronNode, neuronNode });
      }
    });

    this.isCreatedConnectionsNodes = true;
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  addConnectionNodeToScene(neuronsNodes) {
    if (this.preventReAddingConnectionNode(neuronsNodes)) {
      return;
    }

    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = neuronsNodes;

    this.changeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.add(connectionNode);
  },

  preventReAddingConnectionNode({ capturedNeuronNode, neuronNode }) {
    let isPrevented = false;

    this.connectionsNodes.forEach(({ neuronsNodes }) => {
      if (
        (capturedNeuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid
          && neuronNode.uuid === neuronsNodes.neuronNode.uuid)
        || (capturedNeuronNode.uuid === neuronsNodes.neuronNode.uuid
          && neuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid)
      ) {
        isPrevented = true;
      }
    });

    return isPrevented;
  },

  // TODO связь рвется, если длинее, чем ограничения правилами строения - послойное.
  changeConnectionNodeParameters(connectionNode) {
    const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
    const subtractedPosition = capturedNeuronNode.position.sub(neuronNode.position);

    const { x, y } = subtractedPosition;
    const degB = Math.atan(x / y) * cc.macro.DEG;

    connectionNode.position = neuronNode.position;
    connectionNode.width = subtractedPosition.mag();

    if (y >= 0) {
      connectionNode.angle = 90 - degB;
    } else {
      connectionNode.angle = 270 - degB;
    }
  },

  externalMountingConnectionsNodes() {
    this.isCreatedConnectionsNodes = false;
    this.connectionsNodes.forEach(this.changeConnectionNodeParameters);
  },

  externalDestroingConnectionsNodes(neuronNode) {
    this.connectionsNodes.forEach((connectionNode) => {
      if (
        neuronNode.uuid === connectionNode.neuronsNodes.capturedNeuronNode.uuid
        || neuronNode.uuid === connectionNode.neuronsNodes.neuronNode.uuid
      ) {
        this.connectionNodeDestroy(connectionNode);
      }
    });
  },

  connectionNodeDestroy(connectionNode) {
    connectionNode.neuronsNodes = {};

    this.connectionsNodes.delete(connectionNode);
    this.connectionsNodesPool.put(connectionNode);
  },
});
