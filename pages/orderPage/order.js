// pages/orderPage/order.js
let app = getApp();
let request = require('../../utils/request.js')
let Pingpp = require('../../utils/pingpp.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    orderpage: '',
    orderpageTotalprice: 0, //总价
    modalFrame: false, //模态框
    methodPayment: '',
    radioNumber: 'wx',
    checked: true,
    switchChangefalg: true, //积分使用开关
    remarksArr: [], //备注拼接
    couponSwitch: false,
    subscript: 1,
    shopID: "", //店铺id,
    couponsArr: [], // 拼接店铺优惠券
    ptCode: "" //平台code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    })
    console.log(app.globalData.selectaddress,'地址')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.orderData()
    console.log(this.data.list == '')
    var that = this
    setTimeout(function() {
      if (that.data.list == '') {
        that.setData({
          modalFrame: true, //模态框
          modalFrameText: '去添加地址',
        })
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // let selectaddress = app.globalData.selectaddress
    // this.setData({
    //   list: selectaddress
    // })
    this.orderData()
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  address: function() { //点击地址跳转到选地址
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },
  submission: function() { //提交订单
    let orderpage = this.data.orderpage //获取订单数据
    let shopArr = []
    let shopCode = ''
    let methodPayment = this.data.methodPayment
    console.log(orderpage)
    console.log(methodPayment)

    // for (var item of this.data.orderpage){
    //   console.log(item)
    //  
    // }
    // console.log(string.join(','))
    let cart_ids = []
    for (var item of orderpage) {
      for (var i of item.goods_list) {
        console.log(i.cart_id)
        cart_ids.push(i.cart_id)
      }
      for (var i of item.money_info.shopList.use) {
        console.log(i)
        if (i.is_select == 1) {
          shopArr.push(i.seller_id + '_' + i.id)
        }
      }
    }
    for (var item of methodPayment.ptList.use) {
      if (item.is_select == 1) {
        shopCode = item.code
      }
    }
    // console.log(shopArr.join(','))
    // console.log(shopCode)
    
    let cart_id = cart_ids.join('_') //把商品id进行拼接
    // console.log(cart_id)
    let string = this.data.remarksArr.join(',') //把商品id和备注进行拼接
    console.log(string)
    // console.log(this.data.list.id)
    // console.log(app.globalData.direct)
    request.http_post('/order/create', {
      direct: app.globalData.direct, //0购物车购买 1立即购买
      cart_ids: cart_id,
      sid: app.globalData.selectaddress ? app.globalData.selectaddress:0, //地址
      uid: wx.getStorageSync('userInfos').uid, //用户id
      coupons: shopArr.join(','),
      pt:14,
      is_allow: this.data.switchChangefalg ? 1 : 0, //是否使用购物积分
      platform_coupon: shopCode,
      user_remarks: string, //备注
      pay_type:''
    }, (res) => {
      console.log(res)
      if (res.code == 1) {
        wx.showToast({
          title: '提交订单成功',
          icon: 'success',
          duration: 2000
        })
        if (this.data.radioNumber == 'jinjifen') {
          wx.navigateTo({
            url: '/pages/integralpayment/integralpayment?money=' + res.data.order_money + '&order_sn=' + res.data.order_sn,
          })
        } else {
          this.payment(res.data)
        }
      }
    })
  },
  bindTextAreaBlur(e) { //获取备注
    console.log(e)
    let cartid = e.currentTarget.dataset.cartid //购物车id数组
    let index = e.currentTarget.dataset.index //购物车id数组
    let value = e.detail.value //备注内容
    // let arr = this.data.remarksArr\
    let remarksArr = this.data.remarksArr
    let cartid_a = ''
    // cartid.forEach()
    for (let i = 0; i < cartid.length; i++) {
      // console.log(i)
      remarksArr.push(cartid[i].cart_id + '_' + value)
    }
    console.log(remarksArr)
  },
  payment: function(res) { //支付接口
    console.log(res)
    request.http_get('/interface?action=orderPay', {
      // channel: 'wx_lite', //渠道名
      // amount: res.order_money * 100, //支付金额
      open_id: wx.getStorageSync('open_id'), //之前获取到的open_id
      order_sn: res.order_sn,
      payment_type: 'ping_wxxcx'
    }, (res) => {
      console.log(res)
      var charge = res.charge
      let cart_id = app.globalData.cart_id
      console.log(cart_id)
      Pingpp.createPayment(charge, function(result, err) {
        console.log(result);
        console.log(err.msg);
        console.log(err.extra);
        if (result == "success") {
          // 只有微信小程序 wx_lite 支付成功的结果会在这里返回
          console.log('付款成功')
          wx.redirectTo({
            url: '/pages/order/order'
          })
        } else if (result == "fail") {
          // charge 不正确或者微信小程序支付失败时会在此处返回
        } else if (result == "cancel") {
          // 微信小程序支付取消支付
          wx.redirectTo({
            url: '/pages/order/order'
          })
        }
      });
    })
  },
  orderData() { //确认订单页数据
    let cart_id = app.globalData.cart_id
    let sid = app.globalData.selectaddress
    console.log(cart_id)
    console.log(sid)
    console.log(app.globalData.direct)
    request.http_post('/order/ConfirmOrderPage', {
      cart_ids: cart_id,
      sid: sid == '' ? 0 : sid,
      direct: app.globalData.direct,
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket
    }, (res) => {
      console.log(res, '获取的数据')
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000
      })
      if (res.code == 1) {
        let list = res.data.currentAddress.address
        let orderpage = res.data.list
        console.log(orderpage)
        for (var item of orderpage) { //把可用店铺优惠券返回来的毫秒转换成现在的时间
          console.log(item.money_info.shopList.use)
          for (var i of item.money_info.shopList.use) {
            console.log(i)
            i["latest_closing_time"] = this.formatDate(i["latest_closing_time"])
            i["latest_start_time"] = this.formatDate(i["latest_start_time"])
          }

        }
        for (var item of orderpage) { //把不可用店铺优惠券返回来的毫秒转换成现在的时间
          console.log(item.money_info.shopList.none_use)
          for (var i of item.money_info.shopList.none_use) {
            console.log(i)
            i["latest_closing_time"] = this.formatDate(i["latest_closing_time"])
            i["latest_start_time"] = this.formatDate(i["latest_start_time"])
          }
        }
        for (var i = 0; i < res.data.ptList.use.length; i++) { //把可用平台优惠券返回来的毫秒转换成现在的时间
          res.data.ptList.use[i]["latest_closing_time"] = this.formatDate(res.data.ptList.use[i]["latest_closing_time"])
          res.data.ptList.use[i]["latest_start_time"] = this.formatDate(res.data.ptList.use[i]["latest_start_time"])
        }
        for (var i = 0; i < res.data.ptList.none_use.length; i++) { //把不可用平台优惠券返回来的毫秒转换成现在的时间
          res.data.ptList.none_use[i]["latest_closing_time"] = this.formatDate(res.data.ptList.none_use[i]["latest_closing_time"])
          res.data.ptList.none_use[i]["latest_start_time"] = this.formatDate(res.data.ptList.none_use[i]["latest_start_time"])
        }
        this.setData({
          modalFrame: false,
          list: list,
          orderpage: orderpage,
          methodPayment: res.data
        })
        console.log(this.data.methodPayment)
        console.log(this.data.orderpage)
      }
    })
  },
  retUrn() { //模态框返回
    wx.navigateBack({
      delta: 1
    })
  },
  well() { //模态框好的
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  balanceChange(e) { //积分支付
    console.log(e.detail.value)
    if (e.detail.value == 'wx') {
      this.setData({
        radioNumber: 'wx',
        checked: true
      })
    } else {
      let lurpak = Number(e.detail.value) / 100
      console.log(this.data.methodPayment.totalMoney)
      console.log(lurpak)
      if (lurpak < this.data.methodPayment.totalMoney) {
        wx.showToast({
          title: '金积分不足!',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          radioNumber: 'wx',
          checked: true
        })
      } else {
        this.setData({
          radioNumber: 'jinjifen',
          checked: false
        })
      }
    }


    console.log(this.data.radioNumber)
  },
  switchChange(e) { //积分抵扣
    console.log(e)
    this.setData({
      switchChangefalg: e.detail.value
    })
    console.log(this.data.methodPayment)
    console.log(this.data.methodPayment.last_integral_cost_money_all)
    console.log(this.data.methodPayment.totalMoney)
    this.setData({
      orderpageTotalprice: Number(this.data.methodPayment.last_integral_cost_money_all) + Number(this.data.methodPayment.totalMoney)
    })
  },
  shopClick(res) { //点击显示店铺优惠券
    console.log(res.currentTarget.dataset.data)
    var availableCoupons = res.currentTarget.dataset.data.shopList.use //可用优惠券
    var noavailableCoupons = res.currentTarget.dataset.data.shopList.none_use //不可用优惠券
    console.log(availableCoupons)
    console.log(noavailableCoupons)
    this.setData({
      couponSwitch: true,
      availableCoupons, //可用优惠券
      noavailableCoupons, //不可用优惠券
      shopID: res.currentTarget.dataset.data.seller_id
    })
    console.log(this.data.shopID)
  },
  ptClick(res) { //平台优惠券
    console.log(res)
    var availableCoupons = res.currentTarget.dataset.data.use //可用优惠券
    var noavailableCoupons = res.currentTarget.dataset.data.none_use //不可用优惠券
    this.setData({
      couponSwitch: true,
      availableCoupons, //可用优惠券
      noavailableCoupons, //不可用优惠券
      shopID: ''
    })
  },
  couponClose(res) { //点击关闭
    this.setData({
      couponSwitch: false
    })
  },
  couponClick(e) { //可用和不可用优惠券
    console.log(e)
    let subscript = e.currentTarget.dataset.index
    this.setData({
      subscript
    })
  },
  formatDate(inputTime) { //时间转换成2019.9.19格式
    // console.log(inputTime)
    var date = new Date(inputTime * 1000);
    var y = date.getFullYear();
    console.log()
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '.' + m + '.' + d;
  },
  couponRadio(e) { //优惠券选择   //拼接平台券
    console.log(this.data.shopID)
    if (this.data.shopID == '') {
      console.log(e)
      let ptCode = e.detail.value
      let availableCoupons = this.data.availableCoupons
      let methodPayment = this.data.methodPayment
      for (var item of availableCoupons) {
        console.log(item)
        if (item.code == ptCode) {
          item.is_select = 1
          methodPayment.couponMoney = item.desc
        } else {
          item.is_select = 0
        }
      }
      methodPayment.ptList.use = availableCoupons
      this.setData({
        ptCode,
        methodPayment
      })
      this.chooseCoupons()
    } else {
      console.log(e)
      let orderpage = this.data.orderpage
      let availableCoupons = this.data.availableCoupons
      this.setData({
        couponsArr: this.data.shopID + '_' + e.detail.value
      })
      console.log(orderpage)
      console.log(availableCoupons)
      let name = ''
      for (var i of availableCoupons) {
        console.log(i)
        if (i.id == e.detail.value) {
          i.is_select = 1
          name = i.desc
        } else {
          i.is_select = 0
        }
      }
      for (var item of orderpage) {
        console.log(item)
        if (item.money_info.seller_id == this.data.shopID) {
          console.log(item.money_info.shopList.use)
          console.log(availableCoupons)
          console.log(name)
          item.money_info.shopList.use = availableCoupons
          item.money_info.couponMoney = name
        }
      }
      this.setData({
        orderpage
      })
      console.log(this.data.orderpage)
      this.chooseCoupons()
    }
  },
  chooseCoupons() { //选中优惠券更改
    let cart_id = app.globalData.cart_id
    let couponsArr = this.data.couponsArr
    let ptCode = this.data.ptCode
    let that = this
    console.log(couponsArr, ptCode)
    request.http_post('/order/FrushOrder', {
      uid: wx.getStorageSync('userInfos').uid,
      cart_ids: cart_id,
      seller_coupon_change: couponsArr,
      is_allow: that.data.switchChangefalg ? 1 : 0, //是否使用购物积分,
      platform_coupon_code: ptCode
    }, (res) => {
      console.log(res, '优惠券')
      console.log(this.data.methodPayment, '价格信息')
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        let orderpage = that.data.orderpage
        let methodPayment = that.data.methodPayment
        for (var item of orderpage) {
          console.log(item)
          if (item.money_info.seller_id == this.data.shopID) {
            item.money_info.totalMoney = res.data.sellerTotalMoney //店铺小计
          }
          if (res.data.sellerList) {
            for (var i of res.data.sellerList) {
              console.log(i)
              for (var index in i) {
                if (i[0] == item.money_info.seller_id) {
                  item.money_info.totalMoney = i[1]
                }
              }
            }
          }
        }
        console.log(orderpage)
        methodPayment['score'] = res.data.score //使用购物积分应返银积分string                        
        methodPayment['noscore'] = res.data.noscore //不使用购物积分应返银积分string
        methodPayment['totalMoney'] = res.data.totalMoney //支付总额
        methodPayment['last_integral_all'] = res.data.last_integral_all //可用购物积分
        methodPayment['last_integral_cost_money_all'] = res.data.last_integral_cost_money_all //购物积分可以抵扣的钱
        this.setData({
          orderpage, //商品信息
          methodPayment //价格信息
        })
        console.log(this.data.methodPayment)
      }

    })
  }
  // addressList: function () {
  //   wx.request({
  //     url:app.globalData.url + '/interface?action=address', //开发者服务器接口地址",
  //     data: {
  //       uid: wx.getStorageSync('userInfos').uid,
  //       ticket: wx.getStorageSync('userInfos').ticket
  //     }, //请求的参数",
  //     method: 'GET',
  //     dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
  //     success: res => {
  //       console.log(res)
  //       // var list = res.data.list
  //       // for(var i in list){
  //       //   if(list[i].is_on == 1){
  //       //     this.setData({
  //       //       list:list[i]
  //       //     })
  //       //   }
  //       // }
  //     }
  //   });
  // }
})