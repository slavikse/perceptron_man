cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('gameOver', this.onGameOver, this);

    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
  },

  onDestroy() {
    cc.director.off('gameOver', this.onGameOver, this);
  },

  onGameOver() {
    this.node.stopAllActions();
  },

  // editorAnimCompleted(status) {
  //   console.log(`status: ${status}`);
  // },
});
