let app = getApp()
let request = require('../../utils/request.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [], //商品列表
    pageNum: 1, //页数
    deviceH: '',
    jdnavigation: [{
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03dfd4d20b",
      title: "食品",
      cat_id: 376,
      index: 0
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03e139f7df",
      title: "生鲜",
      cat_id: 1369,
      index: 4
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03e2810dde",
      title: "冲饮",
      cat_id: 1338,
      index: 1
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03e3c980e0",
      title: "家电",
      cat_id: 392,
      index: 2
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03e5b93199",
      title: "服饰",
      cat_id: 324,
      index: 5
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae2d85d75a0b",
      title: "家居",
      cat_id: 422,
      index: 3
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03f1031b29",
      title: "鞋包",
      cat_id: 447,
      index: 6
    },
    {
      image: "http://p1.baiwangkeji.com/pic0gow_5ae03f241f370",
      title: "全部",
      cat_id: 0,
      index: 7
    }
    ],

    curren: 0,
    variable: false,
    sort: [{
      sort_name: "综合",
      index: 0
    }, {
      sort_name: "人气",
      index: 1
    }, {
      sort_name: "销量",
      index: 2
    }, {
      sort_name: "价格",
      index: 3
    },],
    sort_name: "zh",
    sort_type: "desc"
  },

  sort(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      curren: index
    })
    switch (index) {
      case 0:
        this.setData({
          sort_name: "zh",
          sort_type: 'desc'
        })
        this.datas()
        break
      case 1:
        this.setData({
          sort_name: "rq",
          sort_type: 'desc'
        })
        this.datas()
        break
      case 2:
        this.setData({
          sort_name: "xl",
          sort_type: 'desc'
        })
        this.datas()
        break
      case 3:
        if (this.data.variable == false) {
          this.setData({
            sort_name: "jg",
            sort_type: 'asc',
            variable: true
          })
          this.datas()
          break
        } else {
          this.setData({
            sort_name: "jg",
            sort_type: 'desc',
            variable: false
          })
          this.datas()
          break
        }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    wx.setStorageSync('uid', e.uid)
    this.setData({
      banner: e.image
    })
    this.datas(); //获取京东数据
    // this.classification()  //获取分类列表
  },

  datas() { //获取网易数据
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    console.log(that.data.sort_name)
    request.http_get('/interface?action=second_tag&appver=3.5.04&devicetype=android&platform=android&iversion=3504&dev=1&appType=1', {
      cid: 3,
      page: that.data.pageNum,
      sort_name: that.data.sort_name,
      sort_type: that.data.sort_type
    }, function (res) {
      console.log(res)
      that.setData({
        lists: res.list,
      })
      wx.hideLoading()
      // console.log(that.data.lists)
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeviceInfo()
  },

  ranking: function () { // 点击获取价格排行榜
    var lists = this.data.lists
    lists.sort(this.compare("plus_Price")); // .sort自动获取内部数据
    this.setData({
      lists
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
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var page = this.data.pageNum + 1
    request.http_get('/interface?action=second_tag&sort_name=zh&sort_type=desc&appver=3.5.04&devicetype=android&platform=android&iversion=3504&dev=1&appType=1', {
      cid: 3,
      page: that.data.pageNum
    }, function (res) {
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
        var lists = that.data.lists
        console.log(lists)
        for (var i = 0; i < res.list.length; i++) {
          lists.push(res.list[i])
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


  details: function (e) { //商品详情页面跳转
    console.log(e)
    var id = e.currentTarget.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
  },
  centralnavigation: function (e) { //中部导航跳转地址
    // console.log(e)
    var index = e.currentTarget.dataset.index
    var cat_id = e.currentTarget.dataset.cat_id
    var desc = '百望自营'
    console.log(cat_id)
    var cid = '3'
    wx.navigateTo({
      url: '../centralnavigation/centralnavigation?index=' + index + '&cat_id=' + cat_id + '&cid=' + cid + '&desc=' + desc,
    })
  },


  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) { //页面距离大于100px,则显示回到顶部控件
      this.setData({
        cangotop: true
      });
    } else {
      this.setData({
        cangotop: false
      });
    }
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