cc.Class({
  extends: cc.Component,

  onLoad() {
    const toggleNode = cc.find('start/toggle');
    const toggleComponent = toggleNode.getComponent(cc.Toggle);

    window.state.godMode = toggleComponent.isChecked;
  },

  editorSetGodMode(e) {
    window.state.godMode = e.isChecked;
  },

  editorEventRun(_, level = 'level1') {
    cc.director.loadScene(level);
  },
});
