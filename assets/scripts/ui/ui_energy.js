cc.Class({
  extends: cc.Component,

  properties: {
    gainAudio: { type: cc.AudioClip, default: undefined },
  },

  onLoad() {
    cc.director.on('star/picked', this.gainScore, this);
    cc.director.on('gameOver', this.gameOver, this);

    this.characterNode = cc.find('level/character');
    this.scoreComponent = this.node.getComponent(cc.Label);

    this.score = 0;
    this.setScore();
  },

  lateUpdate() {
    this.node.x = this.characterNode.x;
  },

  onDestroy() {
    cc.director.off('star/picked', this.gainScore, this);
    cc.director.off('gameOver', this.gameOver, this);
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

    this.setScore();
  },

  setScore() {
    this.scoreComponent.string = `Energy: ${this.score}`;
  },

  gameOver() {
    this.increaseScore(false);
  },
});
