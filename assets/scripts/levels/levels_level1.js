cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('gameOver', this.onGameOver, this);

    // todo
    // touchstart touchmove touchend
    // cc.director.on('touchstart', (e) => {
    //   console.log('r', e);
    // });
  },

  onDestroy() {
    cc.director.off('gameOver', this.onGameOver, this);
  },

  onGameOver() {
    cc.director.loadScene('start');
  },
});
