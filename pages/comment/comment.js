// pages/comment/comment.js
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
  onLoad: function (options) {
    console.log(options)
    this.comment()
    var that= this
    request.http_get('/interface?action=goodsdetail', {
      id: options.id,
      uid: 240465834
    }, function (res) {
      console.log(res)
      that.setData({
        commentLists: res.commentLists, //评论
      })
      console.log(that.data.commentLists)
      wx.hideLoading()
    })
  },
  comment(id) {
    console.log(id)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=goodComment', {
      g_id: '961686'
    }, function (res) {
      console.log(res)
      that.setData({
        comment: res.data,
      })
      wx.hideLoading()
      // console.log(that.data.list)
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

  }
})