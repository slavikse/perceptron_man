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

    for (let i = 1; i <= countOfTracks; i++) {
      this.addTrackNode(i, trackNode.height);
    }
  },

  addTrackNode(trackId, trackNodeHeight) {
    const trackNode = cc.instantiate(this.trackPrefab);
    trackNode.name = `track:${trackId}`;

    const widgetComponent = trackNode.getComponent(cc.Widget);
    widgetComponent.top = trackNodeHeight * (trackId - 1);

    this.node.addChild(trackNode);
  },
});
