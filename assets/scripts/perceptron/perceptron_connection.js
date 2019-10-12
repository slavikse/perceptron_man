cc.Class({
  extends: cc.Component,

  onLoad() {
    this.connectionAnimationComponentState = this.node
      .getComponent(cc.Animation)
      .getAnimationState('connection');

    cc.director.on(
      'perceptron/connection/playAnimation',
      this.playAnimation,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/connection/playAnimation',
      this.playAnimation,
      this,
    );
  },

  playAnimation() {
    if (!this.connectionAnimationComponentState.isPlaying) {
      this.connectionAnimationComponentState.play('connection');
    }
  },
});
