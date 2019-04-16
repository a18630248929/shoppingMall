var app = getApp()
let request = require('../../utils/request.js')
Page({
  data: {
    Length: 6,        //输入框个数
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      money: options.money,
      order_sn: options.order_sn
    })
  },
  onShow: function () {
    wx.hideShareMenu() //隐藏转发
  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    console.log('隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('卸载')
    wx.redirectTo({
      url: '/pages/order/order',
    })
  },

  integralpayment(res) {//积分支付接口
    console.log(res)
    request.http_post('/Pay/ErpPay', {
      uid: wx.getStorageSync('userInfos').uid,
      order_sn: this.data.order_sn,
      pay_type: 2,
      safe_psw: this.data.Value
    }, (res) => {
      console.log(res)
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/order/order',
        })
      }
    })
  }
})
