// pages/payment/payment.js
let app = getApp();
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    mayuse: '', //可使用
    alreadyused: '', //已使用
    failure: '' //已失效
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mayuseCoupon() // 调用可使用优惠券
    this.mayuseAlreadyused() //调用已使用优惠券
    this.mayuseFailure() //调用已失效优惠券
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
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
  mayuseCoupon: function () { //获取可用优惠券
    var that = this
    request.http_get('/interface?action=mycoupons', {
      uid: wx.getStorageSync('userInfos').uid,
      state: 1,
      page: 1
    }, (res) => {
      console.log(res)
      that.setData({
        mayuse: res.list
      })
    })
  },
  mayuseAlreadyused: function () { //已使用
    var that = this
    request.http_get('/interface?action=mycoupons', {
      uid: wx.getStorageSync('userInfos').uid,
      state: 2,
      page: 1
    }, (res) => {
      console.log(res)
      that.setData({
        alreadyused: res.list
      })

    })
  },
  mayuseFailure: function () { //已失效
    var that = this
    request.http_get('/interface?action=mycoupons', {
      uid: wx.getStorageSync('userInfos').uid,
      state: 3,
      page: 1
    }, (res) => {
      console.log(res)
      that.setData({
        failure: res.list
      })
    })
  },
  clickBar: function (res) { //点击切换
    console.log(res)
    this.setData({
      currtab: res.currentTarget.dataset.index
    })
  },
  tabChange: function (res) { //滑动切换
    // console.log(res)
    this.setData({
      currtab: res.detail.current
    })
  },
  couponDetails(e) { //跳转详情页
    console.log(e)
    var data = e.currentTarget.dataset.data
    console.log(data)
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
})