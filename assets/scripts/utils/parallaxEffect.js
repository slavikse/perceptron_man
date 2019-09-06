cc.Class({
  extends: cc.Component,

  properties: {
    // Найденный диапазон значений экспериментальным путем.
    perspective: {
      default: 0.1,
      min: 0.1,
      max: 0.7,
      step: 0.1,
      slide: true,
    },
  },

  onLoad() {
    this.characterNode = cc.find('level1/character');
  },

  update() {
    this.node.x = this.characterNode.x * this.perspective;
  },
});
