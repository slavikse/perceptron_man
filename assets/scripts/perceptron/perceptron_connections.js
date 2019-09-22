const radianToDegrees = 180 / Math.PI;

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.isStageCreateShadowConnections = false;

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();

    this.connectionsNodes = [];
  },

  // todo разрушение связей при двойном клике - построение индивидуальной сети.
  //  потребляет меньше энергии?

  update() {
    if (this.isStageCreateShadowConnections) {
      this.connectionsNodes.forEach(this.setStateNodesConnection);
    }
  },

  createConnectionsNodes(quantity = 2 ** 8) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

  externalComponentCreateShadowConnections(capturedNeuronNode) {
    const neuronsNode = this.node.parent;

    if (neuronsNode.childrenCount < 1) {
      return;
    }

    neuronsNode.children.forEach((neuronNode) => {
      if (capturedNeuronNode.uuid !== neuronNode.uuid) {
        this.connectionsNodesPoolSizeCheck();
        this.configureNodesConnection({ capturedNeuronNode, neuronNode });
      }
    });

    this.isStageCreateShadowConnections = true;
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  configureNodesConnection({ capturedNeuronNode, neuronNode }) {
    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = { capturedNeuronNode, neuronNode };

    this.setStateNodesConnection(connectionNode);

    neuronNode.addChild(connectionNode);
    this.connectionsNodes.push(connectionNode);
  },

  setStateNodesConnection(connectionNode) {
    const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
    const subtractedPosition = capturedNeuronNode.position.sub(neuronNode.position);

    const { x, y } = subtractedPosition;
    const degB = Math.atan(x / y) * radianToDegrees;
    const normalAngle = 90 - degB;

    connectionNode.width = subtractedPosition.mag();

    if (y > 0) {
      connectionNode.angle = normalAngle;
    } else {
      connectionNode.angle = 180 + normalAngle;
    }
  },

  // todo визуализация связей при установке - прозрачные, после установки нормальные.
  externalComponentMountingShadowConnections() {
    this.isStageCreateShadowConnections = false;

    this.connectionsNodes.forEach((connectionNode) => {
      connectionNode.neuronsNodes = {};
      this.connectionsNodesPool.put(connectionNode);
    });

    this.connectionsNodes = [];
  },
});
