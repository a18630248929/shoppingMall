// pages/shop/shop.js
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: '',
    pageNum: 1,
    shop: '',
    shopID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      shopID: options.id
    })
    this.storeinformation()
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
    var that = this
    var page = this.data.pageNum + 1
    request.http_get('/interface?action=sellerDetail', {
      id: this.data.shopID,
      uid: wx.getStorageSync('userInfos').uid,
      page: page,
      cat_id: ''
    }, function (res) {
      var list = res.data.all_goods
      if (list.length == 0) {
        wx.showLoading({
          title: '没有更多数据',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      } else {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        var lists = that.data.lists
        console.log(lists)
        for (var i = 0; i < list.length; i++) {
          lists.push(list[i])
        }
        that.setData({
          lists,
          pageNum: page++
        })
        console.log(that.data.lists)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  storeinformation(res) { //请求店铺详情
    var that = this
    var userInfo = wx.getStorageSync('userInfos')
    request.http_get('/interface?action=sellerDetail', {
      id: this.data.shopID,
      uid: userInfo.uid,
      page: that.data.pageNum,
      cat_id: ''
    }, (res) => {
      console.log(res)
      that.setData({
        lists: res.data.all_goods,
        shop: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.seller.store_name
      })
    })
  },
  details(res) {  // 点击跳转商品详情页
    console.log(res)
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
  }
})