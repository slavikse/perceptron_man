const reactionGroups = ['ground'];

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

    this.isPressedW = false;
    this.isIdle = true;
    this.contactsAmount = 0;
  },

  update() {
    if (this.isPressedW && this.isIdle) {
      this.jump();
    }
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onBeginContact(contact, selfCollider, otherCollider) {
    if (reactionGroups.includes(otherCollider.node.group)) {
      if (this.contactsAmount === 0) {
        this.isIdle = true;
      }

      this.contactsAmount += 1;
    }
  },

  onEndContact(contact, selfCollider, otherCollider) {
    if (reactionGroups.includes(otherCollider.node.group)) {
      if (this.contactsAmount === 0) {
        this.isIdle = false;
      }

      this.contactsAmount -= 1;
    }
  },

  onKeyDown({ keyCode }) {
    const isKeyW = keyCode === cc.macro.KEY.w;

    if (isKeyW && this.isIdle) {
      this.isPressedW = true;
      this.jump();
    }
  },

  onKeyUp({ keyCode }) {
    const isKeyW = keyCode === cc.macro.KEY.w;

    if (isKeyW) {
      this.isPressedW = false;
    }
  },

  // todo если в прыжке нажать прыгать, то будет задержка для следующего прыжка
  jump() {
    this.isIdle = false;

    cc.audioEngine.playEffect(this.audio, false);
    this.rigidBody.applyLinearImpulse(this.impulse, this.localCenter);
  },
});
