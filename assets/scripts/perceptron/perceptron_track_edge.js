cc.Class({
  extends: cc.Component,

  onCollisionEnter() {
    this.crossingTrackEdge({ isCrossing: true });
  },

  onCollisionExit() {
    this.crossingTrackEdge({ isCrossing: false });
  },

  crossingTrackEdge({ isCrossing }) {
    const e = new cc.Event.EventCustom('track/crossingTrackEdge');
    e.detail = { isCrossing };
    cc.director.dispatchEvent(e);
  },
});
