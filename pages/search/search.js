let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchname: ['打底裤', '童装', '女装', '睡衣', '外套', '内衣', '手表', '鞋'],
    pageNum:1,
    searchinput:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.search()
  },
  input1: function(e) {
    console.log(e)
    this.search(e.detail.value)
  },
  confirm1: function(e) {
    this.search(e.detail.value)
  },
  search: function(key) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(key)
    this.setData({
      key: key
    })
    var that = this
    request.http_get('/interface?action=search', {
      key: key,
      uid: 240465834,
      page: that.data.pageNum,
      appver: '3.5.06',
      iversion: 3506,
      dev: 1,
      appType: 1
    }, function(res) {
      console.log(res)
      var arr = []
      for (let i in res.list) {
        if (res.list[i].goods_name.indexOf(key) >= 0) { //也可使用search查找
          arr.push(res.list[i])
        }
      }
      console.log(arr)
      if (arr.length == 0 || key == "") {
        that.setData({
          list: []
        })
      } else {
        that.setData({
          list: arr
        })
      }
      wx.hideLoading()
    })
  },
  clicksearch(e) {
    console.log(e)
    var searchinput = this.data.searchinput
    var searchname = e.currentTarget.dataset.searchname
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      searchinput: searchname
    })
    var searchname = e.currentTarget.dataset.searchname
    this.search(searchname)
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
  onReachBottom: function () {
    var list = this.data.list
    console.log(list)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var page = Number(that.data.pageNum) + 1
    request.http_get('/interface?action=search', {
      key: that.data.key,
      uid: 240465834,
      page: page,
      appver: '3.5.06',
      iversion: 3506,
      dev: 1,
      appType: 1
    }, function (res) {
      console.log(res)
      if (res.list.length == 0) {
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
        for (var i = 0; i < res.list.length; i++) {
          list.push(res.list[i])
        }
        console.log(list)
        that.setData({
          list: list,
          pageNum: page++
        })
        console.log(that.data.list)
      }
      wx.hideLoading()
      console.log(that.data.list)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  details(e) { //跳转详情页面
    // console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/details/details?id=" + id
    })
  }
})