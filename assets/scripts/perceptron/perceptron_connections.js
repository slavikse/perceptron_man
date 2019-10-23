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

  // TODO: больше смахивает на отдельный контролирующий всё, модуль.
  captureNeuronNode({ detail: { isCaptured, capturedNeuronNode } }) {
    this.isCapturedNeuronNode = isCaptured;

    // TODO: isBase
    if (!this.isCapturedNeuronNode && !capturedNeuronNode.state.isBase) {
      this.сlearingUnconnectedNeuronsNodesFromBaseNode();
    }
  },

  // TODO: проверка: все нейроны имеют соединение с питающим сеть (начальным).
  // могут остаться одинокие нейроны соединённым между собой,
  // которые должны быть уничтожены, а так же нейроны не соединённые ни с кем.
  сlearingUnconnectedNeuronsNodesFromBaseNode() {
    const {
      activeConnectionsNodes,
      neuronsNodesConnectedToBase,
    } = this.prepareClearingUnconnectedNeuronsNodesFromBaseNode();

    this.clearingUnconnectedNeuronsNodesFromBaseNode({
      activeConnectionsNodes,
      neuronsNodesConnectedToBase,
    });

    // TODO: после этого, останутся нейроны, которые не связаны с базовыми.
    //  найти их и удалить.

    // TODO: -> FN
    // TODO: не разрушаются при пересечении трека.
    this.neuronsNode.children.forEach((neuronNode) => {
      console.log(
        'trackId', neuronNode.state.trackId,
        'has', neuronsNodesConnectedToBase.has(neuronNode),
      );

      if (
        // TODO: пока так. базовый зафиксирован.
        !neuronNode.state.isBase
        && neuronNode.state.trackId !== -2
        && (
          neuronNode.state.trackId === -1
          || !neuronsNodesConnectedToBase.has(neuronNode)
        )
      ) {
        // TODO: при удалении нейрона, удаляется его соединение,
        // при этом останется его сосед. поэтому лучше наверное удалять всё тут.
        // this.connectionNodeDestroy(connectionNode);
        this.neuronNodeDestroy(neuronNode);
        this.destroingConnectionsNodes(neuronNode);
      }
    });
  },

  // TODO: вынести в отдельный модуль
  prepareClearingUnconnectedNeuronsNodesFromBaseNode() {
    const activeConnectionsNodes = new Set();
    const neuronsNodesConnectedToBase = new Set();

    this.connectionsNodes.forEach((connectionNode) => {
      if (connectionNode.active) {
        activeConnectionsNodes.add(connectionNode);

        const {
          neuronsNodes: {
            capturedNeuronNode,
            neuronNode,
          },
        } = connectionNode;

        if (capturedNeuronNode.state.isBase) {
          neuronsNodesConnectedToBase.add(capturedNeuronNode);
        } else if (neuronNode.state.isBase) {
          neuronsNodesConnectedToBase.add(neuronNode);
        }
      }
    });

    return { activeConnectionsNodes, neuronsNodesConnectedToBase };
  },

  // TODO: вынести в отдельный модуль
  clearingUnconnectedNeuronsNodesFromBaseNode({
    activeConnectionsNodes,
    neuronsNodesConnectedToBase,
  }) {
    activeConnectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: {
          capturedNeuronNode,
          neuronNode,
        },
      } = connectionNode;

      if (neuronsNodesConnectedToBase.has(capturedNeuronNode)) {
        neuronsNodesConnectedToBase.add(neuronNode);
        // TODO: когда удаляется соединение, то нейроны должны быть удалены.
        activeConnectionsNodes.delete(connectionNode);
      } else if (neuronsNodesConnectedToBase.has(neuronNode)) {
        neuronsNodesConnectedToBase.add(capturedNeuronNode);
        activeConnectionsNodes.delete(connectionNode);
      }
    });

    console.log('activeConnectionsNodes.size', activeConnectionsNodes.size, this.connectionsNodes.size);

    // TODO: обязательно останется сколько то соединений...
    // if (activeConnectionsNodes.size > 0) {
    //   this.clearingUnconnectedNeuronsNodesFromBaseNode({
    //     activeConnectionsNodes,
    //     neuronsNodesConnectedToBase,
    //   });
    // }
  },

  neuronNodeDestroy(nodeDestroyed) {
    const e = new cc.Event.EventCustom('perceptron/neuronNodeDestroy');
    e.detail = { nodeDestroyed };
    cc.director.dispatchEvent(e);
  },

  destroingConnectionsNodes(destroyedNeuronNode) {
    this.connectionsNodes.forEach((connectionNode) => {
      const {
        neuronsNodes: {
          capturedNeuronNode,
          neuronNode,
        },
      } = connectionNode;

      if (
        destroyedNeuronNode.uuid === capturedNeuronNode.uuid
        || destroyedNeuronNode.uuid === neuronNode.uuid
      ) {
        this.connectionNodeDestroy(connectionNode);
      }
    });
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

  connectionNodeDestroy(connectionNode) {
    connectionNode.neuronsNodes = {};

    this.connectionsNodes.delete(connectionNode);
    this.connectionsNodesPool.put(connectionNode);
  },
});
