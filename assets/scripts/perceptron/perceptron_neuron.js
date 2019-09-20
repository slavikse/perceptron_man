cc.Class({
  extends: cc.Component,

  // todo вынести функционал работы со связами в компонент
  properties: {
    connectionPrefab: cc.Prefab,
  },

  onLoad() {
    const perceptronCreatorNode = cc.find('level/perceptron/creator');
    this.perceptronCreatorComponent = perceptronCreatorNode.getComponent('perceptron_creator');
    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  // todo после установки в сеть - нейрон нельзя перетаскивать?
  // todo появляются новые возможности: разрушение при двойном клике. другой компонент?
  onStartCapture() {
    this.rigidBodyComponent.gravityScale = 0;
    this.rigidBodyComponent.linearVelocity = cc.v2();

    // todo
    this.createShadowConnections();
  },

  // todo создание прозрачных связей
  // todo вынести функционал работы со связами в компонент
  createShadowConnections() {
    const neuronsNode = cc.find('level/perceptron/neurons');

    const [one, two] = neuronsNode.children;
    // todo кроме текущего
    console.log('>', one, two);

    // todo node pool
    // todo угол. длина .mag
    const connectionNode = cc.instantiate(this.connectionPrefab);
    const [wheelJointOne, wheelJointTwo] = connectionNode.getComponents(cc.WheelJoint);

    wheelJointOne.connectedBody = one.getComponent(cc.RigidBody);
    wheelJointTwo.connectedBody = two.getComponent(cc.RigidBody);

    neuronsNode.addChild(connectionNode);
  },

  onMoveCaptured(e) {
    this.node.position = this.node.position.add(e.getDelta());

    // todo
    this.movementShadowConnections();
  },

  // todo
  movementShadowConnections() {
  },

  onEndCapture() {
    this.rigidBodyComponent.gravityScale = 1;

    // todo связи можно будет создать при выполнении условий.
    //  ограничения: можно располагать нейрон только в ряд в новом слое, либо в существующем.
    this.mountingShadowConnections();

    this.neuronDocked();
  },

  // todo визуализация связей при установке - прозрачные, после установки нормальные.
  // todo увеличение длины связи до нейронов.
  //  для нового нейрона - переплетение связями со всеми нейронами.
  //  .mag()
  // todo отключать физику.
  mountingShadowConnections() {
  },

  // todo
  neuronDocked(neuron) {
    this.perceptronCreatorComponent.externalComponentNeuronDocked(neuron);
  },

  // todo
  neuronDestroyed(neuron) {
    this.perceptronCreatorComponent.externalComponentNeuronDestroyed(neuron);
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },
});
