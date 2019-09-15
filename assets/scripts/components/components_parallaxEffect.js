cc.Class({
  extends: cc.Component,

  properties: {
    perspective: {
      default: 0.1,
      slide: true,
      min: 0.1,
      max: 0.9,
      step: 0.1,
      tooltip: 'Чем больше, тем медленнее будет перемещаться относительно движущихся объектов.',
    },
  },

  onLoad() {
    this.perceptronNode = cc.find('level/perceptron');

    this.initialNodeX = this.node.x;
  },

  lateUpdate() {
    this.node.x = this.perceptronNode.x * this.perspective + this.initialNodeX;
  },
});
