let request = require('../../utils/request.js')
let app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    integral: '',
    "order": [{
      "image": "/pages/image/fk.png",
      "title": "待付款",
      "index": 1
    },
    {
      "image": "/pages/image/sh.png",
      "title": "待发货",
      "index": 2
    },
    {
      "image": "/pages/image/fh.png",
      "title": "待收货",
      "index": 3
    },
    {
      "image": "/pages/image/pingl.png",
      "title": "待评价",
      "index": 4
    },
    {
      "image": "/pages/image/shouh.png",
      "title": "退款/售后",
      "index": 5
    },
    ],
    "personal": [
      {
        "image": "/pages/image/ewm.png",
        "title": "我要推广",
        "url": "/pages/extension/extension"
      },
      {
        "image": "/pages/image/yhq.png",
        "title": "我的优惠券",
        "url": "/pages/coupon/coupon"
      },
      {
        "image": "/pages/image/scsc.png",
        "title": "收藏",
        "url": "/pages/collection/collection"
      },
      {
        "image": "/pages/image/dingd.png",
        "title": "订单",
        "url": "/pages/order/order",
        "index": 0
      },
      {
        "image": "/pages/image/pintuan.png",
        "title": "我的拼团",
        "url": "/order/pages/userCenterComponentPage/userCenterComponentPage"
      },
      // {
      //   "image": "/pages/image/kanjia.png",
      //   "title": "砍价",
      //   "url": "/openPlugin/18Fz4z4D/pages/order/order"
      // },
      {
        "image": "/pages/image/xkf.png",
        "title": "客服电话",
        "url": ""
      },
    ]
  },
  order: function (e) {//点击跳转订单详情
    console.log(e)
    var that = this
    wx.navigateTo({
      url: '/pages/order/order',
      success: function (res) {
        app.globalData.currtab = e.currentTarget.dataset.index //存储点击代付款等下标
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfos')
    })
    this.integral()
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onShow: function () {
    wx.hideShareMenu()//隐藏转发按钮
    // console.log(this.data.userInfo)
    if (!wx.getStorageSync('userInfos')) {
      wx.reLaunch({
        url: "/pages/login/jifenzhuce",
      })
    }
  },
  navigateJump: function (res) {
    console.log(res)
    var idx = res.currentTarget.dataset.idx
    if (idx == 5) {
      wx.makePhoneCall({
        phoneNumber: '4000832888' //仅为示例，并非真实的电话号码
      })
    }
    var url = res.currentTarget.dataset.url
    app.globalData.currtab = res.currentTarget.dataset.index //点击进入订单是让下标为0
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  integral: function () { //获取积分
    var that = this
    request.http_get('/interface?action=myself', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      iversion: '',
      devicetype: ''
    }, (res) => {
      console.log(res)
      if (res.code == 1) {
        that.setData({
          integral: res.user
        })
      } else {
        wx.redirectTo({
          url: '/pages/login/jifenzhuce',
        })
      }

    })
  },
  logout() {//退出登录
    wx.removeStorage({
      key: 'userInfos',
      success(res) {
        console.log(res)
        wx.switchTab({
          url: '/pages/shopping-mall/shopping-mall',
        })
      }
    })
  }
})