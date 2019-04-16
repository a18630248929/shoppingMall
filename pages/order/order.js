let app = getApp();
let request = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swipertab: [{
      name: "全部",
      index: 0
    }, {
      name: "待付款",
      index: 1
    }, {
      name: "待发货",
      index: 2
    }, {
      name: "待收货",
      index: 3
    },
      {
        name: "待评价",
        index: 4
      }, {
        name: "退款",
        index: 5
      }, 
    ],
    orderDetails: '',
    pageNum: 1,
    filter: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    this.setData({
      currtab: Number(app.globalData.currtab)
    })
    this.orderShow()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },

  getDeviceInfo: function () { //获取页面高宽
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
  },

  /**
   * @Explain：选项卡点击切换
   */
  tabSwitch: function (e) {
    console.log(e)
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function (e) { //当行滑动切换
    console.log(e)
    this.setData({
      currtab: e.detail.current
    })
    this.orderShow()
  },

  orderShow: function () {
    let that = this
    console.log(typeof this.data.currtab)
    switch (this.data.currtab) {
      case 0:
        that.allOrders() //全部订单执行
        break
      case 1:
        that.stayPayment() //代付款
        break
      case 2:
        that.stayDelivergoods() //待发货
        break
      case 3:
        that.stayReceivinggoods() //待收货
        break
      case 4:
        that.stayEvaluate() //待评价
        break
      case 5:
        that.refund() //退款
        break
    }
  },
  allOrders: function () { //全部订单
    this.setData({
      pageNum: 1
    })
    this.orderList('all')
  },
  stayPayment: function () { //代付款
    this.setData({
      pageNum: 1
    })
    this.pendingPayment()
  },
  stayDelivergoods: function () { //待发货
    this.setData({
      pageNum: 1
    })
    this.orderList('noship')
  },
  stayReceivinggoods: function () { //待收货
    this.setData({
      pageNum: 1
    })
    this.orderList('noreceive')
  },
  stayEvaluate: function () { //待评价
    this.setData({
      pageNum: 1
    })
    this.orderList('rcvandnotcmt')
  },
  refund: function () { //退款
    this.setData({
      pageNum: 1
    })
    this.orderList('refund')
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
  orderList: function (res) { //订单全部列表
    console.log(res, '订单状态', typeof res)
    console.log(this.data.pageNum)

    var that = this
    request.http_get('/interface?action=orderList', {
      uid: wx.getStorageSync('userInfos').uid,
      filter: res,
      page: this.data.pageNum,
      pageSize: 10
    }, (res) => {
      console.log(res)

      // for (var i = 0; i < res.noPayResult.length; i++) {
      //   for (var j = 0; j < res.noPayResult[i].sub_orders.length; j++) {
      //     for (var x = 0; x < res.noPayResult[i].sub_orders[j].sub_order_item.length; x++) {
      //       var good_id = res.noPayResult[i].sub_orders[j].sub_order_item[x].good_id
      //     }
      //   }
      // }
      // console.log(good_id)
      that.setData({
        orderDetails: res
      })
    })
    this.setData({
      filter: res
    })
  },
  // lower: function(e) { //到底部上拉执行
  //   console.log(e)
  //   var that = this
  //   console.log(this.data.pageNum)
  //   console.log(this.data.filter)
  //   request.http_get('/interface?action=orderList', {
  //     uid: wx.getStorageSync('userInfos').uid,
  //     filter: this.data.filter,
  //     page: that.data.pageNum + 1,
  //     pageSize: 10
  //   }, (res) => {
  //     wx.showLoading({
  //       title: '加载中',
  //     })

  //     setTimeout(function() {
  //       wx.hideLoading()
  //     }, 1000)
  //     console.log(res)
  //     var orderDetails = that.data.orderDetails
  //     console.log(orderDetails)
  //     for (var i = 0; i < res.result.length; i++) {
  //       orderDetails.push(res.result[i])
  //     }
  //     console.log(orderDetails)
  //     that.setData({
  //       orderDetails: orderDetails,
  //       pageNum: that.data.pageNum + 1
  //     })
  //     console.log(that.data.orderDetails)
  //     console.log(that.data.pageNum)
  //   })
  // },
  cancelOrder: function (e) { //取消订单
    console.log(e)
    var that = this
    request.http_get('/interface?action=orderdel', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      order_sn: e.currentTarget.dataset.order_sn
    }, (res) => {
      console.log(res)
      if (res.code == 1) {
        that.orderShow()
      }
    })
  },
  pendingPayment: function () { //代付款订单
    let that = this
    request.http_get('/interface?action=noPayOrder', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      page: 1
    }, (res) => {
      console.log(res)
      var orderDetailss = res.result
      that.setData({
        orderDetailss
      })
    })
  },
  paymentAmount: function (e) { //跳转到支付页面
    console.log(e.currentTarget.dataset.money)
    console.log(e.currentTarget.dataset.order_sn)
    wx.redirectTo({
      url: '/pages/payment/payment?money=' + e.currentTarget.dataset.money + '&order_sn=' + e.currentTarget.dataset.order_sn,
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
  commoditydetailsPage(e) { //点击跳详商品情页
    console.log(e)
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  orderdetailsPage(e){ //跳转到订单详情页
    console.log(e)
    wx.navigateTo({
      url: '/pages/orderdetails/orderdetails?order_sn=' + e.currentTarget.dataset.order_sn,
    })
  }
})