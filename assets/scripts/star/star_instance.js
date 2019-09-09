cc.Class({
  extends: cc.Component,

  onLoad() {
    this.groundNode = cc.find('level/ground');
    this.characterNode = cc.find('level/character');

    this.pickDistance = 60;
    this.minDurationLive = 3;
    this.maxDurationLive = 5;

    this.timer = 0;
    this.durationLive = this.minDurationLive + Math.random()
      * (this.maxDurationLive - this.minDurationLive);

    this.node.setPosition(...this.getPosition());
  },

  update(dt) {
    this.timer += dt;

    if (this.timer > this.durationLive) {
      this.gameOver();
    } else if (this.getDistanceToCharacter() > this.pickDistance) {
      this.hideStar();
    } else {
      this.starPicked();
    }
  },

  externalInitialize(item) {
    const titleNode = cc.find('title', this.node);
    const labelComponent = titleNode.getComponent(cc.Label);

    labelComponent.string = item.id;
  },

  getPosition() {
    const groundY = this.groundNode.y + this.groundNode.height / 2;
    const maxX = this.groundNode.width / 4;
    const randX = (Math.random() - 0.5) * 2 * maxX;
    const randY = groundY + Math.random() * 100;

    return [randX, randY];
  },

  gameOver() {
    if (window.state.godMode) {
      this.starPicked();
    } else {
      cc.director.dispatchEvent(new Event('gameOver'));
    }
  },

  getDistanceToCharacter() {
    const characterPosition = this.characterNode.getPosition();
    return this.node.position.sub(characterPosition).mag();
  },

  hideStar() {
    const opacityRatio = 1 - this.timer / this.durationLive;
    const minStarOpacity = 50;

    this.node.opacity = minStarOpacity + Math.floor(opacityRatio * (255 - minStarOpacity));
  },

  starPicked() {
    cc.director.dispatchEvent(new Event('star/picked'));
    this.node.destroy();
  },
});
