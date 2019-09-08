cc.Class({
  extends: cc.Component,

  properties: {
    starPrefab: cc.Prefab,
  },

  onLoad() {
    cc.director.on('star/picked', this.onReSpawnStar, this);

    this.createStars();
  },

  onDestroy() {
    cc.director.off('star/picked', this.onReSpawnStar, this);
  },

  createStars() {
    const count = 5;

    for (let i = 0; i < count; i++) {
      this.spawnStar({ id: `#${i}` });
    }

    this.starsActive = count;
  },

  spawnStar(item) {
    const starNode = cc.instantiate(this.starPrefab);
    const instanceComponent = starNode.getComponent('star_instance');
    instanceComponent.externalInitialize(item);

    this.node.addChild(starNode);
  },

  onReSpawnStar() {
    this.starsActive -= 1;

    if (this.starsActive === 0) {
      this.createStars();
    }
  },
});
