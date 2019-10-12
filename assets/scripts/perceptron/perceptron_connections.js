const {
  preventReAddingConnectionNode,
  changeConnectionNodeParameters,
} = require('perceptron_utils_connection');

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');

    this.connectionsNodes = new Set();
    this.connectionsNodesPool = new cc.NodePool();

    this.isCreatedConnectionsNodes = false;

    this.createConnectionsNodes();

    cc.director.on(
      'perceptron/neuron/addConnectionsNodes',
      this.addConnectionsNodes,
      this,
    );

    cc.director.on(
      'perceptron/neuron/mountingConnectionsNodes',
      this.mountingConnectionsNodes,
      this,
    );

    cc.director.on(
      'perceptron/neuron/destroingConnectionsNodes',
      this.destroingConnectionsNodes,
      this,
    );
  },

  // TODO связь рвется, если длинее, чем ограничения правилами строения - послойное.
  update() {
    if (this.isCreatedConnectionsNodes) {
      this.connectionsNodes.forEach(changeConnectionNodeParameters);
    }
  },

  onDestroy() {
    cc.director.off(
      'perceptron/neuron/addConnectionsNodes',
      this.addConnectionsNodes,
      this,
    );

    cc.director.off(
      'perceptron/neuron/mountingConnectionsNodes',
      this.mountingConnectionsNodes,
      this,
    );

    cc.director.off(
      'perceptron/neuron/destroingConnectionsNodes',
      this.destroingConnectionsNodes,
      this,
    );

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

  addConnectionsNodes({ detail: { capturedNeuronNode } }) {
    this.isCreatedConnectionsNodes = false;

    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения с собой для схваченного узла.
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
    if (preventReAddingConnectionNode(this.connectionsNodes, neuronsNodes)) {
      return;
    }

    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = neuronsNodes;

    changeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.add(connectionNode);
  },

  mountingConnectionsNodes() {
    this.isCreatedConnectionsNodes = false;
    this.connectionsNodes.forEach(changeConnectionNodeParameters);

    cc.director.dispatchEvent(
      new cc.Event.EventCustom('perceptron/connection/playAnimation'),
    );
  },

  destroingConnectionsNodes({ detail: { nodeDestroyed } }) {
    this.connectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: { capturedNeuronNode, neuronNode },
      } = connectionNode;

      if (
        nodeDestroyed.uuid === capturedNeuronNode.uuid
        || nodeDestroyed.uuid === neuronNode.uuid
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
