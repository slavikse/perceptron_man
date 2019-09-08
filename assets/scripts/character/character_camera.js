cc.Class({
  extends: cc.Component,

  onLoad() {
    this.cameraNode = cc.find('level1/Main Camera');
    this.characterNode = cc.find('level1/character');
  },

  lateUpdate() {
    this.cameraNode.x = this.characterNode.x;
  },
});
