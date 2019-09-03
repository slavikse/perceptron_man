cc.Class({
  extends: cc.Component,

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;

    // physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit
    //   | cc.PhysicsManager.DrawBits.e_jointBit
    //   | cc.PhysicsManager.DrawBits.e_shapeBit;
  },
});
