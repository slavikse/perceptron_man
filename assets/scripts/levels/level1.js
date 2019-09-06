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

// todo вести камеру за игроком вместе с количеством очков.
// todo при движении по широкой сцене - смещать фон. параллакс эффект
// fixme loadScene: Failed to load scene 'start' because 'start' is already being loaded.
