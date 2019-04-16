var app = getApp();

var StorageMgr = require("../../utils/classes/StorageMgr.js");
var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();
var KanorderApi = require('../../utils/apis/kanorder.js');
var kanorderApi = new KanorderApi();

Page({
  data: {
    bctop: 0,
    "type": "all",
    typeNum: 0,
    page: 1,
    displaytype: "",
    isPreIndex: true,
    boradcast: [],
    boradTime: 0,
    goodsList: [],
    formid: [],
    listType: false,
    listData: {
      init: true,
      page: 1,
      isNoMore: false,
      isLoading: false
    },
  },
  onLoad: function (options) {
    var that = this;
    var storageMgr = new StorageMgr();
    var displaytype = storageMgr.getValue("list_displaytype");
    if (displaytype == "") {
      displaytype = "list";
    }
    that.setData({
      displaytype: displaytype,
      isList: "index"
    });
    this.indexLogin();

  },
  indexLogin: function () {
    var that = this;
    if (app.isLogin()) {
      that.loadAll();
    } else {
      app.goLogin({
        success: function () {
          that.loadAll();
        }
      })
    }
  },
  loadAll() {
    var that = this;
    that.getList(that.data.type);
    that.goroundtimer = setInterval(function () {
      kanorderApi.count(that, 'index');
    }, 1000);
    if (that.data.boradTime.length > 0) {
      that.slidShowRound = setInterval(function () {
        that.slidShow();
      }, that.data.boradTime * 10000)
    }
  },
  preCountLoad(typeNum) {
    this.getList(typeNum);
  },
  formSubmit_collect(e) {
    let formid = this.data.formid;
    formid.push(e.detail.formId);
  },
  slidShow() {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/slidShow',
      success: res => {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType) {
          if (res.status == 0) {
            that.setData({
              boradcast: res.data,
              boradTime: res.data.length
            })
          }
        }
      }
    }, config.ServerUrl)
  },

  changeType(e) {
    var that = this,
      t = e ? e.currentTarget.dataset.id : 'all',
      goodsList = [],
      typeNum = e ? e.currentTarget.dataset.type : 0;
    that.setData({
      "type": t,
      typeNum: typeNum,
      page: 1,
      goodsList: goodsList,
      listData: {
        init: true,
        page: 1,
        isNoMore: false,
        isLoading: false
      }
    })
    that.getList(t);
  },
  formSubmit: function (e) {
    var formid = this.data.formid;
    formid.push(e.detail.formId)
  },
  getList(t) {
    let listData = this.data.listData;
    if (listData.isNoMore || listData.isLoading) {
      return;
    }
    this.setData({
      "listData.isLoading": true
    });
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    var that = this;
    app.sendRequest({
      hideLoading: true,
      url: '/BargainGoods/GoodsList',
      data: {
        page: listData.page,
        page_size: 10,
        type: that.data.typeNum
      },
      success: res => {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType) {
          var data = res.data,
            goodsList = that.data.goodsList;
          for (var index in data) {
            data[index].min_priceObj = {
              h: data[index].min_price.split('.')[0],
              s: '.' + data[index].min_price.split('.')[1]
            }
            goodsList.push(data[index])
          }
          that.slidShow();
          kanorderApi.detail(goodsList, that, true);
          listData.page++;
          listData.isNoMore = res.is_more ? false : true;
          that.setData({
            listData: listData
          });
          wx.hideLoading()
        } else if (!strType) {
          wx.hideLoading();
          if (t != that.data.type) {
            that.setData({
              listType: false,
            })
          }
        }
      },
      complete: res => {
        this.setData({
          "listData.isLoading": false
        })
      }
    }, config.ServerUrl)
  },
  changeDisplayType(e) {
    var displaytype = this.data.displaytype == "list" ? "grid" : "list";
    var storageMgr = new StorageMgr();
    storageMgr.setValue("list_displaytype", displaytype);
    this.setData({
      displaytype: displaytype
    });
  },
  scrolltolower() {
    var that = this;
    this.getList(that.data.type)
  },
  saveUserFormId(callback) {
    app.showLoading({
      title: '加载中'
    });
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=api/AppMsgTpl/saveUserFormId',
      method: 'post',
      data: {
        form_id: _this.data.formid || []
      },
      complete: function () {
        app.hideLoading();
        callback && callback();
        _this.setData({
          formid: []
        })
      }
    })
  },
  gotoDetail(e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      bargain_id = e.currentTarget.dataset.bargainid,
      formid = that.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function () {
      app.sendRequest({
        hideLoading: true,
        url: '/BargainGoods/goodsDetails',
        data: {
          goods_id: id,
          bargain_id: bargain_id,
        },
        success: res => {
          that.setData({
            isPreIndex: false
          })
          var path = '';
          if (res.data == "该商品已下架") {
            return false;
          } else {
            if (res.data[0].user) {
              path = '../productkanjia/productkanjia?from=index&id=' + id + '&bargainid=' + bargain_id + '&order_id=' + res.data[0].form_data.order_id;
            } else {
              path = '../productdetail/productdetail?from=index&id=' + id + '&bargainid=' + bargain_id + '&order_id=' + res.data[0].form_data.order_id;
            }
          }

          app.turnToPage(path, false)
        },
      }, config.ServerUrl)
    })
  },
  gotoMyOrder(e) {
    var formid = this.data.formid;
    formid.push(e.detail.formId);
    this.saveUserFormId(
      function () {
        app.turnToPage('../order/order', false)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */

  bccount: 0,

  goroundtimer: null,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!wx.getStorageSync('userInfos')) {
      wx.showModal({
        title: '温馨提示',
        content: "拼团购物需要绑定您的手机号",
        confirmText: "登录",
        confirmColor: "#c81e27",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '/pages/login/jifenzhuce',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.goroundtimer);
    clearInterval(this.slidShowRound);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      goodsList: [],
      listData: {
        init: true,
        page: 1,
        isNoMore: false,
        isLoading: false
      }
    })
    this.getList(this.data.type);
    this.pullRefreshTime = setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
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

  }
})