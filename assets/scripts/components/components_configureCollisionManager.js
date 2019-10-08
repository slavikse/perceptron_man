cc.Class({
  extends: cc.Component,

  properties: {
    isEnabled: true,
    isDebugDraw: false,
    isDrawBoundingBox: false,
  },

  onLoad() {
    const collisionManager = cc.director.getCollisionManager();

    collisionManager.enabled = this.isEnabled;
    collisionManager.enabledDebugDraw = this.isDebugDraw;
    collisionManager.enabledDrawBoundingBox = this.isDrawBoundingBox;
  },
});
