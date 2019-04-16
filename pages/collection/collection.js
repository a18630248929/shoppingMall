// pages/collection/collection.js
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1, //页数
    cid: 3, // 商城id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.datas();
  },
  datas() { //收藏商品列表
    var that = this
    request.http_get('/interface?action=listCollection', {
      uid: wx.getStorageSync('userInfos').uid,
      type: 'goods',
      page: 1
    }, function (res) {
      console.log(res)
      that.setData({
        list: res.data,
      })
      console.log(that.data.list)
    })
  },
  collection(e) { //取消收藏
    console.log(e)
    var that = this
    request.http_get('/interface?action=addCollection', {
      id: e.currentTarget.dataset.id,
      uid: wx.getStorageSync('userInfos').uid, //用户id
      type: 1, //2是店铺
      goods_id: e.currentTarget.dataset.goods_id //商品id
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        wx.showToast({
          title: '取消收藏',
          duration: 1000
        })
        that.datas()
      }
    })
  },
  detailsgoods(e) {
    console.log(e)
    var id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
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