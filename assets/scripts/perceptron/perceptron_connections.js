const radianToDegrees = 180 / Math.PI;

cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNode = cc.find('level/perceptron/neurons');

    this.isCreatedConnectionsNodes = false;
    this.connectionsNodes = [];

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();
  },

  update() {
    if (this.isCreatedConnectionsNodes) {
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

  externalCreateConnectionsNodes(capturedNeuronNode) {
    this.isCreatedConnectionsNodes = false;

    this.neuronsNode.children.forEach((neuronNode) => {
      // Предотвращение добавления соединения схваченного узла с самим собой.
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

  addConnectionNodeToScene(neuronsNodes) {
    if (this.preventReAddingConnectionNode(neuronsNodes)) {
      return;
    }

    const connectionNode = this.connectionsNodesPool.get();
    connectionNode.neuronsNodes = neuronsNodes;

    this.changeConnectionNodeParameters(connectionNode);

    this.node.addChild(connectionNode);
    this.connectionsNodes.push(connectionNode);
  },

  preventReAddingConnectionNode({ capturedNeuronNode, neuronNode }) {
    return this.connectionsNodes.find(({ neuronsNodes }) => (
      capturedNeuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid
      && neuronNode.uuid === neuronsNodes.neuronNode.uuid
    ) || (
      capturedNeuronNode.uuid === neuronsNodes.neuronNode.uuid
      && neuronNode.uuid === neuronsNodes.capturedNeuronNode.uuid
    ));
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

  externalMountingConnectionsNodes() {
    this.isCreatedConnectionsNodes = false;
    this.connectionsNodes.forEach(this.changeConnectionNodeParameters);
  },
});
