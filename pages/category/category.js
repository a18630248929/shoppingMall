// pages/category/category.js
let app = getApp()
let request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryArr: "", //分类的数据
    categoryflag: true, //控制数据显示隐藏
    subscript: 0,
    pageNum: 1,
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
        this.onReady()
        break
      case 1:
        this.setData({
          sort_name: "rq",
          sort_type: 'desc'
        })
        this.onReady()
        break
      case 2:
        this.setData({
          sort_name: "xl",
          sort_type: 'desc'
        })
        this.onReady()
        break
      case 3:
        if (this.data.variable == false) {
          this.setData({
            sort_name: "jg",
            sort_type: 'desc',
            variable: true
          })
          this.onReady()
          break
        } else {
          this.setData({
            sort_name: "jg",
            sort_type: 'asc',
            variable: false
          })
          this.onReady()
          break
        }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    console.log(res, "................")
    this.setData({
      cid: res.cid
    })
    console.log(this.data.cid)
    // let that = this
    // let categoryArr = app.globalData.category
    // console.log(categoryArr)
    // if (categoryArr.length == 0) {
    //   console.log('隐藏成功')
    //   that.setData({
    //     categoryflag: false
    //   })
    // }
    // that.setData({
    //   categoryArr
    // })
    // console.log(this.data.categoryArr)
    // //获取全部数据
    // request.http_get('/interface?action=sellerDetail', {
    //   page: 1,
    //   uid: 240456984,
    //   id: that.data.cid,
    //   cat_id: categoryArr.cat_id,
    // }, function(res) {
    //   console.log('回调', res)
    //   that.setData({
    //     categorylist: res.list
    //   })
    //   // console.log(that.data.categoryArr)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    let categoryArr = app.globalData.category
    console.log(categoryArr)
    wx.setNavigationBarTitle({
      title: categoryArr.name
    })
    if (categoryArr.length == 0) {
      // console.log('隐藏成功')
      that.setData({
        categoryflag: false
      })
    }
    that.setData({
      categoryArr,
      cat_id: categoryArr.list[0].cat_id
    })
    console.log(this.data.categoryArr)
    console.log(this.data.cat_id)
    //获取全部数据
    request.http_get('/interface?action=n_goodslist&pid=0&cid=1&id=422&page=1&order=&appver=3.5.06&devicetype=android&platform=android&iversion=3506&dev=1&appType=1', {
      page: that.data.pageNum,
      uid: 240456984,
      cid: that.data.cid,
      id: that.data.cat_id,
      sort_name: that.data.sort_name,
      sort_type: that.data.sort_type
    }, function (res) {

      
    // request.http_get('/interface?action=second_tag&appver=3.5.04&devicetype=android&platform=android&iversion=3504&dev=1&appType=1', {
    //   cid: 1,
    //   id: this.data.cat_id,
    //   page: that.data.pageNum,
    //   sort_name: that.data.sort_name,
    //   sort_type: that.data.sort_type
    // }, function(res) {
      console.log('回调', res)
      that.setData({
        categorylist: res.list
      })
      console.log(that.data.categorylist)
    })


    //创建节点选择器
    let query = wx.createSelectorQuery();
    //选择id
    query.select('#scroll-view').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      // console.log(res);
      if (res != null) {
        if (res[0].height > 100) {
          that.setData({
            scroll_view: 224
          })
        }
      }

      // console.log(that.data.scroll_view)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideShareMenu() //隐藏转发
    let that = this
    // //创建节点选择器
    // let query = wx.createSelectorQuery();
    // //选择id
    // query.select('#scroll-view').boundingClientRect()
    // query.exec(function(res) {
    //   //res就是 所有标签为mjltest的元素的信息 的数组
    //   console.log(res);
    //   if (res != null) {
    //     if (res[0].height > 100) {
    //       that.setData({
    //         scroll_view: 120
    //       })
    //     }
    //   }

    //   console.log(that.data.scroll_view)
    // })

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
    var categorylist = this.data.categorylist
    // console.log(categorylist)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var page = Number(that.data.pageNum) + 1
    let categoryArr = app.globalData.category
    request.http_get('/interface?action=n_goodslist&pid=0&cid=1&id=422&page=1&order=&appver=3.5.06&devicetype=android&platform=android&iversion=3506&dev=1&appType=1', {
      page: page,
      uid: 240456984,
      cid: that.data.cid,
      id: categoryArr.cat_id
    }, function(res) {
      console.log(res)
      if (res.list.length == 0) {
        wx.showLoading({
          title: '没有更多数据',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      } else {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
        for (var i = 0; i < res.list.length; i++) {
          categorylist.push(res.list[i])
        }
        console.log(categorylist)
        that.setData({
          categorylist: categorylist,
          pageNum: page++
        })
        console.log(that.data.categorylist)
      }
      wx.hideLoading()
      console.log(that.data.categorylist)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  categoryDetails(e) { //请求分类数据接口
    console.log(e)
    let that = this
    that.setData({
      subscript: e.currentTarget.dataset.index
    })
    request.http_get('/interface?action=n_goodslist&pid=0&cid=1&id=422&page=1&order=&appver=3.5.06&devicetype=android&platform=android&iversion=3506&dev=1&appType=1', {
      page: that.data.pageNum,
      uid: 240456984,
      cid: that.data.cid,
      id: e.currentTarget.dataset.cat_id
    }, function(res) {
      console.log('回调', res)
      if (res.list.length == 0) {
        wx.showToast({
          title: '暂无商品',
          icon: 'loading',
          duration: 1000
        })
      }
      that.setData({
        categorylist: res.list
      })
      console.log(that.data.categoryArr)
    })
  },
  tabDetails(id) { //跳转到详情页
    // console.log(id)
    wx.navigateTo({
      url: "/pages/details/details?id=" + id.currentTarget.dataset.id,
    })
  },

  // 获取滚动条当前位置
  onPageScroll: function(e) {
    // console.log('“打印当前页面滚动的距离 =”' + e)

    // console.log(e)
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
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {

      //   //wx.pageScrollTo(OBJECT)
      //   基础库 1.4.0 开始支持，低版本需做兼容处理
      // 将页面滚动到目标位置。
      //   OBJECT参数说明：
      //   参数名	类型	必填	说明
      // scrollTop	Number	是	滚动到页面的目标位置（单位px）
      //   duration	Number	否	滚动动画的时长，默认300ms，单位 ms
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

})