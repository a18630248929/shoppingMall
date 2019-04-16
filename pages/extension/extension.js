// pages/extension/extension.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(wx.getStorageSync('getuserInfo'))
    console.log(wx.getStorageSync('userInfos'))
  },
  // starttg(e) {
  //   console.log(e)
  //   if (wx.getStorageSync('userInfos') == '') {
  //     wx.navigateTo({
  //       url: '/pages/login/jifenzhuce'
  //     })
  //   } else {
  //     wx.reLaunch({
  //       url: '/pages/shopping-mall/shopping-mall'
  //     });
  //   }
  // },

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
  },
  phone() {
    wx.makePhoneCall({
      phoneNumber: '4000832888' //仅为示例，并非真实的电话号码
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
  onShareAppMessage: function (e) {
    console.log(this.data.id)
    console.log(wx.getStorageSync('userInfos').uid)
    var uid = wx.getStorageSync('userInfos').uid
    return {
      title: '发现个好东东推荐给你',
      // path: "/pages/details/details?uid=" + uid + '&id=' + this.data.id,
      path: "/pages/login/jifenzhuce?uid=" + uid,
      success: function (res) {
        console.log(res)
      }
    }
  },
})