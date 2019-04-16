// pages/refund/refund.js
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn:'', //订单号
    array:['请选择退款理由','协商一致退款','质量问题','物流问题','假冒品牌','少件/漏发/破损/污渍','7天无理由','拍错/多拍/不想要','其他'],
    refundIndex:0, //退款原因
    otherReasons:'' //其他原因
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_sn: options.order_sn   //获取订单号
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu() //隐藏转发
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindPickerChange(e) { //选择退款理由
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      refundIndex: e.detail.value
    })
  },
  bindTextAreaBlur(e){ //其他原因
    console.log('textarea发送选择改变，携带值为', e.detail.value)
    this.setData({
      otherReasons: e.detail.value
    })
  },
  submitRefund(){ //申请退款
    request.http_get('/interface?action=orderRefound', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      order_sn: this.data.order_sn, //订单号
      need_msg: Number(this.data.refundIndex), //退款原因
      need_des: this.data.otherReasons  //其他原因
    }, (res) => {
      console.log(res)
      if (res.code == 1){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/personal/personal',
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
     
    })
  }
})