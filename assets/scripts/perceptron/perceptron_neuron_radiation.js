cc.Class({
  extends: cc.Component,

  properties: {
    padiationParticleAsset: { type: cc.ParticleAsset, default: undefined },
  },

  onLoad() {
    this.particleSystemComponent = this.node.getComponent(cc.ParticleSystem);

    cc.director.on(
      'perceptron/neuron/radiation/activateParticleRadiation',
      this.activateParticleRadiation,
      this,
    );
  },

  onDestroy() {
    cc.director.off(
      'perceptron/neuron/radiation/activateParticleRadiation',
      this.activateParticleRadiation,
      this,
    );
  },

  onDisable() {
    this.resetParticleSystemComponent();
  },

  activateParticleRadiation() {
    if (!this.particleSystemComponent.file) {
      this.particleSystemComponent.file = this.padiationParticleAsset;
    }
  },

  resetParticleSystemComponent() {
    this.node.removeComponent(cc.ParticleSystem);
    this.particleSystemComponent = this.node.addComponent(cc.ParticleSystem);
  },
});
