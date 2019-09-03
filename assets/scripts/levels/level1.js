cc.Class({
  extends: cc.Component,

  onLoad() {
    cc.director.on('level1/gameOver', this.onGameOver, this);
  },

  onDestroy() {
    cc.director.off('level1/gameOver', this.onGameOver, this);
  },

  onGameOver() {
    // fixme loadScene: Failed to load scene 'start' because 'start' is already being loaded.
    //  runSceneImmediate
    cc.director.loadScene('start');
  },
});

// todo при движении по широкой сцене - смещать фон. параллакс эффект

// todo анимация
// cc.tween(this.node)
//   .to(1, { scale: 1.5, position: cc.v2(100, 100), angle: 90 }, { easing: 'sineOutIn' })
//   .to(2, { scale: 0.5 }, { easing: 'sineOutIn' })
//   .start();

// todo управление предварительно настроенной анимации: anims
// https://docs.cocos.com/creator/2.1/manual/en/animation/scripting-animation.html

// todo планировщик
// this.schedule(() => {
//   console.log('1');
// }, 1, 3);
// cc.director.getScheduler().schedule(
//   () => {
//     console.log('2');
//   }, this, 1, 0, 1, 1,
// );
