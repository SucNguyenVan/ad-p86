const { ccclass, property } = cc._decorator;

@ccclass
export default class HandClass extends cc.Component {
  jumpHeight: 150;
  jumpDuration: 1;
  jumpSequence: cc.ActionInterval = null;
  start() {}

  turnOnJumpUpDown() {
    console.log("jump")
    let jumpUp = cc
      .moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight))
      .easing(cc.easeCubicActionOut());
    let jumpDown = cc
      .moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight))
      .easing(cc.easeCubicActionIn());
    this.jumpSequence = cc.sequence(jumpUp, jumpDown);
    this.node.runAction(cc.repeatForever(this.jumpSequence));
  }

  turnOffJumpUpDown() {
    this.node.stopAllActions()
    this.node.stopAction(this.jumpSequence);
  }
}
