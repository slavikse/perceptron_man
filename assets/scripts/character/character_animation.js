const getRandomRangeInt = require('utils_getRandomRangeInt');

cc.Class({
  extends: cc.Component,

  properties: {
    // walkAudios: { type: cc.AudioClip, default: [] },
  },

  onLoad() {
    this.armLeftIdle = cc.find('arm_left_idle', this.node);
    this.armRightIdle = cc.find('arm_right_idle', this.node);

    this.armLeftWalk = cc.find('arm_left_walk', this.node);
    this.armRightWalk = cc.find('arm_right_walk', this.node);

    this.animationComponent = this.node.getComponent(cc.Animation);
    this.animationState = this.animationComponent.getAnimationState('idle');

    // todo
    this.walkAudios = [];
  },

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

  editorAnimationCompleted() {
    const index = getRandomRangeInt(0, this.walkAudios.length - 1);
    const audioId = cc.audioEngine.playEffect(this.walkAudios[index], false);
    cc.audioEngine.setVolume(audioId, 0.3);
  },
});
