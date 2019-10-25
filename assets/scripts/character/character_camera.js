cc.Class({
  extends: cc.Component,

  onLoad() {
    this.characterNode = cc.find('level/character');
    this.cameraNode = cc.find('level/Main Camera');
  },

  update() {
    this.cameraNode.x = this.characterNode.x;
  },
});
