cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('gameOver', this.onGameOver, this);
  },

  onDestroy() {
    cc.director.off('gameOver', this.onGameOver, this);
  },

  onGameOver() {
    console.log('onGameOver');
    // cc.director.loadScene('start');
  },
});

// const scene = cc.director.getScene();
// scene.addChild(node)
// const starNode = cc.instantiate(this.starPrefab);
// const instanceComponent = starNode.getComponent('star_instance');
// instanceComponent.externalInitialize(item);

// cc.director.dispatchEvent(new Event('star/picked'));
// cc.director.on('star/picked', this.onReSpawnStar, this);

// cc.audioEngine.playEffect(this.gainAudio, false);
