cc.Class({
  extends: cc.Component,

  onLoad() {
    this.spriteAnimationComponentState = this.node
      .getComponent(cc.Animation)
      .getAnimationState('sprite');

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

  // TODO если нет соединений, то вызвать:
  // this.spriteAnimationComponentState.stop('neuron');
  playSpriteAnimation() {
    if (!this.spriteAnimationComponentState.isPlaying) {
      this.spriteAnimationComponentState.play('sprite');
    }
  },
});
