cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: 200,
    speedLimiter: 10000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.groundNode = cc.find('level/ground');

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
    // this.characterAnimationComponent = this.node.getComponent('character_animation');

    this.speed = 0;
    this.isMovementRight = false;
  },

  update(dt) {
    this.setAccelerationState();
    this.movementRight(dt);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  // todo не будет управления A D
  onKeyDown({ keyCode }) {
    this.setMovement(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.setMovement(keyCode, false);
  },

  // todo не будет прямого ручного управления
  setMovement(keyCode, isPressed) {
    if (keyCode === cc.macro.KEY.d) {
      this.isMovementRight = isPressed;
    }
  },

  setAccelerationState() {
    if (this.isMovementRight) {
      this.accelerationRight();
    } else {
      this.deceleration();
    }
  },

  accelerationRight() {
    if (this.speed < this.speedLimiter) {
      this.speed += this.acceleration;
    }
  },

  deceleration() {
    if (this.speed > 0) {
      this.speed -= this.acceleration;
    }
  },

  movementRight(dt) {
    this.rigidBodyComponent.linearVelocity = cc.v2(this.speed * dt, this.node.y);
  },
});
