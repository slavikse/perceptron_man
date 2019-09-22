const radianToDegrees = 180 / Math.PI;

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  // todo разрушение соединения (разрушение через долгое зажатие)
  //  если нейрон остался без соединений - он разрушается.
  // todo эффект разрушения соединения.
  onLoad() {
    this.isStageCreateShadowConnections = false;

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();

    this.connectionsNodes = [];

    this.node.on('touchstart', this.onRunSchedulerDestructionConnection, this);
    // this.node.on('touchend', this.onDestructionConnection, this);
  },

  update() {
    if (this.isStageCreateShadowConnections) {
      this.connectionsNodes.forEach(this.setStateConnectionNode);
    }
  },

  onDestroy() {
    this.node.off('touchstart', this.onRunSchedulerDestructionConnection, this);
    // this.node.off('touchend', this.onDestructionConnection, this);
  },

  createConnectionsNodes(quantity = 2 ** 8) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      connectionNode.neuronsNodes = {};

      this.connectionsNodesPool.put(connectionNode);
    }
  },

  onRunSchedulerDestructionConnection() {

  },

  externalComponentCreateShadowConnections(capturedNeuronNode) {
    const neuronsNode = this.node.parent;

    if (neuronsNode.childrenCount < 1) {
      return;
    }

    neuronsNode.children.forEach((neuronNode) => {
      if (capturedNeuronNode.uuid !== neuronNode.uuid) {
        this.connectionsNodesPoolSizeCheck();
        this.addConnectionNodeToScene({ capturedNeuronNode, neuronNode });
      }
    });

    this.isStageCreateShadowConnections = true;
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  // todo соединение до должно быть поверх узла.
  addConnectionNodeToScene({ capturedNeuronNode, neuronNode }) {
    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = { capturedNeuronNode, neuronNode };

    this.setStateConnectionNode(connectionNode);

    neuronNode.addChild(connectionNode);
    this.connectionsNodes.push(connectionNode);
  },

  setStateConnectionNode(connectionNode) {
    const { capturedNeuronNode, neuronNode } = connectionNode.neuronsNodes;
    const subtractedPosition = capturedNeuronNode.position.sub(neuronNode.position);

    const { x, y } = subtractedPosition;
    const degB = Math.atan(x / y) * radianToDegrees;
    const normalAngle = 90 - degB;

    connectionNode.width = subtractedPosition.mag();

    if (y >= 0) {
      connectionNode.angle = normalAngle;
    } else {
      connectionNode.angle = 180 + normalAngle;
    }
  },

  // todo визуализация связей при установке - прозрачные, после установки нормальные.
  externalComponentMountingShadowConnections() {
    this.isStageCreateShadowConnections = false;

    // this.connectionsNodes.forEach((connectionNode) => {
    //   connectionNode.neuronsNodes = {};
    //   this.connectionsNodesPool.put(connectionNode);
    // });
    //
    // this.connectionsNodes = [];
  },
});
