cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('level1/gameOver', this.onGameOver, this);
  },

  onDestroy() {
    cc.director.off('level1/gameOver', this.onGameOver, this);
  },

  onGameOver() {
    this.node.stopAllActions();
  },
});
