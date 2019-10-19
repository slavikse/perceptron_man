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

  // TODO: эффект появления: частицы.
  onEnable() {
  },

  update() {
    if (this.isCapturedNeuronNode) {
      this.connectionsNodes.forEach(this.setConnectionNodeActivation);
    }
  },

  // TODO: эффект разрушения: частицы.
  onDisable() {
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

  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    this.isCapturedNeuronNode = isCaptured;

    if (!isCaptured) {
      this.checkConnectionsNodesActivityFor(capturedNeuronNode);
    }
  },

  checkConnectionsNodesActivityFor(currentCapturedNeuronNode) {
    if (this.connectionsNodes.size > 0) {
      let activeConnectionNode = 0;

      this.walkConnectionsNodes({
        inspectNeuronNode: currentCapturedNeuronNode,
        executeForConnectionNode: (connectionNode) => {
          if (connectionNode.active) {
            activeConnectionNode += 1;
          }
        },
      });

      // TODO: не разрушать, если нейрон на стартовой площадке
      // стартовая площадка не будет иметь возможности держать на себе нейрон,
      // когда нейрон схвачен, то площадка закрывается (анимация), обратно
      // положить нейрон нельзя.
      if (activeConnectionNode === 0) {
        console.log('событие для разрушения нейрона');
        this.neuronNodeDestroy(currentCapturedNeuronNode);
      }
    }
  },

  walkConnectionsNodes({ inspectNeuronNode, executeForConnectionNode }) {
    this.connectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: { capturedNeuronNode, neuronNode },
      } = connectionNode;

      if (
        inspectNeuronNode.uuid === capturedNeuronNode.uuid
        || inspectNeuronNode.uuid === neuronNode.uuid
      ) {
        executeForConnectionNode(connectionNode);
      }
    });
  },

  neuronNodeDestroy(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },

  addingConnectionsNodes({ detail: { capturedNeuronNode } }) {
    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения с собой для захваченного узла.
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
      console.log(trackIdDifference);
      changeConnectionNodeParameters(connectionNode);
      connectionNode.active = true;
    } else {
      connectionNode.active = false;
    }
  },

  // TODO: проверка: все нейроны имеют соединение с питающим сеть (начальным).
  // могут остаться одинокие нейроны соединённым между собой, которые
  // должны быть уничтожены.
  destroingConnectionsNodes({ detail: { destroyedNeuronNode } }) {
    this.walkConnectionsNodes({
      inspectNeuronNode: destroyedNeuronNode,
      executeForConnectionNode: (connectionNode) => {
        this.connectionNodeDestroy(connectionNode);
      },
    });
  },

  connectionNodeDestroy(connectionNode) {
    connectionNode.neuronsNodes = {};

    this.connectionsNodes.delete(connectionNode);
    this.connectionsNodesPool.put(connectionNode);
  },
});
