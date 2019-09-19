// Общий компонент для активации эмуляции физических процессов при столкновении тел.
cc.Class({
  extends: cc.Component,

  properties: {
    isEnabled: true,
    isAccumulator: false,
    frameRate: 60,
    velocityIterations: 10,
    positionIterations: 10,
  },

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();

    physicsManager.enabled = this.isEnabled;
    physicsManager.enabledAccumulator = this.isAccumulator;
    physicsManager.FIXED_TIME_STEP = 1 / this.frameRate;
    physicsManager.VELOCITY_ITERATIONS = this.velocityIterations;
    physicsManager.POSITION_ITERATIONS = this.positionIterations;

    // physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit
    //   | cc.PhysicsManager.DrawBits.e_pairBit
    //   | cc.PhysicsManager.DrawBits.e_centerOfMassBit
    //   | cc.PhysicsManager.DrawBits.e_jointBit
    //   | cc.PhysicsManager.DrawBits.e_shapeBit;
  },
});
