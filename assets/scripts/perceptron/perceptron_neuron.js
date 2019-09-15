cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
  },

  // update(dt) {},
});
