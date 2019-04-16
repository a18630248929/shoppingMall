//var li=[];
let app = getApp();
let request = require('../../utils/request.js')
Page({
  data: {
    list: [],
    iconFlag: false,
  },
  onLoad: function (options) {
    this.addressList()
  },
  onshow: function () {
    this.onLoad()
    wx.hideShareMenu()
  },
  addressList: function () { //地址列表
    console.log(wx.getStorageSync('userInfos').ticket)
    request.http_get('/interface?action=address', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket
    }, (res) => {
      console.log(res)
      var list = res.list
      for (var i of list) {
        i.flag = false
        console.log(i)
        if (i.is_on == 1) {
          i.flag = true
        }
      }
      this.setData({
        list: list
      })
      console.log(this.data.list)
    })
  },
  addAddre: function (e) { //跳转到新增地址
    wx.redirectTo({
      url: '/pages/address/location'
    })
  },
  icon: function (e) { //设置默认地址
    console.log(e)
    let index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let list = this.data.list; // 获取地址列表
    let flag = list[index].flag; // 获取当前商品的选中状态
    list[index].flag = !flag; // 改变状态
    this.setData({
      list: list
    });
    request.http_get('/interface?action=default_address', {
      uid: wx.getStorageSync('userInfos').uid,
      shipping_id: e.currentTarget.dataset.id
    }, (res) => {
      console.log(res)
      this.addressList()
    })
  },
  delete: function (e) { //删除地址
    console.log(e)
    request.http_get('/interface?action=del_address', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      sid: e.currentTarget.dataset.id
    }, (res) => {
      console.log(res)
      this.addressList()
    })
  },
  selectaddress: function (e) { //点击获取地址id保存
    console.log(e)
    let that = this
    var selectaddress = e.currentTarget.dataset.selectaddress
    console.log(selectaddress)
    wx.navigateBack({
      delta: 1
    })
    app.globalData.selectaddress = selectaddress.id
  }
})