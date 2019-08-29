cc.Class({
  extends: cc.Component,

  properties: {
    gainAudio: { type: cc.AudioClip, default: undefined },
  },

  onLoad() {
    cc.director.on('star/picked', this.gainScore, this);
    cc.director.on('level1/gameOver', this.gameOver, this);

    this.scoreComponent = this.node.getComponent(cc.Label);
    this.score = 0;
  },

  onDestroy() {
    cc.director.off('star/picked', this.gainScore, this);
    cc.director.off('level1/gameOver', this.gameOver, this);
  },

  gainScore() {
    this.increaseScore(true);
    cc.audioEngine.playEffect(this.gainAudio, false);
  },

  increaseScore(isIncrease) {
    if (isIncrease) {
      this.score += 1;
    } else {
      this.score = 0;
    }

    this.scoreComponent.string = `Score: ${this.score}`;
  },

  gameOver() {
    this.increaseScore(false);
  },
});
