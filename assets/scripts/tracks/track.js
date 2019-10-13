cc.Class({
  extends: cc.Component,

  // TODO проверять, в какой части нейрон находится больше.
  // TODO оптимизация: если нейрон не движется, значит он не сменит дорожку.
  // onCollisionStay(other, self) {
  //   // TODO вводить через событие
  //   // const [trackId] = self.node.name.match(/\d+$/);
  //   // other.node.state.trackId = Number(trackId);
  // },
});
