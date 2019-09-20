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
    debugDrawFlags: {
      type: [cc.Integer],
      default: [],
      tooltip: `Активация режима - 1, Деактивация режима - 0.

        0: aabbBit
        1: pairBit
        2: centerOfMassBit
        3: jointBit
        4: shapeBit`,
    },
  },

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();

    this.configurePhysics(physicsManager);
    this.configureFlags(physicsManager);
  },

  configurePhysics(physicsManager) {
    physicsManager.enabled = this.isEnabled;
    physicsManager.enabledAccumulator = this.isAccumulator;
    physicsManager.FIXED_TIME_STEP = 1 / this.frameRate;
    physicsManager.POSITION_ITERATIONS = this.positionIterations;
    physicsManager.VELOCITY_ITERATIONS = this.velocityIterations;
  },

  configureFlags(physicsManager) {
    const [
      aabbBit,
      pairBit,
      centerOfMassBit,
      jointBit,
      shapeBit,
    ] = this.debugDrawFlags;

    let flags;

    if (aabbBit === 1) {
      flags = cc.PhysicsManager.DrawBits.e_aabbBit;
    }

    /* eslint-disable no-bitwise */
    if (pairBit === 1) {
      flags |= cc.PhysicsManager.DrawBits.e_pairBit;
    }

    if (centerOfMassBit === 1) {
      flags |= cc.PhysicsManager.DrawBits.e_centerOfMassBit;
    }

    if (jointBit === 1) {
      flags |= cc.PhysicsManager.DrawBits.e_jointBit;
    }

    if (shapeBit === 1) {
      flags |= cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    physicsManager.debugDrawFlags = flags;
  },
});
