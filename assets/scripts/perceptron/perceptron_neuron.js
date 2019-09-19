cc.Class({
  extends: cc.Component,

  onLoad() {
    this.perceptronCreatorNode = cc.find('level/perceptron/creator');

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);

    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;

    this.isCaptured = false;
    this.position = cc.v2();
    this.savedGravityScale = 0;

    this.node.on('touchstart', this.onStartCapture, this);
    this.node.on('touchmove', this.onMoveCaptured, this);
    this.node.on('touchend', this.onEndCapture, this);
    this.node.on('touchcancel', this.onEndCapture, this);
  },

  update(dt) {
    if (this.isCaptured) {
      this.holdingEmulationPhysicalForces();
      this.node.setPosition(this.position);
    }
  },

  onStartCapture() {
    this.isCaptured = true;
    this.position = this.node.getPosition();

    this.resetGravityScale();
    this.holdingEmulationPhysicalForces();
  },

  resetGravityScale() {
    this.savedGravityScale = this.rigidBodyComponent.gravityScale;
    this.rigidBodyComponent.gravityScale = 0;
  },

  holdingEmulationPhysicalForces() {
    this.rigidBodyComponent.linearVelocity = cc.v2();
    this.rigidBodyComponent.angularVelocity = 0;
  },

  onMoveCaptured(e) {
    this.position = this.position.addSelf(e.getDelta());
  },

  onEndCapture() {
    this.isCaptured = false;
    this.restoreGravityScale();
  },

  restoreGravityScale() {
    this.rigidBodyComponent.gravityScale = this.savedGravityScale;
    this.savedGravityScale = 0;
  },

  // todo
  neuronDestroyed(neuron) {
    this.perceptronCreatorNode.externalComponentNeuronDestroyed(neuron);
  },

  onDestroy() {
    this.node.off('touchstart', this.onStartCapture, this);
    this.node.off('touchmove', this.onMoveCaptured, this);
    this.node.off('touchend', this.onEndCapture, this);
    this.node.off('touchcancel', this.onEndCapture, this);
  },
});
