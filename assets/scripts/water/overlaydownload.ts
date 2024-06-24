const {ccclass, property} = cc._decorator;
declare var mraid: {
    open: (url: string) => void;
    close?: () => void;
    expand?: () => void;
    resize?: () => void;
    getState?: () => string;
    isViewable?: () => boolean;
    addEventListener?: (event: string, listener: () => void) => void;
    removeEventListener?: (event: string, listener: () => void) => void;
  };
@ccclass
export default class OverlayDownloadClass extends cc.Component {

    @property(cc.Node)
    downloadButton_node: cc.Node = null;

    androidDownloadLink = "https://play.google.com/store/apps/details?id=com.cscmobi.farm2.adventure"

    start () {
        if(this.downloadButton_node){
            this.bindEventClickForDownloadButton(this.downloadButton_node, this.androidDownloadLink)
        }
    }

    bindEventClickForDownloadButton(node: cc.Node, url: string) {
        if (node) {
          node.on(cc.Node.EventType.TOUCH_END, () => {
            if (typeof mraid !== "undefined" && mraid.open) {
              mraid.open(url);
            } else {
              window.open(url, "_blank");
            }
          }),
            this;
        }
      }
}
