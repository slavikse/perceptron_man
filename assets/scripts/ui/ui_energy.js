cc.Class({
  extends: cc.Component,

  properties: {
    // increaseAudio: { type: cc.AudioClip, default: undefined },
  },

  onLoad() {
    this.characterNode = cc.find('level/character');
    this.labelComponent = this.node.getComponent(cc.Label);

    this.energy = 0;

    this.setEnergy();
  },

  lateUpdate() {
    this.node.x = this.characterNode.x;
  },

  increaseEnergy() {
    this.energy += 1;
    this.setEnergy();
  },

  setEnergy() {
    this.labelComponent.string = `Энергия: ${this.energy}`;
  },
});
