cc.Class({
  extends: cc.Component,

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');
    this.connectionComponent = this.node.getComponent('perceptron_connection');

    this.isCreatedConnectionsNodes = false;

    this.connectionsNodes = new Set();
    this.connectionsNodesPool = new cc.NodePool();

    this.createConnectionsNodes();
  },

  update() {
    if (this.isCreatedConnectionsNodes) {
      this.connectionsNodes.forEach(this.connectionComponent.externalChangeConnectionNodeParameters);
    }
  },

  onDestroy() {
    this.connectionsNodes.clear();
    this.connectionsNodesPool.clear();
  },

  createConnectionsNodes(quantity = 2 ** 7) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionComponent.externalConnectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

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

  // TODO связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  addConnectionNodeToScene(neuronsNodes) {
    if (this.connectionComponent.externalPreventReAddingConnectionNode(this.connectionsNodes, neuronsNodes)) {
      return;
    }

    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = neuronsNodes;

    this.connectionComponent.externalChangeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.add(connectionNode);
  },

  externalMountingConnectionsNodes() {
    this.isCreatedConnectionsNodes = false;
    this.connectionsNodes.forEach(this.connectionComponent.externalChangeConnectionNodeParameters);
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
