class StorageMgr {
  constructor(){
    this.tag="kanjia";
  }

  getValue(key,callback){

    key = this.tag + "_" + key;
    if(callback!=undefined){
      wx.getStorage({
        key: key,
        success: function(res) {
          callback(res);
        },
      })
    }else{
      return wx.getStorageSync(key);
    }
  }

  setValue(key,value) {
    key = this.tag + "_" + key;
    wx.setStorage({
      key: key,
      data: value,
    });
  }
  

}

module.exports = StorageMgr;