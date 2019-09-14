cc.Class({
  extends: cc.Component,

  properties: {
    speed: 30000,
  },

  onLoad() {
    // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.groundNode = cc.find('level/ground');

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
  },

  update(dt) {
  },

  lateUpdate() {
    this.dropoutMovementLimiter();
  },

  onDestroy() {
    // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  dropoutMovementLimiter() {
    const stockDistance = 1000;
    const levelBorderRight = this.groundNode.width - stockDistance;

    const halfCharacterWidth = this.node.width / 2;
    const characterBorderRight = this.node.x + halfCharacterWidth;

    if (characterBorderRight > levelBorderRight) {
      this.movementLimiter(levelBorderRight - halfCharacterWidth);
    }
  },

  movementLimiter(x) {
    this.node.x = x;
  },
});
