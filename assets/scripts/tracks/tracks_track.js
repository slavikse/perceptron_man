cc.Class({
  extends: cc.Component,

  // onLoad () {},

  // TODO проверять, в какой части нейрон находится больше.
  onCollisionStay(other, self) {
    if (other.node.name === 'neuron') {
      console.log(self.node.name);
    }
  },
});
