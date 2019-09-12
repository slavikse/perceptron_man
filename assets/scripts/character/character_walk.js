const hasPermissibleInfelicity = require('character_utils_hasPermissibleInfelicity');

const acceleration = 3000;
const multiplier = 15;

cc.Class({
  extends: cc.Component,

  properties: {
    acceleration,
    speedLimiter: acceleration * multiplier,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.armLeftIdle = cc.find('arm_left_idle', this.node);
    this.armRightIdle = cc.find('arm_right_idle', this.node);

    this.armLeftWalk = cc.find('arm_left_walk', this.node);
    this.armRightWalk = cc.find('arm_right_walk', this.node);

    this.groundNode = cc.find('level/ground');

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
    this.animationComponent = this.node.getComponent(cc.Animation);
    this.animationState = this.animationComponent.getAnimationState('idle');

    this.speed = 0;

    this.isMovementLeft = false;
    this.isMovementRight = false;
  },

  update(dt) {
    this.setAccelerationState();
    this.jumpWithSpeed(dt);
  },

  // todo звук шагов - пока скорость не равна 0. вызов функции из анимации. Анимационное событие.
  lateUpdate() {
    this.accelerationMovementPrevention();
    this.dropoutMovementLimiter();

    this.switchAnimationState();
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

  // todo зависимость: скорость анимации от текущей скорости передвижения.
  //  animState.speed = 2;
  // todo можно резко изменить сторону движения

  // this.animationComponent.setCurrentTime(0, previousName);
  // todo для корректной остановки анимации, ускорять анимацию и слушать событие
  //  из редактора о завершении анимации и тогда начинать проигрывать другую анимаю.
  // todo обратное движение: когда шёл в одну сторону и резко развернулся, замедление скорости.
  switchAnimationState() {
    if (this.speed < 0) {
      this.setAnimationStateWalk(-1);
    } else if (this.speed > 0) {
      this.setAnimationStateWalk(1);
    } else {
      this.setAnimationStateIdle();
    }
  },

  setAnimationStateWalk(signInvert) {
    if (this.animationState.name === 'idle') {
      this.node.scaleX = signInvert * Math.abs(this.node.scaleX);

      this.setArmsActive({ isIdle: false, isWalk: true });
      this.animationState = this.animationComponent.play('walk');
    }
  },

  setAnimationStateIdle() {
    if (this.animationState.name === 'walk') {
      this.setArmsActive({ isIdle: true, isWalk: false });
      this.animationState = this.animationComponent.play('idle');
    }
  },

  setArmsActive({ isIdle, isWalk }) {
    this.armLeftIdle.active = isIdle;
    this.armRightIdle.active = isIdle;

    this.armRightWalk.active = isWalk;
    this.armLeftWalk.active = isWalk;
  },
});
