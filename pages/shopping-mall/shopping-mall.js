let app = getApp()
let request = require('../../utils/request.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Navigation: [{
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b30f96e2cc',
      descs: '京东优选',
      bannerimage: "http://p4.baiwangkeji.com/comment0gow_5c89f0807aaaa?imageMogr2/quality/80/format/jpg"
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b3111db41c',
      descs: '网易严选',
      bannerimage: "http://p1.baiwangkeji.com/pic0gow_5c8a0bb1ddb6c"
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b3123c8967',
      descs: '百望自营',
      bannerimage: "http://p1.baiwangkeji.com/pic0gow_5c88c4aa6507b"
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b31481de0b',
      descs: '买一送一',
      bannerimage: "http://p1.baiwangkeji.com/pic0gow_5bda75ea2f92e",
      sid: 519
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b319caef6d',
      descs: 'TCL专场',
      bannerimage: "",
      sid: '' //TCL是不同的接口 所以单独拿出
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b316868e44',
      descs: '拼团',
      sid: '',
      bannerimage: ""
    },
    {

      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b318593be9',
      descs: '特价美食',
      sid: '555',
      bannerimage: ""
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b319caef6d',
      descs: '特价抢购',
      bannerimage: "",
      sid: 549
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b31b58dbf2',
      descs: '9.9专区',
      bannerimage: "",
      sid: 552
    },
    {
      imgUrls: 'http://p1.baiwangkeji.com/pic0gow_5c8b31c8a728b',
      descs: '时装服饰',
      bannerimage: "",
      sid: 554
    }
    ],
    list: [], //商品列表
    pageNum: 1, //页数
    cid: 3, // 商城id
    deviceH: '',
    currtab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log(res, '分享过来的')
    wx.setStorageSync('uid', res.uid)
    this.count_down(); //秒杀倒计时
    this.datass(); //获取推荐首页面展示信息
    this.datas(); //获取京东网易百望数据 
    this.spike(); //秒杀商品数据
  },

  spike() { //获取秒杀商品数据（时尚家）  //京东51487网易51277时尚家52719
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=nsubject', {
      sid: 548
    }, function (res) {
      console.log('秒杀', res)
      that.setData({
        robbuy: res.list,
      })
      wx.hideLoading()
      console.log(that.data.list)
    })
  },

  datas() { //获取首页爆款推荐商品
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=home_newbktj&sort_name=zh&sort_type=desc&appver=3.5.04&devicetype=android&platform=android&iversion=3504&dev=1&appType=1', {
      cid: that.data.cid,
      page: that.data.pageNum
    }, function (res) {
      console.log(res)
      that.setData({
        list: res.list,
      })
      wx.hideLoading()
      console.log(that.data.list)
    })
  },

  datass() { //获取推荐首页面展示信息
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=home&userLat=0.0&userLng=0.0&uid=240456983&ticket=9c9e73173ebb683415d5870f99aa478f&appver=2.0.00&devicetype=android&platform=android&iversion=2000&dev=1&appType=1', {
      cid: that.data.cid,
      page: that.data.pageNum
    }, function (res) {
      console.log(res, "推荐首页面展示信息")
      that.setData({
        home: res.home
      })
      wx.hideLoading()
    })
  },

  spike() { //获取秒杀商品数据（时尚家）  //京东51487网易51277时尚家52719
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=nsubject', {
      sid: 548
    }, function (res) {
      console.log('秒杀', res)
      that.setData({
        robbuy: res.list,
      })
      wx.hideLoading()
      console.log(that.data.list)
    })
  },


  changegoodsname: function (e) { //中部导航跳转的专题页面
    console.log(e)
    var descs = e.currentTarget.dataset.descs
    var index = e.currentTarget.dataset.index
    var sid = e.currentTarget.dataset.sid
    var image = e.currentTarget.dataset.banner
    console.log(index)
    console.log(image)
    if (index == 0) { // 中部导航跳转链接
      wx.navigateTo({
        url: '/pages/jd/jd?image=' + image,
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '/pages/wyyx/wyyx?image=' + image,
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: '/pages/baiwang/baiwang?image=' + image,
      })
    } else if (index == 5) {
      wx.navigateTo({
        url: '/order/pages/page10000/page10000'
      })
    }
    // else if (index == 6) {
    //   wx.navigateTo({
    //     url: '/openPlugin/18Fz4z4D/pages/index/index'
    //   })
    // } 
    else {
      wx.navigateTo({
        url: '/pages/special/special?descs=' + descs + '&index=' + index + '&sid=' + sid + '&image=' + image,
      })
    }
  },

  special(e) { //《活动：春季购物节 专题页面》
    console.log(e)
    var idx = e.currentTarget.dataset.idx
    switch (idx) {
      case 1:
        var sid = 550
        var descs = '网易严选'
        var image = "http://p1.baiwangkeji.com/pic0gow_5c8b3c8dd0a8b"
        break
      case 2:
        var sid = 549
        var descs = '京东优选'
        var image = "http://p1.baiwangkeji.com/pic0gow_5af24ae5d58e8"
        break
      case 3:
        var sid = 551
        var descs = '百望好物'
        var image = "http://p1.baiwangkeji.com/pic0gow_5c88c4aa6507b"
        break
    }
    wx.navigateTo({
      url: '/pages/special/special?descs=' + descs + '&sid=' + sid + '&image=' + image,
    })
  },
  jqqd() {
    wx.showToast({
      title: '即将开放',
      icon: 'loading',
      duration: 1000
    })
  },

  banner(e) { //轮播图专题页面
    console.log(e)
    var sid = e.currentTarget.dataset.sid
    var descs = e.currentTarget.dataset.descs
    var image = e.currentTarget.dataset.image
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/special/special?descs=' + descs + '&sid=' + sid + '&image=' + image,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeviceInfo()
  },

  ranking: function () { // 点击获取价格排行榜
    var list = this.data.list
    list.sort(this.compare("plus_Price")); // .sort自动获取内部数据
    this.setData({
      list
    })
  },
  compare: function (property) { // 排序方法处理
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  scroll: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var page = this.data.pageNum + 1
    request.http_get('/interface?action=home_newbktj&sort_name=zh&sort_type=desc&appver=3.5.04&devicetype=android&platform=android&iversion=3504&dev=1&appType=1', {
      page: page
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
        var list = that.data.list
        console.log(list)
        for (var i = 0; i < res.list.length; i++) {
          list.push(res.list[i])
        }
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
  onShareAppMessage: function () {
    let uid = wx.getStorageSync('userInfos').uid
    console.log(uid, '分享出去的ID')
    return {
      // title: '发现个好东东推荐给你',
      path: "/pages/login/jifenzhuce?uid=" + uid,
      success: function (res) {
        console.log(res)
      }
    }
  },
  getDeviceInfo: function () { //获取高宽
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  shoppingChang(e) { //滑动切换
    this.setData({
      currtab: e.detail.current
    })
    this.orderShow()
  },
  orderShow() { //切换数据
    switch (this.data.currtab) { //京东51487网易51277时尚家52719
      case 1:
        this.setData({
          cid: 1, //京东
          businessid: 51487
        });
        this.datas()
        break;
      case 2:
        this.setData({
          cid: 2, //网易
          businessid: 51277
        });
        this.datas()
        break;
      case 3:
        this.setData({
          cid: 3, //百望
          businessid: 52719
        });
        this.datas()
        break;
    }
  },


  robbuy: function () { //秒杀专区
    wx.navigateTo({
      url: '../robbuy/robbuy'
    })
  },

  count_down: function () { //秒杀倒计时
    var interval = setInterval(function () {
      var countDown = new Date().setHours(0, 0, 0, 0) / 1000 + 24 * 60 * 60;
      var time = (countDown - Date.parse(new Date()) / 1000);
      var hour = Math.floor(time / 3600);
      if (hour < 10) {
        hour = '0' + hour;
      }
      var minute = Math.floor((time - hour * 3600) / 60);
      if (minute < 10) {
        minute = '0' + minute;
      }
      var second = Math.floor((time - hour * 3600 - minute * 60));
      if (second < 10) {
        second = '0' + second;
      }
      this.setData({
        hour: hour,
        minute: minute,
        second: second,
      });
    }.bind(this), 1000);
  },

  details: function (e) { //商品详情页面跳转
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
  },
  centralnavigation: function () { //中部导航跳转地址
    var cid = this.data.cid
    var descs = this.data.Navigation.descs
    wx.navigateTo({
      url: '../centralnavigation/centralnavigation?cid=' + cid,
    })

  },
  coilcenter: function () { //优惠券页面
    wx.navigateTo({
      url: '/pages/coilcenter/coilcenter'
    })
  },
  search: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  msdetails(e) { //秒杀跳转详情页
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
  },

  // 回到顶部
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  // refresh: function(event) { //滚动下拉刷新
  //   this.spike();
  // },

  scrollTopy(e) { //检测滚动距离
    // console.log(e)
    var scrollTop = e.detail.scrollTop
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
  },

  bwqc() { //百望汽车
    wx.navigateTo({
      url: '/pages/bwqc/bwqc'
    })
  },
  ksnavigation() { //快速导航
    var isnavigation = !this.data.isnavigation
    this.setData({
      isnavigation,
      returnss: 'returns', //css类名
      kai: false
    })
  },
  isnavigationyc() { //点击空白处隐藏快速导航
    this.setData({
      isnavigation: false,
      kai: false
    })
  },
  click() {
    if (wx.getStorageSync('userInfos')) {
      this.setData({
        kai: true
      })
    } else {
      wx.showModal({
        title: '暂未登录转发无法锁粉',
        confirmText: '去登陆',
        cancelText: '取消',
        confirmColor: '#c81e27',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.reLaunch({
              url: '/pages/login/jifenzhuce',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})