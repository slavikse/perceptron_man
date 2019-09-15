cc.Class({
  extends: cc.Component,

  // todo ускорение под dt
  properties: {
    acceleration: 10000,
    limiter: 600000,
  },

  // todo крутилка. амартизация.
  onLoad() {
    if (CC_DEV) {
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    this.rigidBodyComponent = this.node.getComponent(cc.RigidBody);
    // this.characterAnimationComponent = this.node.getComponent('character_animation');

    this.isTorqueClockwise = false;
    this.torque = 0;
  },

  update(dt) {
    this.setTorqueState();
    this.applyTorqueRight(dt);
  },

  onDestroy() {
    if (CC_DEV) {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
  },

  onKeyDown({ keyCode }) {
    this.setTorqueClockwise({ keyCode, isPressed: true });
  },

  onKeyUp({ keyCode }) {
    this.setTorqueClockwise({ keyCode, isPressed: false });
  },

  setTorqueClockwise({ keyCode, isPressed }) {
    if (keyCode === cc.macro.KEY.d) {
      this.isTorqueClockwise = isPressed;
    }
  },

  setTorqueState() {
    if (this.isTorqueClockwise) {
      this.torqueAcceleration();
    } else {
      this.torqueDeceleration();
    }
  },

  torqueAcceleration() {
    if (this.torque < this.limiter) {
      this.torque += this.acceleration;
    }
  },

  torqueDeceleration() {
    if (this.torque > 0) {
      this.torque -= this.acceleration;
    }
  },

  applyTorqueRight(dt) {
    console.log(-this.torque * dt);
    this.rigidBodyComponent.applyTorque(-this.torque * dt);
  },
});
