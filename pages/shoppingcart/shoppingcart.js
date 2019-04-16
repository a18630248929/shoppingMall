// pages/shopcart/shopcart.js
let request = require('../../utils/request.js')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscart: false, //控制购物车有没有数据
    checkAll: false,
    checked: false,
    totalCount: 0,
    totalPrice: '0.00',
    goodList: '',
    sid: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.addressList()
    this.notLoggedin()
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
    this.onLoad()
    this.setData({
      checkAll: false,
      totalCount: 0,
      totalPrice: '0.00'
    })
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

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    // console.log(e)
    request.http_post('/cart?action=cartdel', {
      cart_id: e.currentTarget.dataset.cartid,
      uid: wx.getStorageSync('userInfos').uid
    }, (res) => {
      // console.log(res)
      this.onLoad()
      this.setData({
        totalCount: 0,
        totalPrice: '0.00',
        checkAll: false,
      })
    })
  },
  /**
   * 计算商品总数
   */
  calculateTotal: function () {
    let goodList = this.data.goodList; // 获取购物车列表
    let total = 0;
    for (var itemArr of goodList) {
      for (var item of itemArr) {
        if (item.flag) { // 判断选中才会计算价格
          total += item.quantity // 所有数量加起来
        }
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      goodList: goodList,
      totalCount: total
    });
    // console.log(this.data.totalCount)
  },
  // // 计算商品总价
  totalPrice: function () {
    let goodList = this.data.goodList; // 获取购物车列表
    let total = 0;
    for (var itemArr of goodList) { //两个循环为了拿到数据  数据结构是 [[{}]]
      for (var item of itemArr) {
        if (item.flag) { // 判断选中才会计算价格
          total += item.quantity * item.product_info.Price; // 所有数量加起来
        }
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      goodList: goodList,
      totalPrice: total.toFixed(2)
    });
  },
  /**
   * 用户点击商品减1
   */
  subtracttap: function (e) {
    // console.log(e)
    let dataArr = e.currentTarget.dataset.data; //加号获取当前商品信息
    if (dataArr.quantity > 1) {
      request.http_post('/cart?action=cartedit', { //  数量加减接口
        uid: wx.getStorageSync('userInfos').uid,
        quantity: dataArr.quantity - 1,
        goods_id: dataArr.goods_id,
        specs_goods: '',
        bindGoodsID: dataArr.bindGoodsID,
        cart_id: dataArr.cart_id
      }, (res) => {
        // console.log(res)
        var that = this
        let goodList = this.data.goodList
        for (var itemArr of goodList) {
          for (var item of itemArr) {
            // console.log(item)
            if (dataArr.cart_id == item.cart_id) {
              item.quantity = dataArr.quantity - 1
            }
          }
        }
        that.setData({
          goodList: goodList
        })
        this.totalPrice()
        this.calculateTotal()
      })
    }
  },
  /**
   * 用户点击商品加1
   */
  addtap: function (e) {
    // console.log(e)
    let dataArr = e.currentTarget.dataset.data; //加号获取当前商品信息
    request.http_post('/cart?action=cartedit', { //  数量加减接口
      uid: wx.getStorageSync('userInfos').uid,
      quantity: dataArr.quantity + 1,
      goods_id: dataArr.goods_id,
      specs_goods: '',
      bindGoodsID: dataArr.bindGoodsID,
      cart_id: dataArr.cart_id
    }, (res) => {
      // console.log(res)
      var that = this
      let goodList = this.data.goodList
      for (var itemArr of goodList) {
        for (var item of itemArr) {
          // console.log(item)
          if (dataArr.cart_id == item.cart_id) {
            item.quantity = dataArr.quantity + 1
          }
        }
      }
      that.setData({
        goodList: goodList
      })
      this.totalPrice()
      this.calculateTotal()
    })

  },
  textBox: function (e) { //文本框输入数量
    // console.log(e)
    let dataArr = e.currentTarget.dataset.data; //加号获取当前商品信息
    let dataName = e.detail.value; //加号获取当前商品
    request.http_post('/cart?action=cartedit', { //  数量加减接口
      uid: wx.getStorageSync('userInfos').uid,
      quantity: dataName,
      goods_id: dataArr.goods_id,
      specs_goods: '',
      bindGoodsID: dataArr.bindGoodsID,
      cart_id: dataArr.cart_id
    }, (res) => {
      // console.log(res)
      var that = this
      let goodList = this.data.goodList
      for (var itemArr of goodList) {
        for (var item of itemArr) {
          // console.log(item)
          if (dataArr.cart_id == item.cart_id) {
            item.quantity = Number(dataName)
          }
        }
      }
      that.setData({
        goodList: goodList
      })
      this.totalPrice()
      this.calculateTotal()
    })
  },
  /**
   * 用户选择购物车商品
   */
  checkboxChange: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.data; // 获取data- 传进来的index
    let goodList = this.data.goodList; // 获取购物车列表
    index.flag = !index.flag
    var checkAll = false
    var kai = []
    var he = []
    for (let item of goodList) {
      for (let i of item) {
        he.push(i)
        if (i.cart_id == index.cart_id) {
          i.flag = index.flag
        }
        if (i.flag == true) {
          kai.push(i)
        }
      }
    }
    if (kai.length == he.length) {
      checkAll = true
    }
    this.setData({
      goodList,
      checkAll: checkAll
    })
    // console.log(this.data.goodList)
    this.totalPrice()
    this.calculateTotal()
  },
  /**
   * 用户点击全选
   */
  selectalltap: function (e) {
    // console.log(e)
    let checkAll = this.data.checkAll; // 是否全选状态
    checkAll = !checkAll;
    let goodList = this.data.goodList;
    for (var itemArr of goodList) {
      for (var item of itemArr) {
        item.flag = checkAll
      }
    }
    this.setData({
      checkAll: checkAll,
      goodList: goodList
    });
    this.totalPrice()
    this.calculateTotal()
  },
  settlement: function () { //点击结算
    var that = this;
    var goodList_a = [];
    var goodList = this.data.goodList;
    // console.log(user)
    for (var itemArr of goodList) {
      for (var item of itemArr) {
        if (item.flag == true) {
          goodList_a.push(item.cart_id) //获取选中的项
          // console.log(goodList_a.join('_'))
        }
      }
    }
    // for (let i = 0; i < goodList.length; i++) {
    //   if (goodList[i].flag == true) {
    //     goodList_a.push(goodList[i].cart_id) //获取选中的项
    //     // console.log(goodList_a.join('_'))
    //   }
    // }
    // 未选中商品不能跳转
    if (goodList_a.length == 0) {
      wx.showLoading({
        title: '请勾选商品',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
      let goodList = goodList_a.join('_')
      wx.navigateTo({
        url: '../orderPage/order',
        success: function (e) {
          // console.log(e)
          app.globalData.cart_id = goodList // 存储购物车选择ID
          app.globalData.direct = 0 //跳转确认订单页存储direct  1立即购买  0购物车购买
        }
      });
    }
  },
  // addressList: function() { //地址列表请求 获取地址id
  //   request.http_post('/interface?action=address', {//  数量加减接口
  //     uid: wx.getStorageSync('userInfos').uid,
  //     ticket: wx.getStorageSync('userInfos').ticket
  //   }, (res) => {
  //     console.log(res)
  //     var list = res.list
  //     for (var i in list) {
  //       // console.log(list[i])
  //       if (list[i].is_on == 1) {
  //         this.setData({
  //           sid: list[i].id
  //         })
  //       }
  //     }
  //   })
  // },
  shoppingcartApp() { //获取购物车列表
    let that = this
    let userInfo = wx.getStorageSync('userInfos');
    if (userInfo) {
      request.http_get('/cart?action=ylmgmycart_old', {
        uid: userInfo.uid,
        ticket: wx.getStorageSync('userInfos').ticket
      }, function (res) {
        // console.log(res)
        if (res.list == null) {
          that.setData({
            iscart: true
          })
        } else {
          that.setData({
            iscart: false
          })
          var goodList = res.list.list
          // // var flag = that.data.flga
          for (var itemArr of goodList) {
            for (var item of itemArr) {
              item.flag = false
            }
          }
          that.setData({
            goodList: goodList
          })
          // console.log(that.data.goodList)
        }
      })
    } else {
      wx.redirectTo({
        url: "/pages/login/jifenzhuce",
      })
    }
  },
  detailsgwc(e) { //跳转情页
    // console.log(e)
    var use_obj = e.currentTarget.dataset.goods_id
    // console.log(use_obj)
    wx.navigateTo({
      url: '/pages/details/details?id=' + use_obj
    })
  },
  notLoggedin: function () { //判断购物车页面是否登录
    var that = this
    request.http_get('/interface?action=myself', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      iversion: '',
      devicetype: ''
    }, (res) => {
      console.log(res)
      if (res.code == 1) {
        this.shoppingcartApp()
      } else {
        wx.redirectTo({
          url: '/pages/login/jifenzhuce',
        })
      }
    })
  },
})