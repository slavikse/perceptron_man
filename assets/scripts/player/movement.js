cc.Class({
  extends: cc.Component,

  properties: {
    maximumSpeed: 30000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBody = this.node.getComponent(cc.RigidBody);

    this.speed = 0;
    this.isMovementLeft = false;
    this.isMovementRight = false;
  },

  update(dt) {
    if (this.isMovementLeft === this.isMovementRight) {
      this.speed = 0;
    } else if (this.isMovementLeft) {
      this.speed = -this.maximumSpeed;
    } else if (this.isMovementRight) {
      this.speed = this.maximumSpeed;
    }

    this.combiningJumpingWithMovement(dt);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onKeyDown({ keyCode }) {
    this.setAcceleration(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.setAcceleration(keyCode, false);
  },

  setAcceleration(keyCode, isPressed) {
    if (keyCode === cc.macro.KEY.a) {
      this.isMovementLeft = isPressed;
    } else if (keyCode === cc.macro.KEY.d) {
      this.isMovementRight = isPressed;
    }
  },

  combiningJumpingWithMovement(dt) {
    const { y } = this.rigidBody.linearVelocity;
    this.rigidBody.linearVelocity = cc.v2(this.speed * dt, y);
  },
});
