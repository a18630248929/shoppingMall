let request = require('../../utils/request.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceH: '',
    sz: 0, //商家分类id
    deviceH: '',
    cat_id: '', // 商家id,
    lists: [], //商品数据
    pageNum: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.desc
    })
    this.setData({
      sz: Number(options.cat_id) == 0 ? 0 : Number(options.index) + 1, //获取商家分类id
      cid: options.cid,
      cat_id: options.cat_id
    })
    this.classification()
    this.goodsdatas(options.cat_id)
    console.log(this.data.cat_id)
  },
  classification: function () { //获取分类列表
    var that = this
    console.log(that.data.sz)
    var sz = that.data.sz
    request.http_get('/interface?action=categoryList', {}, function (res) {
      console.log(res)
      var list = res.list.list
      list.unshift({
        name: "全部",
        cat_id: 0,
        p_id: 0
      })
      that.setData({
        list: res.list.list,
        twolist: list[sz].list,
        number: res.list.list.length,
        cat_id: res.list.list[sz].cat_id
      })
      console.log(that.data.list)
      console.log(that.data.twolist)
    })
  },
  goodsdatas(cat_id) { //获取京东网易百望数据 //京东51487网易51277时尚家52719
    console.log(cat_id)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=n_goodslist&pid=0&order=&appver=3.5.06&devicetype=android&platform=android&iversion=3506&dev=1&appType=1', {
      page: that.data.pageNum,
      uid: 240456984,
      id: cat_id,
      cid: that.data.cid,
    }, function (res) {
      console.log(res)
      that.setData({
        lists: res.list,
      })
      wx.hideLoading()
      console.log(that.data.lists)
    })
  },

  centralnavigation: function (e) { //点击切换
    console.log(e)
    var idx = e.currentTarget.dataset.idx;
    var cat_id = e.currentTarget.dataset.cat_id;
    var sz = this.data.sz
    this.setData({
      sz: idx,
      cat_id: cat_id
    })
    // console.log(this.data.cat_id)
    this.goodsdatas(this.data.cat_id)
    this.classification();
  },
  shoppingChang: function (e) { //滑动切换
    var list = this.data.list
    console.log(list[e.detail.current])
    console.log(e)
    this.setData({
      sz: e.detail.current,
      cat_id: list[e.detail.current].cat_id
    })
    this.goodsdatas(this.data.cat_id)
    this.classification()
  },
  getDeviceInfo: function () { //获取高宽
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeviceInfo()
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
    request.http_get('/interface?action=n_goodslist&pid=0&cid=1&id=422&page=1&order=&appver=3.5.06&devicetype=android&platform=android&iversion=3506&dev=1&appType=1', {
      page: page,
      uid: 240456984,
      id: that.data.cat_id,
      cid: that.data.cid,
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
  // classificationinterface() { //请求分类接口
  // let that = this
  // request.http_get('/interface?action=categoryList', {
  // uid: 240465834,
  // id: 52719
  // }, function (res) {
  // console.log('回调', res)
  // that.setData({
  // categoricalData: res.list.list
  // })
  // })
  // },
  category(e) {
    console.log(e)
    var xlist = e.currentTarget.dataset.arr.list.length
    console.log(xlist)
    if (xlist == 0) {
      wx.showToast({
        title: '暂无商品',
        icon: 'loading',
        duration: 1000
      })
    } else {
      var cid = this.data.cid
      wx.navigateTo({
        url: '/pages/category/category?cid=' + cid,
        success(res) {
          console.log(res)
          app.globalData.category = e.currentTarget.dataset.arr
        }
      })
    }
  },
  details(e) { //详情页面跳转
    // console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/details/details?id=" + id
    })
  },
  // 回到顶部
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },

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
        yin: falsedh
      })
    }
  },
})