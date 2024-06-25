const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    distance: number = 250;

    @property
    duration: number = 3;
    
    start () {
        this.move()
    }

    move(){
        let moveRight = cc.moveBy(this.duration, cc.v2(this.distance, 0));
        // Tạo hành động di chuyển từ phải sang trái
        let moveLeft = cc.moveBy(this.duration, cc.v2(-this.distance, 0));

        // Tạo hành động lật chiều node (flip) theo trục x
        let flipRight = cc.callFunc(() => {
            this.node.scaleX = 1;  // Lật về hướng phải
        });

        let flipLeft = cc.callFunc(() => {
            this.node.scaleX = -1; // Lật về hướng trái
        });

        // Tạo chuỗi hành động di chuyển và lật chiều
        let sequence = cc.sequence(
            flipRight,  // Lật về hướng phải
            moveRight,  // Di chuyển sang phải
            flipLeft,   // Lật về hướng trái
            moveLeft    // Di chuyển sang trái
        );

        // Lặp lại chuỗi hành động mãi mãi
        this.node.runAction(cc.repeatForever(sequence));
    }

    // update (dt) {}
}
