// pages/classification/classification.js
let request = require('../../utils/request.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceH: 0,
    subscript: 0,
    categoricalData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('uid', options.uid)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    })
    this.classificationinterface()
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
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
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
  subscript(e) {//点击变换颜色
    console.log(e)
    this.setData({
      subscript: e.currentTarget.dataset.index
    })
  },
  classificationinterface() {//请求分类接口
    let that = this
    request.http_get('/interface?action=categoryList', {
      uid: 240465834,
      id: 52719
    }, function (res) {
      console.log('回调', res)
      res.list.list[0].list.splice(0, 1)
      // console.log("11111111",list,res)

      that.setData({
        categoricalData: res.list.list
      })
    })
  },
  category(e) {
    console.log(e)
    var cid = 3
    wx.navigateTo({
      url: '/pages/category/category?cid=' + cid,
      success(res) {
        console.log(res)
        app.globalData.category = e.currentTarget.dataset.arr
      }
    })
  },
})