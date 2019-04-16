// pages/orderdetails/orderdetails.js
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsProgress: [{ //进度数据
      text: "下单",
      index: -1
    },
    {
      text: "付款",
      index: 0
    },
    {
      text: "发货",
      index: 1
    },
    {
      text: "收货",
      index: 1.5
    },
    {
      text: "完成",
      index: 2
    }
    ],
    orderdetails: "" //订单详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //请求订单详情数据
    console.log(options)
    request.http_get('/interface/index?action=orderDetail', {
      uid: wx.getStorageSync('userInfos').uid,
      order_sn: options.order_sn
    }, (res) => {
      console.log(res)
      this.setData({
        orderdetails: res.data
      })
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

  },
  copyNumbers(e) { //复制单号
    console.log(e)
    let order_sn = e.currentTarget.dataset.order_sn
    wx.setClipboardData({
      data: order_sn,
      success(res) {
        console.log(res)
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  remindershipment(e) { //提醒卖家发货
    request.http_get('/interface?action=orderRemind', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      order_sn: e.currentTarget.dataset.order_sn
    }, (res) => {
      console.log(res)
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000
      })
    })
  },
  confirmreceipt(e) { //确认收货
    console.log(e)
    wx.showModal({
      content: '确定收到货?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request.http_post('/interface', {
            action: 'orderReceipt',
            uid: wx.getStorageSync('userInfos').uid,
            ticket: wx.getStorageSync('userInfos').ticket,
            order_sn: e.currentTarget.dataset.order_sn
          }, (res) => {
            console.log(res)
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  refund(res){ // 跳转到退款页面
    console.log(res)
    wx.navigateTo({
      url: '/pages/refund/refund?order_sn=' + res.currentTarget.dataset.order_sn,
    })
  }
})