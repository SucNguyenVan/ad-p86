const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  handler_node: cc.Node = null;

  @property(cc.Node)
  raft_node: cc.Node = null;

  @property(cc.Node)
  women_node: cc.Node = null;

  @property(cc.Node)
  men_node: cc.Node = null;

  @property(cc.Node)
  countdown_node: cc.Node = null;

  @property(cc.Node)
  raftItem1_node: cc.Node = null;

  @property(cc.Node)
  raftItem2_node: cc.Node = null;

  @property(cc.Node)
  reef_node: cc.Node = null;

  @property(cc.Node)
  lifebouy_node: cc.Node = null;

  @property(cc.Node)
  overlay_node: cc.Node = null;

  validDistanceOfRaftAction: number = 70

  startWomenPosition: cc.Vec2 = null;

  startRaftItemPosition: cc.Vec2 = null;

  raftMoveAction: cc.ActionInterval = null;

  handMoveAction: cc.ActionInterval = null

  @property
  moveDuration = 2;

  onLoad() {
    // this.addEventForWomen()
    this.bootstrap();
  }

  protected start(): void {
    this.addEventForWomen();
  }

  bootstrap() {
    this.raftItem1_node.active = false;
    this.raftItem2_node.active = false;
    this.reef_node.active = false;
    this.women_node.zIndex = 9;
    // this.raftItem2_node.zIndex = 9
    this.moveHandler(this.women_node, this.raft_node, true);
    this.startWomenPosition = this.women_node.getPosition();
    this.node.on("onUpgradeFullRaft", this.upgradeFullRaft, this);
    this.node.on("onCollideWithReef", this.collideWithReef, this);
    this.node.on("onOvertimeCountdown", this.displayDownloadOverlay, this)
    if (this.lifebouy_node) {
      this.lifebouy_node.active = false;
    }
    this.setUpOverlay()
  }

  setUpOverlay(){
    this.overlay_node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch )=> {
      event.stopPropagation()
    }, this)
    this.overlay_node.zIndex = 10
    this.overlay_node.active = false
  }

  hiddenHand_node(){
    if(this.handMoveAction){
      this.handler_node.stopAction(this.handMoveAction)
      this.handMoveAction = null
    }
    this.handler_node.active = false;
  }

  moveHandler(startNode: cc.Node, destinationNode: cc.Node, isRepeat: boolean) {
    // Lấy vị trí của object A và B
    let positionA = startNode.getPosition();
    let positionB = destinationNode.getPosition();
    this.handler_node.setPosition(positionA);
    // Di chuyển object C từ A đến B
    this.handMoveAction = cc.sequence(
      cc.moveTo(this.moveDuration, positionB),
      cc.callFunc(() => {
        // Sau khi đến B, di chuyển ngay lập tức về A và lặp lại
        this.handler_node.setPosition(positionA);
        if(isRepeat){
          this.moveHandler(startNode, destinationNode, isRepeat); // Gọi lại hàm để lặp lại quá trình
        }
      })
    );
    this.handler_node.runAction(this.handMoveAction);
  }

  hiddenSharkFin() {
    const sharkFin1 = this.node.getChildByName("sharkFin");
    if (sharkFin1) {
      sharkFin1.active = false;
    }
    const sharkFin2 = this.node.getChildByName("sharkFin2");
    if (sharkFin2) {
      sharkFin2.active = false;
    }
  }

  moveNode(event: cc.Event.EventTouch) {
    const targetNode: cc.Node = event?.target;
    let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
    targetNode.setPosition(touchPos);
  }

  onTouchMoveWomen(event: cc.Event.EventTouch) {
    this.moveNode(event);
  }

  onTouchEndWomen(event: cc.Event.EventTouch) {
    const currentTouchCancelPosition = this.node.convertToNodeSpaceAR(
      event.getLocation()
    );
    const raftPosition = this.raft_node.getPosition();
    const distancePosition = currentTouchCancelPosition.sub(raftPosition).mag();
    if (distancePosition <= this.validDistanceOfRaftAction) {
      this.hiddenHand_node()
      this.women_node.active = false;
      const raft_node = this.node.getChildByName("raft");
      if (raft_node) {
        raft_node.getComponent("raft")?.displayWomen_node();
      }
      this.countdown_node.active = false;
      // this.hiddenSharkFin();
      this.addEventForRaftItem(this.raftItem1_node);
      this.addEventForRaftItem(this.raftItem2_node);
      this.raftItem1_node.active = true;
      this.raftItem2_node.active = true;
      this.handler_node.active = true
      this.moveHandler(this.raftItem2_node, this.raft_node, true)
    } else {
      this.women_node.setPosition(this.startWomenPosition);
    }
  }

  addEventForWomen() {
    this.women_node.on(
      cc.Node.EventType.TOUCH_MOVE,
      this.onTouchMoveWomen,
      this
    );
    this.women_node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndWomen, this);
  }

  addEventForRaftItem(node: cc.Node) {
    node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartRaftItem, this);
    node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveRaftItem, this);
    node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndRaftItem, this);
  }

  onTouchStartRaftItem(event: cc.Event.EventTouch) {
    const targetNode: cc.Node = event?.target;
    if (targetNode) {
      this.startRaftItemPosition = targetNode.getPosition();
    }
  }

  onTouchMoveRaftItem(event: cc.Event.EventTouch) {
    this.moveNode(event);
  }

  onTouchEndRaftItem(event: cc.Event.EventTouch) {
    const currentTouchCancelPosition = this.node.convertToNodeSpaceAR(
      event.getLocation()
    );
    const raftPosition = this.raft_node.getPosition();
    const distancePosition = currentTouchCancelPosition.sub(raftPosition).mag();
    if (distancePosition <= this.validDistanceOfRaftAction) {
      event.target.active = false;
      const raft_node = this.node.getChildByName("raft");
      if (raft_node) {
        raft_node.getComponent("raft")?.updateLevel();
        if(event.target === this.raftItem2_node){
          this.hiddenHand_node()
          this.handler_node.active = true
          this.moveHandler(this.raftItem1_node, this.raft_node, true)
        }
        if(this.raft_node.getComponent("raft")?.isFullLevel()){
          this.hiddenHand_node()
        }
      }
    } else {
      event.target.setPosition(this.startRaftItemPosition);
    }
  }

  upgradeFullRaft() {
    this.reef_node.active = true;
    this.raftMoveToReef();
  }

  raftMoveToReef() {
    const reefPos = this.reef_node.getPosition();
    const moveDuration = 2;
    this.raftMoveAction = cc.moveTo(moveDuration, reefPos);
    this.raft_node.runAction(this.raftMoveAction);
  }

  stopMoveOfRaft() {
    this.raft_node.stopAction(this.raftMoveAction);
  }

  breakRaft() {
    const raft_node = this.node.getChildByName("raft");
    if (raft_node) {
      raft_node.getComponent("raft")?.breakRaft();
    }
  }
  

  showLifebouy() {
    this.lifebouy_node.active = true;
    const newPositionOfHand = this.lifebouy_node.convertToWorldSpaceAR(
      cc.v2(0, 100)
    );
    const positionHandInNode =
      this.node.convertToNodeSpaceAR(newPositionOfHand);
    this.handler_node.setPosition(positionHandInNode);
    this.handler_node.stopAllActions();
    this.handler_node.active = true;
    this.lifebouy_node.on(
      cc.Node.EventType.TOUCH_START,
      this.lifebouyMoveToCharacters,
      this
    );
    this.handler_node.stopAllActions()
    // this.handler_node.getComponent("hand")?.turnOnJumpUpDown()
    this.jumpUpDown(this.handler_node)
  }

  jumpUpDown(node:cc.Node){
    let jumpUp = cc.moveBy(0.5, cc.v2(0, 50)).easing(cc.easeCubicActionOut());
        let jumpDown = cc.moveBy(0.5, cc.v2(0, -50)).easing(cc.easeCubicActionIn());
        let jumpSequence = cc.sequence(jumpUp, jumpDown);
        node.runAction(cc.repeatForever(jumpSequence));
  }

  lifebouyMoveToCharacters(event: cc.Event.EventTouch) {
    const menPos = this.men_node.getPosition();
    const moveDuration = 0.5;
    const moveAction = cc.moveTo(moveDuration, menPos);
    this.lifebouy_node.runAction(moveAction);
    this.handler_node.active = false;
    setTimeout(()=>{
      this.displayDownloadOverlay(true)
    }, 1500)
  }

  actionWithCharacter() {
    const nodeMen = this.raft_node.getChildByName("men");
    if (nodeMen) {
      this.men_node = nodeMen;
    }
    const nodeWomen = this.raft_node.getChildByName("women");
    if (nodeWomen) {
      this.women_node = nodeWomen;
    }
    // this.men_node = this.raft_node.getChildByName("men");
    // this.women_node = this.raft_node.getChildByName("women");
    if (this.men_node && this.women_node) {
      let positionInWorld1 = this.raft_node.convertToWorldSpaceAR(
        cc.v2(0, this.raft_node.height / 2 + 300)
      );
      let positionInBackground1 =
        this.node.convertToNodeSpaceAR(positionInWorld1);
      this.men_node.setParent(this.node);
      // console.log({ positionInBackground1 });
      this.men_node.setPosition(positionInBackground1);
      this.men_node.zIndex = 9;
      this.men_node.active = true;

      // Di chuyển women_node sang bên trái node bè
      let positionInWorld2 = this.raft_node.convertToWorldSpaceAR(
        // cc.v2(-this.raft_node.width / 2 - 300, 0)
        cc.v2(50, this.raft_node.height / 2 + 300)
      );
      let positionInBackground2 =
        this.node.convertToNodeSpaceAR(positionInWorld2);
      this.women_node.setParent(this.node);
      this.women_node.setPosition(positionInBackground2);
      this.women_node.zIndex = 9;
      this.women_node.active = true;
    }
  }

  collideWithReef() {
    this.stopMoveOfRaft();
    this.breakRaft();
    if (this.raft_node) {
      this.actionWithCharacter();
      this.showLifebouy();
    }
  }

  displayDownloadOverlay(active:boolean = true){
    this.overlay_node.active = true
  }
}
// up(dt) {}
