cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: 20,
    speedLimiter: 500,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.isAccelerationLeft = false;
    this.isAccelerationRight = false;
    this.speed = 0;
  },

  update(dt) {
    this.movement(dt);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onKeyDown({ keyCode }) {
    this.responseToKey(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.responseToKey(keyCode, false);
  },

  responseToKey(keyCode, isAction) {
    if (keyCode === cc.macro.KEY.a) {
      this.isAccelerationLeft = isAction;
    } else if (keyCode === cc.macro.KEY.d) {
      this.isAccelerationRight = isAction;
    }
  },

  movement(dt) {
    if (this.isAccelerationLeft) {
      this.increaseSpeedToLeft();
    } else if (this.isAccelerationRight) {
      this.increaseSpeedToRight();
    } else {
      this.zeroingSpeed();
    }

    this.node.x += this.speed * dt;
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
});
