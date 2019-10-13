cc.Class({
  extends: cc.Component,

  properties: {
    trackPrefab: cc.Prefab,
  },

  onLoad() {
    this.createTracksNodes();
  },

  createTracksNodes() {
    const trackNode = cc.instantiate(this.trackPrefab);
    const countOfTracks = Math.ceil(this.node.height / trackNode.height);

    for (let i = 0; i < countOfTracks; i++) {
      this.addTrackNode(i, trackNode.height);
    }
  },

  addTrackNode(i, trackNodeHeight) {
    const trackNode = cc.instantiate(this.trackPrefab);
    trackNode.name = `track:${i}`;

    const widgetComponent = trackNode.getComponent(cc.Widget);
    widgetComponent.top = trackNodeHeight * i;

    this.node.addChild(trackNode);
  },
});
