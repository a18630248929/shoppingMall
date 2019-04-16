// pages/signin/signin.js
let app = getApp()
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (wx.getStorageSync('getuserInfo')) {
      //  if (options.id){
      //   wx.reLaunch({
      //     url: '/pages/details/details?id='+options.id
      //   });
      // }else{
        wx.reLaunch({
          url: '/pages/shopping-mall/shopping-mall'
        });
      // }
    }

    wx.setStorageSync('uid', options.uid)
    // if (wx.getStorageSync('getuserInfo')) {
    //   wx.reLaunch({
    //     url: '/pages/shopping-mall/shopping-mall'
    //   });
    // }


    this.netease(); //储存网易数据
  },

  netease() { //储存网易数据
    var that = this
    request.http_get('/interface?action=nsubject', {
      sid: 550
    }, function(res) {
      // console.log(res)
      app.globalData.netease = res
      // console.log(app.globalData.netease)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideShareMenu() //隐藏转发
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onGotUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      wx.setStorageSync('getuserInfo', e.detail.userInfo)
      wx.reLaunch({
        url: '/pages/shopping-mall/shopping-mall'
      });
    }
  }
})