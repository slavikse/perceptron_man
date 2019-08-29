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
    const items = [
      {
        id: '#1',
      },
      {
        id: '#2',
      },
    ];

    items.forEach(this.spawnStar.bind(this));
    this.starsActive = items.length;
  },

  spawnStar(item) {
    const starNode = cc.instantiate(this.starPrefab);
    const instanceComponent = starNode.getComponent('instance');
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
