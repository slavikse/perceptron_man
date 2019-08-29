cc.Class({
  extends: cc.Component,

  editorStart(_, level = 'level1') {
    cc.director.loadScene(level);
  },
});
