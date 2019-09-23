cc.Class({
  extends: cc.Component,

  onLoad() {
    this.lifeTime = 3;

    this.node.on('touchstart', this.onRunSchedulerConnectionNodeDestroy, this);
    this.node.on('touchend', this.onStopSchedulerConnectionNodeDestroy, this);
    this.node.on('touchcancel', this.onStopSchedulerConnectionNodeDestroy, this);
  },

  onDestroy() {
    this.node.off('touchstart', this.onRunSchedulerConnectionNodeDestroy, this);
    this.node.off('touchend', this.onStopSchedulerConnectionNodeDestroy, this);
    this.node.off('touchcancel', this.onStopSchedulerConnectionNodeDestroy, this);
  },

  // todo анимация (эффект разрушения), пока соединение зажато.
  onRunSchedulerConnectionNodeDestroy() {
    this.scheduleOnce(this.connectionNodeDestroy, this.lifeTime);
  },

  onStopSchedulerConnectionNodeDestroy() {
    this.unschedule(this.connectionNodeDestroy, this);
  },

  // todo разрушение соединения (разрушение через долгое зажатие)
  //  если нейрон остался без соединений - он разрушается.
  // todo эффект для полного разрушения соединения.
  connectionNodeDestroy() {
    this.node.destroy();
  },
});
