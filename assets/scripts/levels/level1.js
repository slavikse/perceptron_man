cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('level1/gameOver', this.onGameOver, this);
  },

  onDestroy() {
    cc.director.off('level1/gameOver', this.onGameOver, this);
  },

  onGameOver() {
    // fixme loadScene: Failed to load scene 'start' because 'start' is already being loaded.
    //  runSceneImmediate
    cc.director.loadScene('start');
  },
});

// todo при движении по широкой сцене - смещать фон. параллакс эффект
// todo вести камеру за игроком.
