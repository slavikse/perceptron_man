cc.Class({
  extends: cc.Component,

  properties: {
    audio: { type: cc.AudioClip, default: undefined },
    acceleration: 4000,
  },

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    this.rigidBody = this.node.getComponent(cc.RigidBody);
    this.impulse = cc.v2(0, this.acceleration);
    this.localCenter = this.rigidBody.getLocalCenter();

    this.isIdle = true;
    this.isAcceleration = false;
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  },

  onBeginContact(contact, selfCollider, otherCollider) {
    if (otherCollider.tag === window.game.tag.ground) {
      this.isIdle = true;
    }
  },

  onKeyDown({ keyCode }) {
    if (this.isIdle && keyCode === cc.macro.KEY.w) {
      this.isIdle = false;

      this.playAudio();
      this.jump();
    }
  },

  playAudio() {
    cc.audioEngine.playEffect(this.audio, false);
  },

  jump() {
    this.rigidBody.applyLinearImpulse(this.impulse, this.localCenter);
  },
});
