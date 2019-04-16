// pages/payment/payment.js
let Pingpp = require('../../utils/pingpp.js')
let request = require('../../utils/request.js')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    order_sn: '',
    radioSwich: 1,
    paymentDetails: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      money: options.money,
      order_sn: options.order_sn
    })
    this.paymentDetails()
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
  confirmPayment: function (res) { //支付接口
    console.log(res)
    if (this.data.radioSwich == 1) {
      request.http_json('/pingpp/smallCharge', {
        channel: 'wx_lite', //渠道名
        amount: this.data.money * 100, //支付金额
        open_id: wx.getStorageSync('open_id'), //之前获取到的open_id
        order_no: this.data.order_sn //订单
      }, (res) => {
        console.log(res)
        var charge = res
        Pingpp.createPayment(charge, function (result, err) {
          console.log(result);
          console.log(err.msg);
          console.log(err.extra);
          if (result == "success") {
            // 只有微信小程序 wx_lite 支付成功的结果会在这里返回
            console.log('付款成功')
            wx.redirectTo({
              url: '/pages/order/order'
            })
          } else if (result == "fail") {
            // charge 不正确或者微信小程序支付失败时会在此处返回
          } else if (result == "cancel") {
            // 微信小程序支付取消支付
            wx.redirectTo({
              url: '/pages/order/order'
            })
          }
        });
      })
    } else {
      wx.navigateTo({
        url: '/pages/integralpayment/integralpayment?money=' + this.data.order_money + '&order_sn=' + this.data.order_sn,
      })
    }

  },
  balanceChange(e) {//获取支付选项
    console.log(e.detail.value)
    this.setData({
      radioSwich: e.detail.value
    })
  },
  paymentDetails() {
    // http://betaapi.baiwangkeji.com/pay/Account?uid=240458695&order_sn=2019031564e6d95dc7c8
    var that = this
    request.http_get('/pay/Account', {
      action: 'orderDetail',
      uid: wx.getStorageSync('userInfos').uid,
      order_sn: this.data.order_sn
    }, (res) => {
      console.log(res)
      this.setData({
        paymentDetails: res
      })
    })
  }
})