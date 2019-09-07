cc.Class({
  extends: cc.Component,

  properties: {
    perspective: {
      default: 0.1,
      min: 0.1,
      max: 0.9,
      step: 0.1,
      slide: true,
    },
  },

  onLoad() {
    this.characterNode = cc.find('level1/character');

    this.initialX = this.node.x;
  },

  lateUpdate() {
    this.node.x = this.characterNode.x * this.perspective + this.initialX;
  },
});
