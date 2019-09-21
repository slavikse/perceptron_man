cc.Class({
  extends: cc.Component,

  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    this.neuronsNodes = this.node.parent;
    this.isStageCreateConnectionsNodes = false;

    this.connectionsNodesPool = new cc.NodePool();
    this.createConnectionsNodes();
  },

  // todo разрушение связей при двойном клике - построение индивидуальной сети.
  //  потребляет меньше энергии?

  // update() {
  //   if (this.isStageCreateConnectionsNodes) {
  //     const [one, two] = this.neuronsNodes.children;
  //     const distance = one.position.sub(two.position).mag();
  //     this.connectionNode.width = distance;
  //   }
  // },

  createConnectionsNodes(quantity = 2 ** 8) {
    for (let i = 0; i < quantity; i++) {
      const connectionNode = cc.instantiate(this.connectionPrefab);
      this.connectionsNodesPool.put(connectionNode);
    }
  },

  externalComponentCreateShadowConnections() {
    this.isStageCreateConnectionsNodes = true;

    // todo соединять созданного (текущего) с закрепленными.
    // todo one - взятый узел! последний узел в списке узлов
    //  this.neuronsNodes[this.neuronsNodes.length - 1]
    const [one, two] = this.neuronsNodes.children;

    this.connectionsNodesPoolSizeCheck();
    const connectionNode = this.connectionsNodesPool.get();
    const [wheelJointOne, wheelJointTwo] = connectionNode.getComponents(cc.WheelJoint);

    wheelJointOne.connectedBody = one.getComponent(cc.RigidBody);
    wheelJointTwo.connectedBody = two.getComponent(cc.RigidBody);

    connectionNode.width = one.position.sub(two.position).mag();

    two.addChild(connectionNode);
  },

  connectionsNodesPoolSizeCheck() {
    if (this.connectionsNodesPool.size() === 0) {
      this.createConnectionsNodes();
    }
  },

  // todo визуализация связей при установке - прозрачные, после установки нормальные.
  // todo для нового нейрона - переплетение связями со всеми нейронами.

  // todo связи можно будет создать при выполнении условий.
  //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
  externalComponentMountingShadowConnections() {},
});
