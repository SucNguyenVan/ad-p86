// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RaftClass extends cc.Component {
  @property(cc.Node)
  raftLevel1_node: cc.Node = null;
  @property(cc.Node)
  raftLevel2_node: cc.Node = null;
  @property(cc.Node)
  raftLevel3_node: cc.Node = null;
  @property(cc.Node)
  raftBreak_node: cc.Node = null;
  @property(cc.Node)
  men_node: cc.Node = null;
  @property(cc.Node)
  women_node: cc.Node = null;
  @property
  raftLevel: number = 1;

  maxLevelRaft = 3;

  isCollidedWithReef = false;

  updateLevel() {
    this.raftLevel = this.raftLevel + 1;
    this.displayRaft();
    if (this.raftLevel === this.maxLevelRaft) {
      this.node.parent.emit("onUpgradeFullRaft");
    }
  }

  displayRaft() {
    switch (this.raftLevel) {
      case 1:
        this.raftLevel1_node && (this.raftLevel1_node.active = true);
        this.raftLevel2_node && (this.raftLevel2_node.active = false);
        this.raftLevel3_node && (this.raftLevel3_node.active = false);
        break;
      case 2:
        this.raftLevel1_node.active = false;
        this.raftLevel2_node.active = true;
        this.raftLevel3_node.active = false;
        break;
      case 3:
        this.raftLevel1_node.active = false;
        this.raftLevel2_node.active = false;
        this.raftLevel3_node.active = true;
        break;
      default:
        this.raftLevel1_node.active = false;
        this.raftLevel2_node.active = false;
        this.raftLevel3_node.active = false;
        console.log("Cấp độ không hợp lệ");
        break;
    }
  }

  // LIFE-CYCLE CALLBACKS:

  // onLoad() {

  // }

  start() {
    if (this.women_node) {
      this.women_node.active = false;
    }
    if (this.raftBreak_node) {
      this.raftBreak_node.active = false;
    }
    this.displayRaft();
    cc.director.getCollisionManager().enabled = true;
  }

  displayWomen_node() {
    this.women_node.active = true;
  }
  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    // console.log({ self });
    // self.enabled = false;
    if (other.node.name === "reef" && !this.isCollidedWithReef) {
      this.isCollidedWithReef = true;
      this.node.parent.emit("onCollideWithReef");
    }
  }
  breakRaft() {
    this.raftLevel1_node.active = false;
    this.raftLevel2_node.active = false;
    this.raftLevel3_node.active = false;
    this.men_node.active = false;
    this.women_node.active = false;
    this.raftBreak_node.active = true;
  }

  isFullLevel(): boolean{
    return this.raftLevel === this.maxLevelRaft
  }
  // update (dt) {}
}
