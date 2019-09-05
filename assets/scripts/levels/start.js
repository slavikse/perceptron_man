cc.Class({
  extends: cc.Component,

  editorEnableGodMode(e) {
    window.game.godMode = e.isChecked;
  },

  editorEventRun(_, level = 'level1') {
    cc.director.loadScene(level);
  },
});
