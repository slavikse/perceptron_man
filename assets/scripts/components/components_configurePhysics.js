// Общий компонент для активации эмуляции физических процессов при столкновении тел.
cc.Class({
  extends: cc.Component,

  properties: {
    isEnabled: true,
    isAccumulator: false,
    frameRate: {
      default: 60,
      min: 1,
      max: 60,
      step: 1,
      slide: true,
    },
    positionIterations: {
      default: 10,
      min: 0,
      max: 30,
      step: 1,
      slide: true,
    },
    velocityIterations: {
      default: 10,
      min: 0,
      max: 30,
      step: 1,
      slide: true,
    },
  },

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();

    physicsManager.enabled = this.isEnabled;
    physicsManager.enabledAccumulator = this.isAccumulator;
    physicsManager.FIXED_TIME_STEP = 1 / this.frameRate;
    physicsManager.POSITION_ITERATIONS = this.positionIterations;
    physicsManager.VELOCITY_ITERATIONS = this.velocityIterations;

    // physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit
    //   | cc.PhysicsManager.DrawBits.e_pairBit
    //   | cc.PhysicsManager.DrawBits.e_centerOfMassBit
    //   | cc.PhysicsManager.DrawBits.e_jointBit
    //   | cc.PhysicsManager.DrawBits.e_shapeBit;
  },
});
