var app = getApp();

var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    "type": "cut",
    "kan_type_num": 1,
    "order_type_num": "",
    cuttype: "P",
    ordertype: "all",
    items_kanjia: [],
    pageorder: 1,
    pagekan: 1,
    kanjia_status: false,
    items_finish: [],
    items_myhelp: [],
    items_1: [],
    items_2: [],
    items_3: [],
    items_0: [],
    items_all: [],
    items_all_tip: false,
    app_id: "",
    orderid: "",
    qrcodeurl: "",
    formid: []
  },
  loadMyKanjia() {
    var that = this,
      pagekan = that.data.pagekan;
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    app.sendRequest({
      url: '/BargainDetails/bargainList',
      data: {
        type: that.data.kan_type_num,
        page: pagekan,
        page_size: 10,
      },
      success: function(res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType && res.status == 0 && res.data.length > 0) {
          var data = res.data,
            items_finish = that.data.items_finish,
            items_kanjia = that.data.items_kanjia;
          for (var index in data) {
            items_finish.push(data[index]);
            items_kanjia.push(data[index]);
          }
          that.setData({
            kanjia_status: true,
            items_kanjia: items_kanjia,
            items_finish: items_finish,
            pagekan: pagekan + 1
          })
          wx.hideLoading();
        }

      }
    }, config.ServerUrl)
  },
  loadhelpKan() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    var that = this,
      pagekan = that.data.pagekan;
    app.sendRequest({
      url: '/BargainDetails/helpBargainList',
      data: {
        page: pagekan,
        page_size: 10
      },
      success: function(res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType && res.status == 0 && res.data.data.length > 0) {
          var data = res.data.data,
            items_myhelp = that.data.items_myhelp;
          for (var index in data) {
            data[index].kanExtra = data[index].new_user_price == "0.00" ? data[index].verify_phone_price : data[index].new_user_price;
            var formatTime = that.formatTime(data[index].bargain_time, 'Y-M-D h:m:s');
            data[index].bargain_time = formatTime;
            items_myhelp.push(data[index])
          };

          that.setData({
            items_myhelp: items_myhelp,
            pagekan: pagekan + 1
          })
          wx.hideLoading();
        }
      }
    }, config.ServerUrl)
  },
  loadMyOrder(pageorder) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/OrderList',
      data: {
        type: that.data.order_type_num || '',
        page: pageorder,
        page_size: 10,
      },
      success: function(res) {
        var strType = typeof res.data == 'string' ? false : true;

        if (strType && res.status == 0 && res.data.length > 0) {
          var data = res.data;
          that.setData({
            items_all: data,
            items_all_tip: true,
            orderid: res.id || '',
            pageorder: pageorder
          })
          wx.hideLoading()
        } else {
          that.setData({
            items_all: {},
            items_all_tip: false
          })
        }
      }
    }, config.ServerUrl)
  },
  formSubmit_collect(e) {
    let formid = this.data.formid;
    formid.push(e.detail.formId);
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
      complete: function() {
        app.hideLoading();
        callback && callback();
        _this.setData({
          formid: []
        })
      }
    })
  },

  changeCutType(e) {
    var that = this,
      target = e.currentTarget.dataset,
      pagekan = 1;

    this.setData({
      "cuttype": e.currentTarget.id,
      "kan_type_num": target.type,
      pagekan: pagekan,
      items_finish: [],
      items_kanjia: [],
      items_myhelp: []
    });
    if (target.type <= 2) {
      this.loadMyKanjia(pagekan);
    } else {
      this.loadhelpKan(pagekan)
    }
  },
  formatTime(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  changeOrderType(e) {
    var target = e.currentTarget,
      pageorder = 1;
    this.setData({
      "ordertype": target.id,
      "order_type_num": target.dataset.type || '',
      items_finish: [],
      items_kanjia: []
    });
    this.loadMyOrder(pageorder);
  },
  changeType(e) {
    var that = this,
      target = e.currentTarget;
    this.setData({
      "type": target.id,
      items_finish: [],
      items_kanjia: [],
      items_myhelp: []
    });

    if (target.id == "order") {
      var pageorder = 1;
      this.loadMyOrder(pageorder);
    } else {
      var pagekan = that.data.pagekan;
      if (target.dataset.id != that.data.type) {
        pagekan = 1
      }
      that.setData({
        pagekan: pagekan
      })
      if (this.data.kan_type_num == 3) {
        this.loadhelpKan(pagekan);
      } else {
        this.loadMyKanjia(pagekan);
      }
    }
  },
  scrolltolower(e) {
    var target = e.currentTarget;
    if (target.dataset.maintype == "kan") {
      if (target.dataset.type != 3) {
        this.loadMyKanjia(this.data.pageorder)
      } else {
        this.loadhelpKan(this.data.pageorder)
      }
    } else {
      this.loadMyOrder(this.data.pageorder)
    }
  },

  gotoOrderDetail(e) {
    var that = this,
      data = e.currentTarget.dataset,
      order_id = data.orderid || '',
      acid = data.acid,
      goods_id = data.goodsid || '',
      bargain_id = data.bargain_id || '',
      goods_type = data.style || '',
      formid = that.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function() {
      if (goods_type != '3') {
        if (data.style != "help") {
          if (goods_type != 1) {
            if (that.data.type != 'order') {
              wx.navigateTo({
                url: '../pluginOrderDetail/pluginOrderDetail?order_id=' + order_id + '&goods_id=' + goods_id,
              }, -1);
            } else {
              wx.navigateTo({
                url: '/eCommerce/pages/goodsOrderDetail/goodsOrderDetail?detail=' + order_id + '&goods_id=' + goods_id,
              }, -1);
            }
          } else {
            wx.navigateTo({
              url: '../productkanjia/productkanjia?id=' + goods_id + '&bargainid=' + bargain_id + '&order_id=' + order_id + '&from=order'
            })
          }

        }
      } else {
        wx.navigateTo({
          url: '../productkanjia/productkanjia?from=order&id=' + goods_id + '&bargainid=' + bargain_id + '&order_id=' + acid + '&from=order'
        }, -1);
      }
    })
  },
  gotoPay(e) {
    var that = this;
    var session_key = wx.getStorageSync('session_key');
    if (session_key == undefined || session_key == "") {
      var app = getApp();
      app.goLogin({
        success: function() {
          that.goSubmit();
        },
        fail: function() {

        }
      });
      return;
    }
    var json = {
      zhichiapp_id: this.data.app_id,
      order_id: e.currentTarget.id || '',
      session_key: session_key
    };
  },
  gotoHelpDetail(e) {
    var that = this,
      data = e.currentTarget.dataset,
      order_id = data.orderid || '',
      goods_id = data.goodsid || '',
      bargain_id = data.bargain_id || '',
      goods_type = data.style || '';
  that.saveUserFormId(function(){
    app.sendRequest({
      hideLoading: true,
      url: '/BargainGoods/goodsDetails',
      data: {
        goods_id: goods_id,
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
            path = '../productkanjia/productkanjia?from=index&id=' + goods_id + '&bargainid=' + bargain_id + '&order_id=' + res.data[0].form_data.order_id;
          } else {
            path = '../productdetail/productdetail?from=index&id=' + goods_id + '&bargainid=' + bargain_id + '&order_id=' + res.data[0].form_data.order_id;
          }
        }
        app.turnToPage(path, false)
      },
    }, config.ServerUrl)
  })
  },
  applyDrawback: function(e) {
    let orderId = e.target.dataset.id;
    let franchiseeId = e.target.dataset.franchisee;
    let pagePath = '/eCommerce/pages/previewGoodsRefund/previewGoodsRefund?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var order_id = options.order_id || '';
    that.setData({
      order_id: order_id
    });
    that.loadMyKanjia(that.data.pagekan)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var member = this.data.member;

    var session_key = wx.getStorageSync('session_key');
    console.log(session_key);
    if (session_key == undefined || session_key == "") {
      var app = getApp();
      app.goLogin({
        success: function() {

        },
        fail: function() {

        }
      });
      return;
    }
    // this.loadingData();
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
    //clearInterval(goroundtimer);
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

  }
})