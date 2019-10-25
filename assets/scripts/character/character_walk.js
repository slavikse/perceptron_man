const hasPermissibleInfelicity = require(
  'character_utils_hasPermissibleInfelicity',
);

cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: 500,
    speedLimiter: 3000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.groundNode = cc.find('level/ground');

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
    this.characterAnimationComponent = this.node.getComponent('character_animation');

    this.speed = 0;

    this.isMovementLeft = false;
    this.isMovementRight = false;
  },

  update(dt) {
    this.setAccelerationState();
    this.jumpWithSpeed(dt);
  },

  lateUpdate() {
    this.accelerationMovementPrevention();
    this.dropoutMovementLimiter();

    this.characterAnimationComponent.externalSwitchAnimationState(this.speed);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onKeyDown({ keyCode }) {
    this.setMovementSide(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.setMovementSide(keyCode, false);
  },

  setMovementSide(keyCode, isPressed) {
    if (keyCode === cc.macro.KEY.a) {
      this.isMovementLeft = isPressed;
    } else if (keyCode === cc.macro.KEY.d) {
      this.isMovementRight = isPressed;
    }
  },

  setAccelerationState() {
    if (this.isMovementLeft === this.isMovementRight) {
      this.deceleration();
    } else if (this.isMovementLeft) {
      this.accelerationLeft();
    } else if (this.isMovementRight) {
      this.accelerationRight();
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
    const { y } = this.rigidBodyComponent.linearVelocity;
    this.rigidBodyComponent.linearVelocity = cc.v2(this.speed * dt, y);
  },

  accelerationMovementPrevention() {
    const { x } = this.rigidBodyComponent.linearVelocity;

    if (hasPermissibleInfelicity(x)) {
      this.resetSpeed();
    }
  },

  resetSpeed() {
    this.speed = 0;
  },

  dropoutMovementLimiter() {
    const stockDistance = 1000;
    const levelBorderLeft = -this.groundNode.position.x + stockDistance;
    const levelBorderRight = this.groundNode.width - stockDistance;

    const halfCharacterWidth = this.node.width / 2;
    const characterBorderLeft = this.node.x - halfCharacterWidth;
    const characterBorderRight = this.node.x + halfCharacterWidth;

    if (characterBorderLeft < levelBorderLeft) {
      this.movementLimiter(levelBorderLeft + halfCharacterWidth);
    } else if (characterBorderRight > levelBorderRight) {
      this.movementLimiter(levelBorderRight - halfCharacterWidth);
    }
  },

  movementLimiter(x) {
    this.resetSpeed();
    this.node.x = x;
  },
});
