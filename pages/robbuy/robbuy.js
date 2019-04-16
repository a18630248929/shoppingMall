let util = require('../../utils/util.js')
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('uid', options.uid)
    this.time();
    this.count_down();
    this.spike();
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
  msdetails(e) { //秒杀跳转详情页
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + id
    })
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
  time: function () {
    //前天的时间
    var day0 = new Date();
    day0.setTime(day0.getTime() - 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000);
    var Month = day0.getMonth() + 1
    var date = day0.getDate()
    if (Month < 10) {
      Month = '0' + Month
    } else if (date < 10) {
      date = '0' + date
    }
    var s = (Month) + "-" + date;

    //昨天的时间
    var day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    var Month = day1.getMonth() + 1
    var date = day1.getDate()
    if (Month < 10) {
      Month = '0' + Month
    } else if (date < 10) {
      date = '0' + date
    }
    var s1 = (Month) + "-" + date;

    //今天的时间
    var day2 = new Date();
    day2.setTime(day2.getTime());
    var Month = day2.getMonth() + 1
    var date = day2.getDate()
    if (Month < 10) {
      Month = '0' + Month
    } else if (date < 10) {
      date = '0' + date
    }
    var s2 = (Month) + "-" + date;

    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var Month = day3.getMonth() + 1
    var date = day3.getDate()
    if (Month < 10) {
      Month = '0' + Month
    } else if (date < 10) {
      date = '0' + date
    }
    var s3 = (Month) + "-" + date;

    //后天的时间
    var day4 = new Date();
    day4.setTime(day4.getTime() + 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000);
    var Month = day4.getMonth() + 1
    var date = day4.getDate()
    if (Month < 10) {
      Month = '0' + Month
    } else if (date < 10) {
      date = '0' + date
    }
    var s4 = (Month) + "-" + date;

    this.setData({
      time: s,
      time1: s1,
      time2: s2,
      time3: s3,
      time4: s4
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
})