const hasPermissibleInfelicity = require('hasPermissibleInfelicity');

cc.Class({
  extends: cc.Component,

  properties: {
    audio: { type: cc.AudioClip, default: undefined },
    acceleration: 4000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
    this.impulse = cc.v2(0, this.acceleration);
    this.localCenter = this.rigidBodyComponent.getLocalCenter();

    this.isPressedKeyW = false;
  },

  update() {
    const { y } = this.rigidBodyComponent.linearVelocity;

    if (this.isPressedKeyW && hasPermissibleInfelicity(y)) {
      this.jump();
    }
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onKeyDown({ keyCode }) {
    const isKeyW = keyCode === cc.macro.KEY.w;

    if (isKeyW) {
      this.isPressedKeyW = true;
    }
  },

  onKeyUp({ keyCode }) {
    const isKeyW = keyCode === cc.macro.KEY.w;

    if (isKeyW) {
      this.isPressedKeyW = false;
    }
  },

  jump() {
    cc.audioEngine.playEffect(this.audio, false);
    this.rigidBodyComponent.applyLinearImpulse(this.impulse, this.localCenter);
  },
});
