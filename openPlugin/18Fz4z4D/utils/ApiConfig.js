var app = getApp();
class APIConfig {
  constructor(){
    this.ServerUrl = app.globalData.siteBaseUrl + '/U4d0MdAu3J'; //填写你自己服务器的服务器域名信息
    //显示loading相关的代码
    this.showLoadingCounter=0;
  }
  ShowLoading(){
    if (this.showLoadingCounter==0){
      wx.showLoading({
        title: '加载中',
      });
    }
    this.showLoadingCounter = this.showLoadingCounter+1;
  };
  CloseLoading() {
    this.showLoadingCounter = this.showLoadingCounter - 1;
    if (this.showLoadingCounter == 0) {
      wx.hideLoading();
    }
  };
  

};

module.exports = APIConfig;