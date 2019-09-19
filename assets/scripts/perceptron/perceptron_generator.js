cc.Class({
  extends: cc.Component,

  properties: {
    neuronPrefab: cc.Prefab,
  },

  onLoad() {
    this.node.on('touchstart', this.onTouch, this);

    this.levelNode = cc.find('level');
  },

  onDestroy() {
    this.node.off('touchstart', this.onTouch, this);
  },

  onTouch() {
    // todo prefab pool
    const neuronNode = cc.instantiate(this.neuronPrefab);
    neuronNode.setPosition(200, 300);
    this.levelNode.addChild(neuronNode);
  },
});
