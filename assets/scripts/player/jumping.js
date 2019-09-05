const hasPermissibleInfelicity = require('utils/hasPermissibleInfelicity');

cc.Class({
  extends: cc.Component,

  properties: {
    audio: { type: cc.AudioClip, default: undefined },
    acceleration: 4000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBody = this.node.getComponent(cc.RigidBody);
    this.impulse = cc.v2(0, this.acceleration);
    this.localCenter = this.rigidBody.getLocalCenter();

    this.isPressedKeyW = false;
  },

  update() {
    const { y } = this.rigidBody.linearVelocity;

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
    this.rigidBody.applyLinearImpulse(this.impulse, this.localCenter);
  },
});
