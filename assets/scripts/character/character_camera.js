cc.Class({
  extends: cc.Component,

  onLoad() {
    this.cameraNode = cc.find('level/Main Camera');
    this.characterNode = cc.find('level/character');
  },

  update() {
    this.cameraNode.x = this.characterNode.x;
  },
});
