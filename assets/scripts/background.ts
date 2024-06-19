// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    background: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad () {
        this.setBackgroundSize()
    }
    setBackgroundSize() {
        // Get the design resolution of the canvas
        const canvas = cc.Canvas.instance;
        const designResolution = canvas.designResolution;
        
        // Set the size of the background sprite to match the design resolution
        this.background.node.width = designResolution.width;
        this.background.node.height = designResolution.height;
    }
    // update (dt) {}
}
