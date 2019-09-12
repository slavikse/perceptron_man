const hasPermissibleInfelicity = require('character_utils_hasPermissibleInfelicity');

cc.Class({
  extends: cc.Component,

  properties: {
    audio: { type: cc.AudioClip, default: undefined },
    acceleration: 6000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);

    this.impulseVector = cc.v2(0, this.acceleration);
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
    this.setPressedKey(keyCode, true);
  },

  onKeyUp({ keyCode }) {
    this.setPressedKey(keyCode, false);
  },

  setPressedKey(keyCode, isPressed) {
    if (keyCode === cc.macro.KEY.w) {
      this.isPressedKeyW = isPressed;
    }
  },

  jump() {
    cc.audioEngine.playEffect(this.audio, false);
    this.rigidBodyComponent.applyLinearImpulse(this.impulseVector, this.localCenter);
  },
});
