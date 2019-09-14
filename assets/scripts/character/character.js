cc.Class({
  extends: cc.Component,

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
  },
});
