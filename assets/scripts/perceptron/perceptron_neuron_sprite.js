cc.Class({
  extends: cc.Component,

  onLoad() {
    this.animationComponent = this.node.getComponent(cc.Animation);
    this.animationState = this.animationComponent.getAnimationState('sprite');

    cc.director.on(
      'perceptron/neuron/sprite/playSpriteAnimation',
      this.playSpriteAnimation,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/neuron/sprite/playSpriteAnimation',
      this.playSpriteAnimation,
      this,
    );
  },

  onDisable() {
    this.animationComponent.stop('sprite');
    this.animationComponent.setCurrentTime(0, 'sprite');
  },

  playSpriteAnimation() {
    if (!this.animationState.isPlaying) {
      this.animationState.play('sprite');
    }
  },
});
