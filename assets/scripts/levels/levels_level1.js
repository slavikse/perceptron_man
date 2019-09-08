cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('gameOver', this.onGameOver, this);
  },

  onDestroy() {
    cc.director.off('gameOver', this.onGameOver, this);
  },

  onGameOver() {
    cc.director.loadScene('start');
  },
});
