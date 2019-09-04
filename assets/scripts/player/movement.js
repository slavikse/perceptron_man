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
    this.isMovementLeft = false;
    this.isMovementRight = false;
  },

  update(dt) {
    if (this.isMovementLeft === this.isMovementRight) {
      this.deceleration();
    } else if (this.isMovementLeft) {
      this.accelerationLeft();
    } else if (this.isMovementRight) {
      this.accelerationRight();
    }

    this.jumpWithSpeed(dt);
  },

  lateUpdate() {
    this.accelerationPrevention();
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

  deceleration() {
    if (this.speed > 0) {
      this.speed -= this.acceleration;
    } else if (this.speed < 0) {
      this.speed += this.acceleration;
    }
  },

  accelerationLeft() {
    if (this.speed > -this.speedLimiter) {
      this.speed -= this.acceleration;
    }
  },

  accelerationRight() {
    if (this.speed < this.speedLimiter) {
      this.speed += this.acceleration;
    }
  },

  // Чтобы сохранить ускорение прыжка при перемещении,
  // присваивается общее ускорение для прыжка и перемещения.
  jumpWithSpeed(dt) {
    const { y } = this.rigidBody.linearVelocity;
    this.rigidBody.linearVelocity = cc.v2(this.speed * dt, y);
  },

  // Когда ускорение падает до нуля, а скорость продолжает набираться,
  // это означает, что персонаж не перемещается, а уперся в стену.
  accelerationPrevention() {
    const { x } = this.rigidBody.linearVelocity;
    // Погрешность эмуляции физических тел.
    const infelicity = 5;

    // Диапазон ускорения в пределах погрешности при столновении с объектом.
    if (x > -infelicity && x < infelicity) {
      this.speed = 0;
    }
  },
});
