cc.Class({
  extends: cc.Component,

  properties: {
    perspective: {
      default: 0.1,
      slide: true,
      min: 0.1,
      max: 0.9,
      step: 0.1,
      tooltip: 'Чем меньше значение, тем медленнее будет двигаться объект.',
    },
    movement: {
      default: 0.1,
      slide: true,
      min: 0.1,
      max: 3.0,
      step: 0.1,
    },
  },

  onLoad() {
    this.groundNode = cc.find('level1/ground');
    this.characterNode = cc.find('level1/character');

    this.levelBorderLeft = -this.groundNode.position.x;
    this.levelBorderRight = this.groundNode.width;

    this.initialNodeX = this.node.x;
    this.amountMovement = this.movement;
  },

  lateUpdate() {
    if (this.node.x < this.levelBorderRight) {
      this.node.x = (this.characterNode.x + this.amountMovement)
        * this.perspective
        + this.initialNodeX;

      this.amountMovement += this.movement;
    } else {
      this.initialNodeX = this.levelBorderLeft;
      this.amountMovement = this.movement;

      this.node.x = this.initialNodeX;
    }
  },
});
