const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    distance: number = 100;

    @property
    duration: number = 3;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.move()
    }

    move(){
        let moveDown = cc.moveBy(this.duration, cc.v2(0, -this.distance));
        let rotateDown = cc.rotateTo(0.1, 180);
        let moveUp = cc.moveBy(this.duration, cc.v2(0, this.distance));
        let rotateUp = cc.rotateTo(0.1, 0);
        let moveSequence = cc.sequence(moveDown, rotateDown, moveUp, rotateUp);
        let moveAction = cc.repeatForever(moveSequence);
        this.node.runAction(moveAction);
    }

    // update (dt) {}
}
