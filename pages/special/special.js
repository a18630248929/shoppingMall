// pages/special/special.js
let request = require('../../utils/request.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      index: options.index,
      sid: options.sid
    })

    wx.setNavigationBarTitle({
      title: options.descs
    })
    if (options.sid == 550) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 2000
      })
      if (app.globalData.netease.code == undefined) {
        this.special(550)
      } else {
        this.setData({
          lists: app.globalData.netease.list,
          banner: app.globalData.netease.subject.banner
        })
      }
    } else {
      if (options.index == 4) {
        this.tcl()
      } else {
        this.setData({
          hide: false
        })
        this.special(options.sid);
      }
    }

  },

  special(sid) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=nsubject', {
      sid: sid,
      sort_name: 'jg',
      sort_type: 'dasc'
    }, function (res) {
      console.log(res)
      that.setData({
        lists: res.list,
        banner: res.subject.banner
      })
      wx.hideLoading()
      console.log(that.data.lists)
    })
  },

  tcl() { //获取TCL 52721
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=sellerDetail', {
      uid: 240456984,
      page: that.data.pageNum,
      id: 52721
    }, function (res) {
      console.log(res)
      that.setData({
        lists: res.data.all_goods
      })
      wx.hideLoading()
      console.log(that.data.lists)
    })
  },


  details: function (e) { //商品详情页面跳转
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
  },


  centralnavigation: function (e) { //中部导航跳转地址
    // console.log(e)
    var index = e.currentTarget.dataset.index
    var cat_id = e.currentTarget.dataset.cat_id
    var cid = '3'
    var desc = '百望自营'
    wx.navigateTo({
      url: '../centralnavigation/centralnavigation?index=' + index + '&cat_id=' + cat_id + '&cid=' + cid + '&desc=' + desc,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //回到顶部，内部调用系统API
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，暂无法使用该功能，请升级后重试。'
      })
    }
  },
  onPageScroll: function (e) { //检测滚动距离
    // console.log(e)
    var scrollTop = e.scrollTop
    // console.log(scrollTop)
    if (scrollTop > 800) {
      this.setData({
        yin: true
      })
    } else {
      this.setData({
        yin: false
      })
    }
  }
})