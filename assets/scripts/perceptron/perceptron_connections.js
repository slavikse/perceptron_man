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
    this.neuronsNode = cc.find('neurons', this.node.parent);

    this.connectionsNodes = new Set();
    this.connectionsNodesPool = new cc.NodePool();

    this.isCapturedNeuronNode = false;

    this.createConnectionsNodes();

    cc.director.on(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.on(
      'perceptron/addingConnectionsNodes',
      this.addingConnectionsNodes,
      this,
    );

    cc.director.on(
      'perceptron/destroingConnectionsNodes',
      this.destroingConnectionsNodes,
      this,
    );
  },

  update() {
    if (this.isCapturedNeuronNode) {
      this.connectionsNodes.forEach(this.setConnectionNodeActivation);
    }
  },

  onDestroy() {
    cc.director.off(
      'perceptron/captureNeuronNode',
      this.captureNeuronNode,
      this,
    );

    cc.director.off(
      'perceptron/addingConnectionsNodes',
      this.addingConnectionsNodes,
      this,
    );

    cc.director.off(
      'perceptron/destroingConnectionsNodes',
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

  captureNeuronNode({ detail: { isCaptured } }) {
    this.isCapturedNeuronNode = isCaptured;
  },

  addingConnectionsNodes({ detail: { capturedNeuronNode } }) {
    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения с собой для схваченного узла.
      // А так же для нейрона, который только что был создан.
      if (
        capturedNeuronNode.uuid !== neuronNode.uuid
        && neuronNode.state.trackId !== -1
      ) {
        this.connectionsNodesPoolSizeCheck();
        this.addConnectionNode({ capturedNeuronNode, neuronNode });
      }
    });
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  // TODO эффект появления: частицы.
  addConnectionNode(neuronsNodes) {
    if (preventReAddingConnectionNode(this.connectionsNodes, neuronsNodes)) {
      return;
    }

    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = neuronsNodes;

    changeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.add(connectionNode);
  },

  setConnectionNodeActivation(connectionNode) {
    const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
    const trackIdDifference = Math.abs(
      capturedNeuronNode.state.trackId - neuronNode.state.trackId,
    );

    if (trackIdDifference === 1) {
      changeConnectionNodeParameters(connectionNode);
      connectionNode.active = true;
    } else {
      connectionNode.active = false;
    }
  },

  destroingConnectionsNodes({ detail: { destroyedNeuronNode } }) {
    this.connectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: { capturedNeuronNode, neuronNode },
      } = connectionNode;

      if (
        destroyedNeuronNode.uuid === capturedNeuronNode.uuid
        || destroyedNeuronNode.uuid === neuronNode.uuid
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
