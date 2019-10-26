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

    // trackId не может начинаться с 0:
    // Подробнее в: perceptron_connections -> setConnectionNodeActivation.
    for (let trackId = 1; trackId <= countOfTracks; trackId++) {
      this.addTrackNode(trackId, trackNode.height);
    }
  },

  addTrackNode(trackId, trackNodeHeight) {
    const trackNode = cc.instantiate(this.trackPrefab);
    trackNode.name = `${trackId}`;

    const widgetComponent = trackNode.getComponent(cc.Widget);
    widgetComponent.top = trackNodeHeight * (trackId - 1);

    this.node.addChild(trackNode);
  },
});
