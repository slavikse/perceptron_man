cc.Class({
  extends: cc.Component,

  editorEventRun(_, level = 'level1') {
    cc.director.loadScene(level);
  },
});
