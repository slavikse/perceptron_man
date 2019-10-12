cc.Class({
  extends: cc.Component,

  onLoad() {
    this.connectionAnimationComponentState = this.node
      .getComponent(cc.Animation)
      .getAnimationState('connection');

    cc.director.on(
      'perceptron/connection/playConnectionAnimation',
      this.playConnectionAnimation,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/connection/playConnectionAnimation',
      this.playConnectionAnimation,
      this,
    );
  },

  playConnectionAnimation() {
    if (!this.connectionAnimationComponentState.isPlaying) {
      this.connectionAnimationComponentState.play('connection');
    }
  },
});
