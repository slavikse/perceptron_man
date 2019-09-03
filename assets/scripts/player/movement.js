cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: 2000,
    speedLimiter: 2000 * 15, // acceleration * N
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBody = this.node.getComponent(cc.RigidBody);

    this.speed = 0;
    this.isAccelerationLeft = false;
    this.isAccelerationRight = false;
  },

  update(dt) {
    this.movement(dt);
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
      this.isAccelerationLeft = isPressed;
    } else if (keyCode === cc.macro.KEY.d) {
      this.isAccelerationRight = isPressed;
    }
  },

  // todo обратное движение сбрасывает скорость сразу в 0 (zeroingSpeed).
  movement(dt) {
    if (this.isAccelerationLeft) {
      this.increaseSpeedToLeft();
    } else if (this.isAccelerationRight) {
      this.increaseSpeedToRight();
    } else {
      this.zeroingSpeed();
    }

    this.combiningJumpAccelerationWithMovement(dt);
  },

  increaseSpeedToLeft() {
    if (this.speed > -this.speedLimiter) {
      this.speed -= this.acceleration;
    }
  },

  increaseSpeedToRight() {
    if (this.speed < this.speedLimiter) {
      this.speed += this.acceleration;
    }
  },

  zeroingSpeed() {
    if (this.speed > 0) {
      this.speed -= this.acceleration;
    } else if (this.speed < 0) {
      this.speed += this.acceleration;
    }
  },

  combiningJumpAccelerationWithMovement(dt) {
    const { y } = this.rigidBody.linearVelocity;
    this.rigidBody.linearVelocity = cc.v2(this.speed * dt, y);
  },
});
