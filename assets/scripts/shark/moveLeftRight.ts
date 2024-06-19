const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    distance: number = 400;

    @property
    duration: number = 3;
    
    start () {
        this.move()
    }

    move(){
        let moveRight = cc.moveBy(this.duration, cc.v2(this.distance, 0));
        let rotateLeft = cc.rotateTo(0.1, 90);
        let moveLeft = cc.moveBy(this.duration, cc.v2(-this.distance, 0));
        let rotateRight = cc.rotateTo(0.1, 270);
        let moveSequence = cc.sequence(moveRight, rotateLeft, moveLeft, rotateRight);
        let moveAction = cc.repeatForever(moveSequence);
        this.node.runAction(moveAction);
    }

    // update (dt) {}
}
