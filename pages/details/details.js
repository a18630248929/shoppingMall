let request = require('../../utils/request.js')
let WxParse = require('../../wxParse/wxParse.js');
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailsSwiper: [], //轮播图
    detailsArr: [], //详情数据
    detailsSpec: [], //规格
    detailsNum: 1, //数量
    shoppingSwitch: false,
    detailsFlag: false,
    inDex: '0',
    inDex_a: '0',
    detailsxq: '',
    specs_goods: '', //规格
    specDataid: '', //规格id
    specDataid_a: '', //规格分类id
    specid: '', //规格id
    specid_a: '', //规格分类id
    cart_id: '', //获取cart_id请求立即购买用
    silverDelivery: 0, // 赠送银积分
    id: 0, // 商品ID
    iscollection: '', //收藏
    // isnavigation:'',//快速导航
    returnss: '' // css变量名
  },
  gm: function(e) { //立即购买
    this.submit('immediately')
  },
  shoppingSc: function() { //删除按钮
    this.setData({
      shoppingSwitch: false
    })
  },
  standard() {
    this.setData({
      shoppingSwitch: true
    })
  },
  shoppingCart: function() { //加入购物车
    this.submit('join');
    this.detailMap();
  },
  submit: function(e) {
    if (this.data.detailsSpec == '') { //判断没有详情时出现默认
      this.setData({
        detailsFlag: true,
        // inDex: '0'     
      })
    } //判断点击加入购物车第一次和第二次出现的效果
    if (!this.data.shoppingSwitch) {
      this.setData({
        shoppingSwitch: true
      })
      return true
    } else {
      if (wx.getStorageSync('userInfos') == '') {
        wx.navigateTo({
          url: '../login/jifenzhuce'
        });
      } else if (e == 'join') {
        var userInfo = wx.getStorageSync('userInfos')
        var that = this
        if (this.data.detailsSpec[1]) {
          console.log(this.data.detailsSpec)
          console.log('商品分类id', this.data.specDataid, '规格id', this.data.specDataid_a)
          if (this.data.specDataid && this.data.specDataid_a) { //如果选择有值就选有值的没有默认
            var specs_goods = `{"${this.data.specDataid}":"${this.data.specid}","${this.data.specDataid_a}":"${this.data.specid_a}"}`
            this.setData({
              specs_goods: specs_goods
            })
            console.log(this.data.specs_goods)
          } else if (this.data.specDataid) { //如果第一个有值第二个没有值就默认第二个的值
            let specDataid_a = this.data.detailsSpec[1].id
            let specid_a = this.data.detailsSpec[1].items[0].id
            let specs_goods = `{"${this.data.specDataid}":"${this.data.specid}","${specDataid_a}":"${specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          } else if (this.data.specDataid_a) { //如果第二个有值第一个没有值就默认第一个的值
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specs_goods = `{"${specDataid}" :"${specid}","${this.data.specDataid_a}":"${this.data.specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          } else { //如果都没有只则默认所有的值
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specDataid_a = this.data.detailsSpec[1].id
            let specid_a = this.data.detailsSpec[1].items[0].id
            let specs_goods = `{"${specDataid}" :"${specid}","${specDataid_a}":"${specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          }
        } else if (this.data.detailsSpec[0]) {
          if (this.data.specDataid) { //单规格商品有值选择值没值默认
            console.log(this.data.detailsSpec)
            console.log(this.data.specDataid)
            let specs_goods = `{"${this.data.specDataid}":"${this.data.specid}"}`
            this.setData({
              specs_goods: specs_goods
            })
            console.log(this.data.specs_goods)
          } else {
            console.log(this.data.detailsSpec)
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specs_goods = `{"${specDataid}":"${specid}"}`
            this.setData({
              specs_goods: specs_goods
            })
            console.log(this.data.specs_goods)
          }
        }
        // console.log(wx.getStorageSync('userInfos').uid)
        //  var obj = {}
        //   obj[""+ this.data.specDataid] = this.data.specid
        //   obj[""+ this.data.specDataid_a] = this.data.specid_a
        // console.log(obj)

        request.http_post('/cart?action=cartadd', {
          uid: userInfo.uid, //用户id
          quantity: this.data.detailsNum, //数量
          goods_id: this.data.detailsArr.goods_id, //商品id     
          specs_goods: this.data.specs_goods
        }, function(res) {
          console.log(res)
          if (res.code == 1) {
            wx.showLoading({
              title: '加入购物车成功'
            })
            setTimeout(function() {
              wx.hideLoading()
              // wx.reLaunch({
              //   url: '../shoppingcart/shoppingcart'
              // });
            }, 1000)
            that.setData({
              shoppingSwitch: false
            })
          } else {
            wx.showLoading({
              title: res.msg
            })
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
          }
        })
        console.log(this.data.detailsNum)
        console.log(wx.getStorageSync('userInfos'))
        console.log(this.data.detailsArr.goods_id)
      } else if (e == 'immediately') {
        if (this.data.detailsSpec[1]) {
          console.log(this.data.detailsSpec)
          console.log('商品分类id', this.data.specDataid, '规格id', this.data.specDataid_a)
          if (this.data.specDataid && this.data.specDataid_a) { //如果选择有值就选有值的没有默认
            var specs_goods = `{"${this.data.specDataid}":"${this.data.specid}","${this.data.specDataid_a}":"${this.data.specid_a}"}`
            this.setData({
              specs_goods: specs_goods
            })
            console.log(this.data.specs_goods)
          } else if (this.data.specDataid) { //如果第一个有值第二个没有值就默认第二个的值
            let specDataid_a = this.data.detailsSpec[1].id
            let specid_a = this.data.detailsSpec[1].items[0].id
            let specs_goods = `{"${this.data.specDataid}":"${this.data.specid}","${specDataid_a}":"${specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          } else if (this.data.specDataid_a) { //如果第二个有值第一个没有值就默认第一个的值
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specs_goods = `{"${specDataid}" :"${specid}","${this.data.specDataid_a}":"${this.data.specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          } else { //如果都没有只则默认所有的值
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specDataid_a = this.data.detailsSpec[1].id
            let specid_a = this.data.detailsSpec[1].items[0].id
            let specs_goods = `{"${specDataid}" :"${specid}","${specDataid_a}":"${specid_a}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          }
        } else if (this.data.detailsSpec[0]) {
          if (this.data.specDataid) { //单规格商品有值选择值没值默认
            console.log(this.data.detailsSpec)
            console.log(this.data.specDataid)
            let specs_goods = `{"${this.data.specDataid}":"${this.data.specid}"}`
            this.setData({
              specs_goods: specs_goods
            })
            console.log(this.data.specs_goods)
          } else {
            let specDataid = this.data.detailsSpec[0].id
            let specid = this.data.detailsSpec[0].items[0].id
            let specs_goods = `{"${specDataid}":"${specid}"}`
            this.setData({
              specs_goods
            })
            console.log(this.data.specs_goods)
          }
        }

        var that = this
        request.http_get('/cart?action=cartaddtmp', {
          goods_id: this.data.detailsArr.goods_id,
          quantity: this.data.detailsNum,
          specs_goods: this.data.specs_goods,
          uid: wx.getStorageSync('userInfos').uid,
        }, function(res) {
          console.log(res)
          that.setData({
            cart_id: res.cart_id
          })
          if (res.code == 1) {
            wx.navigateTo({
              url: '../orderPage/order',
              success: function(e) {
                console.log(e)
                app.globalData.cart_id = that.data.cart_id // 存储购物车选择ID
                app.globalData.direct = 1 //跳转确认订单页存储direct  1立即购买  0购物车购买
              }
            });
          } else {
            wx.showLoading({
              title: res.msg
            })
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
            that.setData({
              shoppingSwitch: false
            })
          }
        })
      }
    }
  },
  shoppingJia: function() { //加数量
    // console.log(this.data.detailsArr.goodsNowStock)
    if (this.data.detailsNum >= this.data.detailsArr.goodsNowStock) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 2000)
      this.setData({
        detailsNum: this.data.detailsNum - 1
      })
    }
    this.setData({
      detailsNum: this.data.detailsNum + 1
    })
    console.log(this.data.detailsNum)
  },
  shoppingJian: function() { //减数量
    if (this.data.detailsNum > 1) {
      this.setData({
        detailsNum: this.data.detailsNum - 1
      })
    }
  },
  Specifications: function(e) { //商品规格
    console.log(e)
    // var obj = {}
    // obj[""+ dataid] = id
    // obj[""+ 1] = 2
    this.setData({
      title1: e.currentTarget.dataset.title, //规格名称
      inDex: e.currentTarget.dataset.index, //下标
      specDataid: e.currentTarget.dataset.dataid, //规格id
      specid: e.currentTarget.dataset.id, //规格分类id
      spec_1Attr: e.currentTarget.dataset.title
    })
    var title1 = this.data.title1
    var title2 = this.data.title2
    var zuInfo = this.data.zuInfo
    for (var i = 0; i < this.data.zuInfo.length; i++) {
      var spec_1Attr = this.data.zuInfo[i].spec_1Attr
      var spec_2Attr = this.data.zuInfo[i].spec_2Attr
      // console.log(spec_2Attr)


      if (title1 == spec_1Attr && spec_2Attr == title2) {
        this.setData({
          goodsNowStock: this.data.zuInfo[i].goodsNowStock,
          spec_1Attr: this.data.zuInfo[i].spec_1Attr,
          spec_2Attr: this.data.zuInfo[i].spec_2Attr,
          Price: this.data.zuInfo[i].Price,
        })
      }
    }
    this.detailMap()
  },
  Attribute: function(e) { //商品颜色
    console.log(e)
    this.setData({
      title2: e.currentTarget.dataset.title, //规格名称
      inDex_a: e.currentTarget.dataset.index,
      specDataid_a: e.currentTarget.dataset.dataid, //规格id
      specid_a: e.currentTarget.dataset.id, //规格分类id
      spec_2Attr: e.currentTarget.dataset.title
    })
    var title1 = this.data.title1
    var title2 = this.data.title2
    var zuInfo = this.data.zuInfo
    for (var i = 0; i < this.data.zuInfo.length; i++) {
      var spec_1Attr = this.data.zuInfo[i].spec_1Attr
      var spec_2Attr = this.data.zuInfo[i].spec_2Attr
      // console.log(spec_2Attr)
      if (title1 == spec_1Attr && spec_2Attr == title2) {
        this.setData({
          goodsNowStock: this.data.zuInfo[i].goodsNowStock,
          spec_1Attr: this.data.zuInfo[i].spec_1Attr,
          spec_2Attr: this.data.zuInfo[i].spec_2Attr,
          Price: this.data.zuInfo[i].Price,
        })
      }
    }
  },
  // onUnload: function () {
  //   wx.reLaunch({
  //     url: '/pages/personal/personal'
  //   })
  // },
  onLoad: function(res) {
    console.log(res)
    wx.setStorageSync('uid', res.uid)
    if (res.uid) {
      wx.reLaunch({
        url: '/pages/login/jifenzhuce'
      });
    }
    var that = this
    that.setData({
      id: res.id
    })
    // var id = res.id
    console.log(that.data.id)
    this.comment(that.data.id) //评论
    request.http_get('/interface?action=goodsdetail', {
      id: that.data.id,
      uid: wx.getStorageSync('userInfos').uid
    }, function(res) {
      console.log(res)
      if (res.zuInfo.length == 0) {
        var spec_1Attr = "默认"
        var spec_2Attr = ''
        var goodsNowStock = res.goods.goodsNowStock
        var Price = res.goods.Price
      } else {
        var spec_1Attr = res.zuInfo[0].spec_1Attr
        var spec_2Attr = res.zuInfo[0].spec_2Attr
        var goodsNowStock = res.zuInfo[0].goodsNowStock
        var Price = res.zuInfo[0].Price
      }

      console.log(res.is_collection)
      if (res.is_collection == 0) { //判断是否收藏
        that.setData({
          iscollection: false
        })
      } else {
        that.setData({
          iscollection: true
        })
      }
      that.setData({
        detailsSwiper: res.goods.img, //轮播图
        detailsArr: res.goods, //商品详情
        detailsSpec: res.specs, //商品规格
        detailsxq: res.goods.description,
        commentLists: res.commentLists, //评论
        wlPrice: res.goods.wlPrice, // 运费
        monthlysale: res.goods.sale, //月售
        seller: res.seller,
        silverDelivery: res.goods.silver_integral.toFixed(2), //赠送因积分
        zuInfo: res.zuInfo, //规格
        goodsNowStock: goodsNowStock, //库存
        Price: Price, //价格
        spec_1Attr: spec_1Attr, //规格1
        spec_2Attr: spec_2Attr, //规格2
        gt_user: res.gt_user, // 用户id
        goods_id: res.goods.goods_id, //商品id
        is_collection: res.is_collection //收藏id
      })
      console.log(that.data.spec_1Attr)
      // console.log(that.data.detailsxq)
      var article = that.data.detailsxq
      var article = article.replace(/<img/g, '<img class="div_class"') //把回去的img解析
      WxParse.wxParse('article', 'html', article, that, 5)
      // console.log(that.data.detailsxq)
      wx.hideLoading()
      that.detailMap()
    })
  },

  onReady: function() {

  },
  detailimg: function(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  },


  comment(id) {
    console.log(id)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    request.http_get('/interface?action=goodComment', {
      g_id: id
    }, function(res) {
      console.log(res)
      that.setData({
        comment: res.data,
      })
      wx.hideLoading()
      // console.log(that.data.list)
    })
  },
  commentmory() {
    var id = this.data.id
    wx.navigateTo({
      url: '../comment/comment?id=' + id
    })
  },
  detailMap() { //规格详情图
    console.log(this.data.detailsSpec)
    // console.log(this.data.specDataid)
    // console.log(this.data.specDataid_a)
    // console.log(this.data.specid)
    // console.log(this.data.specid_a)
    if (this.data.detailsSpec) {
      if (this.data.detailsSpec[1]) {
        let specDataid = this.data.specDataid != '' ? this.data.specDataid : this.data.detailsSpec[0].id //规格一
        let specid = this.data.specid != '' ? this.data.specid : this.data.detailsSpec[0].items[0].id //规格一
        let specDataid_a = this.data.specDataid_a != '' ? this.data.specDataid_a : this.data.detailsSpec[1].id //规格二
        let specid_a = this.data.specid_a != '' ? this.data.specid_a : this.data.detailsSpec[1].items[0].id //规格一
        console.log(specDataid, specid, '---', specDataid_a, specid_a)
        var color = `{"${specDataid}":"${specid}","${specDataid_a}":"${specid_a}","goods_id":"${this.data.id}"}`
        console.log(color)
        var that = this
        request.http_get('/interface?action=goodsoption', {
          str: color
        }, function(res) {
          console.log(res)
          that.setData({
            detailMap: res.option[0].thumb,
            goodsNowStock: res.option[0].stock,
            Price: res.option[0].productprice,
          })
        })
      } else if (this.data.detailsSpec[0]) {
        let specDataid = this.data.specDataid != '' ? this.data.specDataid : this.data.detailsSpec[0].id //规格一
        let specid = this.data.specid != '' ? this.data.specid : this.data.detailsSpec[0].items[0].id //规格一
        var color = `{"${specDataid}":"${specid}","goods_id":"${this.data.id}"}`
        var that = this
        request.http_get('/interface?action=goodsoption', {
          str: color
        }, function(res) {
          console.log(res)
          that.setData({
            detailMap: res.option[0].thumb,
            goodsNowStock: res.option[0].stock,
            Price: res.option[0].productprice,
          })
        })
      }
    }
  },
  onHide: function() {
    console.log('页面卸载')
    this.setData({
      shoppingSwitch: false
    })
  },
  onShow: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    console.log(this.data.id)
    console.log(wx.getStorageSync('userInfos').uid)
    var uid = wx.getStorageSync('userInfos').uid
    return {
      title: '发现个好东东推荐给你',
      // path: "/pages/details/details?uid=" + uid + '&id=' + this.data.id,
      path: "/pages/login/jifenzhuce?uid=" + uid,
      success: function(res) {
        console.log(res)
      }
    }
  },

  collection(e) { //收藏功能
    console.log(wx.getStorageSync('userInfos').uid)
    if (wx.getStorageSync('userInfos').uid == undefined) {
      wx.navigateTo({
        url: '/pages/login/jifenzhuce'
      })
    }
    var that = this
    console.log(that.data.is_collection)
    var id = that.data.id
    var iscollection = !that.data.iscollection
    that.setData({
      iscollection
    })
    console.log(that.data.goods_id)
    if (iscollection) {
      console.log("----------")
      request.http_get('/interface?action=addCollection', {
        id: '',
        uid: wx.getStorageSync('userInfos').uid, //用户id
        type: 1, //2是店铺
        goods_id: that.data.goods_id //商品id
      }, function(res) {
        console.log(res)
        wx.showToast({
          title: res.msg,
          duration: 1000
        })
      })
    } else {
      console.log(".............")
      request.http_get('/interface?action=addCollection', {
        id: that.data.is_collection,
        uid: wx.getStorageSync('userInfos').uid, //用户id
        type: 1, //2是店铺
        goods_id: that.data.goods_id //商品id
      }, function(res) {
        console.log(res)
        wx.showToast({
          title: res.msg,
          duration: 1000
        })
      })
    }
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