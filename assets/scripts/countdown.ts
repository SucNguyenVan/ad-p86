const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    timeRemaining: number = 15;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label.string = `${this.timeRemaining}s`
        this.startCountdown();
    }

    startCountdown() {
        // Gọi hàm đếm ngược mỗi giây
        this.schedule(this.updateTimer, 1);
    }

    updateTimer(){
        this.timeRemaining --;
        this.label.string = `${this.timeRemaining}s`
        if(this.timeRemaining <= 0){
            this.unschedule(this.updateTimer)
        }
    }

    hiddenCountdown(){
        this.node.active = false
    }
}
