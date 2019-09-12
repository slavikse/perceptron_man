cc.Class({
  extends: cc.Component,

  onLoad() {
    this.armLeftIdle = cc.find('arm_left_idle', this.node);
    this.armRightIdle = cc.find('arm_right_idle', this.node);

    this.armLeftWalk = cc.find('arm_left_walk', this.node);
    this.armRightWalk = cc.find('arm_right_walk', this.node);

    this.animationComponent = this.node.getComponent(cc.Animation);
    this.animationState = this.animationComponent.getAnimationState('idle');
  },

  // todo зависимость: скорость анимации от текущей скорости передвижения.
  //  animState.speed = 2;
  // todo можно резко изменить сторону движения

  // this.animationComponent.setCurrentTime(0, previousName);
  // todo для корректной остановки анимации, ускорять анимацию и слушать событие
  //  из редактора о завершении анимации и тогда начинать проигрывать другую анимаю.
  // todo обратное движение: когда шёл в одну сторону и резко развернулся, замедление скорости.
  externalSwitchAnimationState(speed) {
    if (speed < 0) {
      this.setAnimationStateWalk(-1);
    } else if (speed > 0) {
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
