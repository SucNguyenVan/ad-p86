const { ccclass, property } = cc._decorator;

@ccclass
export default class CountdownClass extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property
  timeRemaining: number = 15;

  // LIFE-CYCLE CALLBACKS:

  start() {
    if (this.label) {
      this.label.string = `${this.timeRemaining}s`;
    }
    this.startCountdown();
  }

  startCountdown() {
    // Gọi hàm đếm ngược mỗi giây
    this.schedule(this.updateTimer, 1);
  }

  updateTimer() {
    this.timeRemaining--;
    if (this.label) {
      this.label.string = `${this.timeRemaining}s`;
    }
    if (this.timeRemaining <= 0) {
      this.unschedule(this.updateTimer);
      this.node.parent.emit("onOvertimeCountdown")
    }
  }

  hiddenCountdown() {
    this.node.active = false;
  }
}
