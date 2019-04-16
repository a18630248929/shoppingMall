// pages/coilcenter/coilcenter.js
let request = require('../../utils/request.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coilcenter: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.coilcenter()
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
  coilcenter: function () { //优惠券数据
    var that = this
    request.http_get('/interface?action=coupon_center', {
      uid: wx.getStorageSync('userInfos').uid,
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        that.setData({
          coilcenter: res.data
        })
      } else {
        wx.redirectTo({
          url: '/pages/login/jifenzhuce'
        })
      }
    })
  },
  receiveSecurities: function (res) { //领取优惠券
    console.log(res)
    var that = this
    request.http_get('/interface?action=get_coupon', {
      uid: wx.getStorageSync('userInfos').uid,
      give_from: 2,
      cpn_id: res.currentTarget.dataset.id
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        wx.showToast({
          title: '领取成功',
        })
        that.coilcenter()
      }
    })
  },
  useSecurities: function (e) { //优惠券使用
    console.log(e)
    var data = e.currentTarget.dataset.data
    let use_obj = String(data.use_obj)
    console.log(use_obj)
    console.log(use_obj.length)
    if (use_obj.length == 3) {
      wx.navigateTo({
        url: '/pages/special/special?descs=' + data.desc + '&sid=' + use_obj
      })
    } else {
      if (data.use_obj == 0) {
        if (data.seller_id == 0) {
          wx.switchTab({
            url: '/pages/shopping-mall/shopping-mall'
          })
        } else {
          wx.navigateTo({
            url: '/pages/shop/shop?id=' + data.seller_id
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/details/details?id=' + data.use_obj
        })
      }
    }

  }
})