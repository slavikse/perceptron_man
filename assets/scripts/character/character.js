cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('level1/gameOver', this.onGameOver, this);

    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
  },

  onDestroy() {
    cc.director.off('level1/gameOver', this.onGameOver, this);
  },

  onGameOver() {
    this.node.stopAllActions();
  },

  // todo
  // editorAnimCompleted(status) {
  //   console.log(`status: ${status}`);
  // },
});
