cc.Class({
  extends: cc.Component,

  properties: {
    acceleration: {
      default: 1,
      min: 1,
      max: 10,
      step: 1,
      slide: true,
    },
  },

  onLoad() {
    this.groundNode = cc.find('level1/ground');

    this.levelBorderLeft = -this.groundNode.position.x;
    this.levelBorderRight = this.groundNode.width;
  },

  lateUpdate() {
    if (this.node.x > this.levelBorderRight) {
      this.node.x = this.levelBorderLeft;
    }

    this.node.x += this.acceleration;
  },
});
