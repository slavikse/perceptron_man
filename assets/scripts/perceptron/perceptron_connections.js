const preventReAddingConnectionNode = require(
  'perceptron_utils_preventReAddingConnectionNode',
);

const changeConnectionNodeParameters = require(
  'perceptron_utils_changeConnectionNodeParameters',
);

const searchActiveAndConnectedToBaseNeuronsNodes = require(
  'perceptron_utils_searchActiveAndConnectedToBaseNeuronsNodes',
);

const getNeuronsNodesAdjacentToBase = require(
  'perceptron_utils_getNeuronsNodesAdjacentToBase',
);

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
      this.onDestroingConnectionsNodes,
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
      this.onDestroingConnectionsNodes,
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

    if (!isCaptured) {
      this.cleanUpOrphanedNeuronsNodes();
    }
  },

  cleanUpOrphanedNeuronsNodes() {
    const n = searchActiveAndConnectedToBaseNeuronsNodes(this.connectionsNodes);
    const adjacentNeuronsNodes = getNeuronsNodesAdjacentToBase(n);

    this.deepSearchForOrphanedNeuronsNodes(adjacentNeuronsNodes);
  },

  deepSearchForOrphanedNeuronsNodes(adjacentNeuronsNodes) {
    this.neuronsNode.children.forEach((neuronNode) => {
      if (
        !neuronNode.state.isBase
        && neuronNode.state.trackId !== -2
        && (
          neuronNode.state.trackId === -1
          || !adjacentNeuronsNodes.has(neuronNode)
        )
      ) {
        this.destroingConnectionsNodes(neuronNode);
        this.neuronNodeDestroy(neuronNode);

        // Могут остаться нейроны, которые после удаления нейрона,
        // остались соединены между собой, но не соединены с базовыми.
        this.cleanUpOrphanedNeuronsNodes();
      }
    });
  },

  destroingConnectionsNodes(nodeDestroyed) {
    this.connectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: {
          capturedNeuronNode,
          neuronNode,
        },
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

  neuronNodeDestroy(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },

  onDestroingConnectionsNodes({ detail: { nodeDestroyed } }) {
    this.destroingConnectionsNodes(nodeDestroyed);
  },

  addingConnectionsNodes({ detail: { capturedNeuronNode } }) {
    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения с собой для захваченного узла.
      // А так же для нейрона, который только что был создан.
      if (
        capturedNeuronNode.uuid !== neuronNode.uuid
        && neuronNode.state.trackId !== -2
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
});
