// Общий компонент для активации эмуляции физических процессов при столкновении тел.
cc.Class({
  extends: cc.Component,

  onLoad() {
    const physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;

    // Enable settings for physics timestep
    // physicsManager.enabledAccumulator = true;

    // Physics timestep, default FIXED_TIME_STEP is 1/60
    // physicsManager.FIXED_TIME_STEP = 1 / 30;

    // The number of iterations per update of the Physics System processing speed is 10 by default
    // physicsManager.VELOCITY_ITERATIONS = 8;

    // The number of iterations per update of the Physics processing location is 10 by default
    // physicsManager.POSITION_ITERATIONS = 8;

    // physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit
    //   | cc.PhysicsManager.DrawBits.e_pairBit
    //   | cc.PhysicsManager.DrawBits.e_centerOfMassBit
    //   | cc.PhysicsManager.DrawBits.e_jointBit
    //   | cc.PhysicsManager.DrawBits.e_shapeBit;
  },
});
