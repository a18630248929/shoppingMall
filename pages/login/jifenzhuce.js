// zh_cjdianc/pages/jifen/jifenzhuce.js
var utilMd5 = require('../../utils/md5.js');
let request = require('../../utils/request.js')
let app = getApp();
var sb = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    djs: '获取验证码',
    ys1: '#fff',
    mobile: '', //手机号
    password: '' //验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    wx.setStorageSync('uid', options.uid)
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
    console.log('隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('卸载')
  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {

  },

  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },
  /*用户点击右上角分享*/
  onShareAppMessage: function () {

  },
  useName: function (e) { //获取手机号文本框内容
    console.log(e)
    if (e.detail.cursor == 11) {
      this.setData({
        backgroundcolor: "#c81e27"
      })
    } else {
      this.setData({
        backgroundcolor: "#999"
      })
    }
    var userName = e.detail.value
    this.setData({
      mobile: userName
    })
  },
  passWord: function (e) { //获取验证码文本框内容
    console.log(e)
    if (e.detail.cursor == 4) {
      this.setData({
        focus: false
      })
    }
    var password = e.detail.value
    this.setData({
      password: password
    })
  },
  yzmdjs: function () {
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) { //判断手机号
      wx.showLoading({
        title: '手机格式错误',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      this.Obtain()
      var that = this;
      if (sb) {
        sb = false;
        that.setData({
          ys1: '#fff'
        });
        var i = 59;
        var ls = setInterval(function () {
          that.setData({
            djs: i
          });
          --i;
        }, 1000);
        setTimeout(function () {
          clearInterval(ls);
          that.setData({
            djs: '重新获取验证码',
            ys1: '#fff'
          });
          sb = true;
        }, 60000);
      }
    }
  },
  Obtain: function () { //调用获取验证码接口
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000; //获取时间戳
    console.log("当前时间戳为：" + timestamp);
    var key = 'Ohr5kz1toBev&sbRi5oIWIX@Cn5p8jRXp*r7plmdm&AYXq0^v9';
    var a = key.substr(0, 8);
    console.log(a)
    var b = key.substr(16, 12);
    console.log(b)
    var c = key.substr(35, 12);
    console.log(c)
    var keyvalue = a + b + c; //截取key值并拼接
    console.log(keyvalue)
    var password = utilMd5.hexMD5(this.data.mobile + keyvalue + timestamp); //拼接手机号key和时间戳并转码
    console.log(password)
    var that = this
    request.http_get('/verify/smsCode', {
      sign: password,
      time: timestamp, //当前设备时间戳
      mobile: this.data.mobile
    }, function (res) {
      console.log(res)

    })

  },
  binDing: function () { //验证码登录
    var that = this
    request.http_get('/account/login', {
      tel: that.data.mobile,
      code: that.data.password,
      devicetype: 'xcx_shop',
      share_id: wx.getStorageSync('uid') == '' ? 0 : wx.getStorageSync('uid')
    }, function (res) {
      console.log(res)
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      } else {
        console.log("......")
        var userInfo = res.data.user
        var authuser = res.data.authuser
        console.log(userInfo)
        console.log(authuser)
        wx.setStorageSync('userInfos', userInfo)
        wx.setStorageSync('authuser', authuser)
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }
    })
  },
  home() {
    wx.switchTab({
      url: '../shopping-mall/shopping-mall',
    })
  }
})