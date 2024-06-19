const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    handler_node: cc.Node = null;

    @property(cc.Node)
    raft_node: cc.Node = null;

    @property(cc.Node)
    women_node: cc.Node = null;

    @property(cc.Node)
    countdown_node: cc.Node = null;

    @property(cc.Node)
    raftItem1_node: cc.Node = null;

    @property(cc.Node)
    raftItem2_node: cc.Node = null;

    startWomenPosition: cc.Vec2 = null

    startRaftItemPosition: cc.Vec2 = null

    @property
    moveDuration = 2

    onLoad () {
        this.women_node.zIndex = 9
        this.moveHandler()
        this.startWomenPosition = this.women_node.getPosition()
        // this.addEventForWomen()
    }

    protected start(): void {
        this.addEventForWomen()
    }

    moveHandler() {
        // Lấy vị trí của object A và B
        let positionA = this.raft_node.getPosition();
        let positionB = this.women_node.getPosition();
        this.handler_node.setPosition(positionB);
        // Di chuyển object C từ A đến B
        let moveAction = cc.sequence(
            cc.moveTo(this.moveDuration, positionA),
            cc.callFunc(() => {
                // Sau khi đến B, di chuyển ngay lập tức về A và lặp lại
                this.handler_node.setPosition(positionB);
                this.moveHandler(); // Gọi lại hàm để lặp lại quá trình
            })
        );

        // Áp dụng hành động di chuyển cho object C
        this.handler_node.runAction(moveAction);
    }

    moveNode(event: cc.Event.EventTouch){
        const targetNode: cc.Node = event?.target;
        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        targetNode.setPosition(touchPos);
    }

    onTouchMoveWomen(event: cc.Event.EventTouch) {
        this.moveNode(event)
    }

    onTouchEndWomen(event: cc.Event.EventTouch) {
        const currentTouchCancelPosition = this.node.convertToNodeSpaceAR(
            event.getLocation()
        );
        const raftPosition = this.raft_node.getPosition()
        const distancePosition = currentTouchCancelPosition.sub(raftPosition).mag()
        if(distancePosition <= 50){
            this.handler_node.active =false
            this.women_node.active =false
            const raft_node = this.node.getChildByName("raft")
            if(raft_node){
                raft_node.getComponent("raft")?.displayWomen_node()
            }
            this.countdown_node.active =false
            this.addEventForRaftItem(this.raftItem1_node)
            this.addEventForRaftItem(this.raftItem2_node)
        }else{
            this.women_node.setPosition(this.startWomenPosition)
        }
    }

    addEventForWomen(){
        this.women_node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveWomen, this);
        this.women_node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndWomen, this)
    }

    addEventForRaftItem(node: cc.Node){
        node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartRaftItem, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveRaftItem, this);
        node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndRaftItem, this)
    }

    onTouchStartRaftItem(event: cc.Event.EventTouch){
        const targetNode: cc.Node = event?.target;
        if(targetNode){
            this.startRaftItemPosition = targetNode.getPosition()
        }
    }

    onTouchMoveRaftItem(event: cc.Event.EventTouch){
        this.moveNode(event)
    }

    onTouchEndRaftItem(event: cc.Event.EventTouch) {
        const currentTouchCancelPosition = this.node.convertToNodeSpaceAR(
            event.getLocation()
        );
        const raftPosition = this.raft_node.getPosition()
        const distancePosition = currentTouchCancelPosition.sub(raftPosition).mag()
        if(distancePosition <= 50){
            event.target.active = false
            const raft_node = this.node.getChildByName("raft")
            if(raft_node){
                raft_node.getComponent("raft")?.updateLevel()
            }
        }else{
            event.target.setPosition(this.startRaftItemPosition)
        }
    }

    // update (dt) {}
}
