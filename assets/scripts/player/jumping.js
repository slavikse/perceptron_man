cc.Class({
  extends: cc.Component,

  properties: {
    audio: { type: cc.AudioClip, default: undefined },
    duration: 0.4,
    height: 200,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    this.isIdle = true;
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  },

  onKeyDown({ keyCode }) {
    if (this.isIdle && keyCode === cc.macro.KEY.w) {
      this.node.runAction(this.jump());
    }
  },

  // todo add easing function
  jump() {
    this.isIdle = false;

    const playAudio = cc.callFunc(this.playAudio, this);

    const jumpUp = cc.moveBy(this.duration, cc.v2(0, this.height))
      .easing(cc.easeCubicActionOut());

    const jumpDown = cc.moveBy(this.duration, cc.v2(0, -this.height))
      .easing(cc.easeCubicActionIn());

    const idle = cc.callFunc(this.setIdle, this);

    return cc.sequence(playAudio, jumpUp, jumpDown, idle);
  },

  playAudio() {
    cc.audioEngine.playEffect(this.audio, false);
  },

  setIdle() {
    this.isIdle = true;
  },
});
