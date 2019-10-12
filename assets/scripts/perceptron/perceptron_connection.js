cc.Class({
  extends: cc.Component,

  properties: {
    connectionSpriteBaseFrame: cc.SpriteFrame,
  },

  onLoad() {
    this.animationComponent = this.node.getComponent(cc.Animation);
    this.animationState = this.animationComponent.getAnimationState(
      'connection',
    );

    this.spriteComponent = this.node.getComponent(cc.Sprite);

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

  onDisable() {
    this.animationComponent.stop('connection');
    this.animationComponent.setCurrentTime(0, 'connection');

    this.spriteComponent.spriteFrame = this.connectionSpriteBaseFrame;
  },

  playConnectionAnimation() {
    if (!this.animationState.isPlaying) {
      this.animationState.play('connection');
    }
  },
});
