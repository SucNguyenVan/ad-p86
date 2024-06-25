const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property
  distance: number = 250;

  @property
  duration: number = 2;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {
    this.move();
  }

  move() {
    let moveDown = cc.moveBy(this.duration, cc.v2(0, -this.distance));
    let moveUp = cc.moveBy(this.duration, cc.v2(0, this.distance));
    let flipDown = cc.callFunc(() => {
      this.node.scaleX = 1; // Lật về hướng down
    });

    let flipUp = cc.callFunc(() => {
      this.node.scaleX = -1; // Lật về hướng up
    });

    // Tạo chuỗi hành động di chuyển và lật chiều
    let sequence = cc.sequence(
      flipDown, // Lật về hướng down
      moveDown, // Di chuyển sang down
      flipUp, // Lật về hướng up
      moveUp // Di chuyển sang up
    );
    cc.sys.os
    // Lặp lại chuỗi hành động mãi mãi
    this.node.runAction(cc.repeatForever(sequence));
  }

  // update (dt) {}
}
