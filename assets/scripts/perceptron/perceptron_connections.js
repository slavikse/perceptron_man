const radianToDegrees = 180 / Math.PI;

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    const perceptronNode = this.node.parent;
    this.neuronsNode = cc.find('neurons', perceptronNode);

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();

    this.isCreateShadowConnectionsNodes = false;
    this.connectionsNodes = [];
  },

  update() {
    if (this.isCreateShadowConnectionsNodes) {
      this.connectionsNodes.forEach(this.setStateConnectionNode);
    }
  },

  createConnectionsNodes(quantity = 2 ** 7) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

  externalCreateShadowConnectionsNodes(capturedNeuronNode) {
    this.neuronsNode.children.forEach((neuronNode) => {
      if (capturedNeuronNode.uuid !== neuronNode.uuid) {
        this.connectionsNodesPoolSizeCheck();
        this.addConnectionNodeToScene({ capturedNeuronNode, neuronNode });
      }
    });

    this.isCreateShadowConnectionsNodes = true;
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  addConnectionNodeToScene({ capturedNeuronNode, neuronNode }) {
    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = { capturedNeuronNode, neuronNode };

    this.setStateConnectionNode(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.push(connectionNode);
  },

  setStateConnectionNode(connectionNode) {
    const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
    const subtractedPosition = capturedNeuronNode.position.sub(neuronNode.position);

    const { x, y } = subtractedPosition;
    const degB = Math.atan(x / y) * radianToDegrees;
    const normalAngle = 90 - degB;

    connectionNode.position = neuronNode.position;
    connectionNode.width = subtractedPosition.mag();

    if (y >= 0) {
      connectionNode.angle = normalAngle;
    } else {
      connectionNode.angle = 180 + normalAngle;
    }
  },

  // todo визуализация связей при установке - прозрачные, после установки нормальные.
  externalMountingShadowConnectionsNodes() {
    this.isCreateShadowConnectionsNodes = false;

    this.connectionsNodes.forEach((connectionNode) => {
      connectionNode.neuronsNodes = {};
      this.connectionsNodesPool.put(connectionNode);
    });

    this.connectionsNodes = [];
  },
});
