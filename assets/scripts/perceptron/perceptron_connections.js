const radianToDegrees = 180 / Math.PI;

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('neurons', this.node.parent);

    this.isCreatedShadowConnectionsNodes = false;
    this.connectionsNodes = [];

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();
  },

  update() {
    if (this.isCreatedShadowConnectionsNodes) {
      this.connectionsNodes.forEach(this.changeConnectionNodeParameters);
    }
  },

  onDestroy() {
    this.connectionsNodes = [];
    this.connectionsNodesPool.clear();
  },

  createConnectionsNodes(quantity = 2 ** 7) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

  externalCreateShadowConnectionsNodes(capturedNeuronNode) {
    this.isCreatedShadowConnectionsNodes = false;

    this.neuronsNode.children.forEach((neuronNode) => {
      if (capturedNeuronNode.uuid !== neuronNode.uuid) {
        this.connectionsNodesPoolSizeCheck();
        this.addConnectionNodeToScene({ capturedNeuronNode, neuronNode });
      }
    });

    this.isCreatedShadowConnectionsNodes = true;
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  addConnectionNodeToScene({ capturedNeuronNode, neuronNode }) {
    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = { capturedNeuronNode, neuronNode };

    this.changeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.push(connectionNode);
  },

  changeConnectionNodeParameters(connectionNode) {
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
    this.isCreatedShadowConnectionsNodes = false;

    // this.connectionsNodes.forEach((connectionNode) => {
    //   connectionNode.neuronsNodes = {};
    //   this.connectionsNodesPool.put(connectionNode);
    // });
    //
    // this.connectionsNodes = [];
  },
});
