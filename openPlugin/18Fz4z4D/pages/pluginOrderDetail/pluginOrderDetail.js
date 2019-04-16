var app = getApp();
var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();
Page({
  data: {
    orderData: {},
    orderInfo: {},
    orderStatus: {
      '0': '待付款',
      '1': '待发货',
      '2': '待收货',
      '3': '待评价',
      '4': '退款审核中',
      '5': '退款中',
      '6': '已完成',
      '7': '已关闭'
    },
    orderIcon: {
      '0': 'goods-undone-payment',
      '1': 'goods-undone-ship',
      '2': 'goods-undone-receipt',
      '3': 'goods-undone-evaluation',
      '4': 'goods-refund',
      '5': 'goods-refund-doing',
      '6': 'goods-order-complete',
      '7': 'goods-order-close'
    },
    selectAddressId: '',
    goodsAdditionalInfo: {},
    hasAdditionalInfo: false,
    customFields: [],
    goodsId: '',
    orderId: '',
    isFromTemplateMsg: false,
    originalPrice: '',
    useBalance: '',
    showEventDialog: false,
    freightAdress: {},
    express_fee: '',
    discount_cut_price: '',
    isFromBack: false
  },
  onLoad: function(options) {
    this.setData({
      orderId: options.order_id || '',
      isFromTemplateMsg: options.from === 'template_msg' ? true : false,
      franchiseeId: options.franchisee || '',
      goods_id: options.goods_id || ''
    })
    this.dataInitial();
  },
  onShow: function() {
    if (this.data.isFromBack) {
      if (!!this.data.orderInfo.order_id) {
        this.getOrderDetail(this.data.orderInfo.order_id);
      }
    } else {
      this.setData({
        isFromBack: true
      })
    }
  },
  // 每个页面数据初始化函数 dataInitial
  dataInitial: function() {
    this.getOrderDetail(this.data.orderId);
    this.getAppECStoreConfig();
    this.initialAddressId();
    this.setData({
      appName: app.globalData.appTitle,
      appLogo: app.globalData.appLogo
    })
  },
  getOrderDetail: function(orderId) {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/OrderDetails',
      data: {
        app_id: app.getAppId(),
        session_key: app.globalData.sessionKey,
        order_id: that.data.orderId,
        sub_shop_app_id: this.data.franchiseeId
      },
      success: function(res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType) {
          var data = res.data[0],
            form_data = data.form_data,
            hasAdditionalInfo = false,
            additional_info_goods = [],
            additional_goodsid_arr = [],
            address_id = '';

          for (var i = 0; i < form_data.goods_info.length; i++) {
            var deliveryId = form_data.goods_info[i].delivery_id,
              goodsId = form_data.goods_info[i].id;

            if (deliveryId && deliveryId != '0' && additional_goodsid_arr.indexOf(goodsId) == -1) {
              additional_info_goods.push(form_data.goods_info[i]);
              additional_goodsid_arr.push(goodsId);
              hasAdditionalInfo = true;
            }
          }

          let remark = form_data.remark;
          form_data.remark = remark ? remark.replace(/\n|\\n/g, '\n') : remark;

          that.setData({
            orderData: data,
            orderInfo: form_data,
            hasAdditionalInfo: hasAdditionalInfo,
            discount_cut_price: form_data.discount_cut_price,
            useBalance: Number(form_data['use_balance']),
            goodsId: form_data
            // express_fee: res.data[0]['express_fee']
          });
          app.setPreviewGoodsInfo(additional_info_goods);

          if (form_data.is_self_delivery == 1) {
            // 自提
            that.getFreigtAdress();
          } else {
            // 快递
            address_id = form_data.address_info.address_id;
            that.setData({
              selectAddressId: address_id || '',
            })
          }
          app.setGoodsAdditionalInfo(form_data.additional_info || {});
          that.loadaddress();
        } else {
          var path2 = '/eCommerce/pages/myOrder/myOrder';
          app.turnToPage(path2,true)
        }
      }

    }, config.ServerUrl);
  },

  loadaddress() {
    var that = this;
    app.sendRequest({
      url: '/index.php/AppShop/DefaultAddress',
      method: 'get',
      data: {
        app_id: app.getAppId(),
        session_key: app.globalData.sessionKey,
      },
      success: function(res) {
        if (res.data.status == 0) {
          res.data.data.address_info = JSON.parse(res.data.data.address_info)
          that.setData({
            selectAddress: res.data.data
          })
          that.getExpress(res.data.data.id)
        }
      },
      fail: function() {}
    })
  },
  getAppECStoreConfig: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=appShop/getAppECStoreConfig',
      data: {
        'sub_shop_app_id': _this.data.franchiseeId
      },
      success: function (res) {
        _this.setData({
          refundAdress: res.data.refund_config.address,
          refundWithGoods: res.data.refund_config.refund_with_goods,
          isFullRefund: res.data.refund_config.is_full_refund,
        })
      }
    })
  },
  orderDelete: function(e) {
    var orderId = this.data.orderId,
      that = this,
      franchiseeId = this.data.franchiseeId;
    app.showModal({
      content: '订单删除后不可找回，确认删除？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirm: function() {
        app.sendRequest({
          url: '/index.php?r=AppShop/HideOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: franchiseeId
          },
          success: function(res) {
            app.turnBack()
          }
        })
      }
    })
  },
  getExpress(addressid) {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/expressFee',
      data: {
        app_id: app.getAppId(),
        session_key: app.globalData.sessionKey,
        goods_id: that.data.goods_id,
        address_id: addressid
      },
      success: function(res) {
        var data = res.data;
        if (data.status == 0) {
          var orderInfo = that.data.orderInfo,
            express_fee = data.data;
          that.setData({
            express_fee: data.data,
            orderInfo: orderInfo
          })
        }
      },
      fail: function() {}
    }, config.ServerUrl)
  },
  cancelOrder: function(e) {
    var orderId = this.data.orderInfo.order_id,
      that = this;

    app.sendRequest({
      url: '/index.php?r=AppShop/cancelOrder',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function(res) {
        var data = {};

        data['orderInfo.status'] = 7;
        that.setData(data);
      },
      complete: function() {
        that.setData({
          showEventDialog: false
        });
      }
    })
  },
  payOrder: function(e) {
    var address_info = this.data.orderInfo.address_info,
      that = this,
      orderId;


    orderId = this.data.orderInfo.order_id;

    if (this.data.orderInfo.total_price == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res) {
          setTimeout(function() {
            app.showToast({
              'title': '支付成功',
              'icon': 'success',
              'success': function() {
                that.paySuccessCallback();
              }
            });
          });
        }
      });
      return;
    }

    app.sendRequest({
      url: '/index.php?r=AppShop/GetWxWebappPaymentCode',
      data: {
        order_id: orderId
      },
      success: function(res) {
        var param = res.data,
          orderId = that.data.orderInfo.order_id;

        param.orderId = orderId;
        param.goodsType = that.data.orderInfo.goods_type;
        param.success = function() {
          that.paySuccessCallback();
        };
        app.wxPay(param);
      }
    })
  },
  applyDrawback: function () {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/previewGoodsRefund/previewGoodsRefund?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  receiveDrawback: function() {
    var orderId = this.data.orderInfo.order_id,
      that = this;

    app.showModal({
      content: '确定已收到退款？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function() {
        app.sendRequest({
          url: '/index.php?r=AppShop/comfirmRefund',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function(res) {
            var data = {};

            data['orderInfo.status'] = 7;
            that.setData(data);
          }
        })
      }
    })
  },
  
  checkLogistics: function() {
    var orderId = this.data.orderInfo.order_id;
    app.turnToPage('/eCommerce/pages/logisticsPage/logisticsPage?detail=' + orderId);
  },
  sureReceipt: function() {
    var orderId = this.data.orderInfo.order_id,
      that = this;

    app.showModal({
      content: '确定已收到货物？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function() {
        app.sendRequest({
          url: '/index.php?r=AppShop/comfirmOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function(res) {
            var data = {};

            data['orderInfo.status'] = 3;
            that.setData(data);
          }
        })
      }
    })
  },
  makeComment: function() {
    var franchiseeId = this.data.franchiseeId,
      pagePath = '/eCommerce/pages/makeComment/makeComment?detail=' + this.data.orderInfo.order_id + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  showAddressList: function() {
    var addressId = this.data.selectAddressId || '',
      orderId = this.data.orderInfo.order_id,
      franchiseeId = this.data.franchiseeId;

    app.turnToPage('/eCommerce/pages/myAddress/myAddress?id=' + addressId + '&oid=' + orderId + '&sub_shop_id=' + franchiseeId, true);
  },
  goToHomepage: function() {
    var router = app.getHomepageRouter();
    app.turnToPage('/pages/' + router + '/' + router, true);
  },
  verificationCode: function() {
    app.turnToPage('/eCommerce/pages/verificationCodePage/verificationCodePage?detail=' + this.data.orderInfo.order_id + '&sub_shop_app_id=' + this.data.franchiseeId);
  },
  getFreigtAdress: function() {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getAppShopLocationInfo',
      data: {
        app_id: app.getAppId(),
        sub_app_id: that.data.franchiseeId
      },
      success: function(res) {
        that.setData({
          freightAdress: res.data
        });
      }
    });
  },
  freightGoMap: function() {
    var _this = this,
      infor = _this.data.freightAdress.region_string + _this.data.freightAdress.shop_location;
    infor = infor.replace(/\s+/g, '');
    app.sendRequest({
      url: '/index.php?r=Map/GetLatAndLngByAreaInfo',
      data: {
        location_info: infor
      },
      success: function(res) {
        if (res.data) {
          wx.openLocation({
            latitude: res.data.location.lat,
            longitude: res.data.location.lng
          })
        }
      }
    });

  },
  initialAddressId: function() {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/addressList',
      data: {
        app_id: app.getAppId()
      },
      success: function(res) {
        if (res.data.length) {
          that.setData({
            selectAddressId: res.data[0].id || ''
          });
        }
      }
    });
  },
  freightPlayPhone: function() {
    var that = this;
    app.makePhoneCall(that.data.freightAdress.shop_contact)
  },
  seeAdditionalInfo: function() {
    app.turnToPage('/eCommerce/pages/goodsAdditionalInfo/goodsAdditionalInfo?from=goodsOrderDetail');
  },
  paySuccessCallback: function() {
    let orderId = this.data.orderInfo.order_id;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '../pluginOrderPaySuccess/pluginOrderPaySuccess?detail=' + orderId +
      (franchiseeId ? '&franchisee=' + franchiseeId : '');
    if (!franchiseeId) {
      app.sendRequest({
        url: '/index.php?r=AppMarketing/CheckAppCollectmeStatus',
        data: {
          order_id: orderId
        },
        success: function(res) {
          if (res.valid == 0) {
            pagePath += '&collectBenefit=1';
          }
          app.turnToPage(pagePath, 1);
        }
      });
    } else {
      app.turnToPage(pagePath, 1);
    }
  },
  // 迭代1.0
  copyOrderId: function() {
    let _this = this;
    wx.setClipboardData({
      data: _this.data.orderId,
      success: function(res) {
        app.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },
  getWriteOffCodeBox: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetOrderVerifyCode',
      data: {
        'sub_shop_app_id': franchiseeId,
        'order_id': orderId
      },
      success: _this.setVerificationCodeData
    })
  },
  setVerificationCodeData: function(res) {
    let _this = this;
    _this.setData({
      'codeImgUrl': res.data.qrcode_url,
      'codeNum': res.data.code,
      'codeStatus': res.data.status,
      'showWriteOffCodeBox': true
    });
    _this.connectSocket();
  },
  connectSocket: function() {
    var _this = this;
    wx.connectSocket({
      url: 'wss://ceshi.zhichiwangluo.com',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET'
    });
    wx.onSocketOpen(function(res) {
      let data = {
        'action': 'mark_client',
        'user_token': app.globalData.userInfo.user_token,
        'scenario_name': 'app_order_verify',
        'session_key': app.globalData.sessionKey
      };
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      });
      _this.verifiTimeInterval = setInterval(function() {
        let data = {
          'action': 'heartbeat',
          'user_token': app.globalData.userInfo.user_token,
          'scenario_name': 'app_order_verify',
          'session_key': app.globalData.sessionKey
        };
        wx.sendSocketMessage({
          data: JSON.stringify(data)
        })
      }, 30000);
    });
    wx.onSocketMessage(function(res) {
      let data = JSON.parse(res.data);
      if (data.action == 'push_to_client') {
        let msg = JSON.parse(data.msg);
        if ((msg.type == 'app_order_verify') && (msg.status == 0)) {
          _this.setData({
            'codeStatus': 1
          });
          clearInterval(_this.verifiTimeInterval);
          wx.closeSocket();
        }
      }
    });
  },
  hideWriteOffCodeBox: function() {
    var _this = this;
    this.setData({
      'showWriteOffCodeBox': false
    })
    clearInterval(_this.verifiTimeInterval);
    wx.closeSocket();
  },
  showEventDialog: function(event) {
    this.setData({
      eventType: event.currentTarget.dataset.type,
      showEventDialog: true
    })
  },
  deliveryDrawback: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=AppShop/applyRefund',
      data: {
        order_id: orderId,
        sub_shop_app_id: franchiseeId
      },
      success: function(res) {
        _this.getOrderDetail(orderId);
      },
      complete: function() {
        _this.setData({
          showEventDialog: false
        });
      }
    })
  },
  cancelRefund: function() {
    let _this = this;
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    app.sendRequest({
      url: '/index.php?r=appShop/cancelRefund',
      data: {
        'order_id': orderId,
        'sub_shop_app_id': franchiseeId
      },
      success: function() {
        _this.getOrderDetail(orderId);
      }
    })
  },
  editorRefund: function () {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/goodsRefundPage/goodsRefundPage?type=editor&orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  returnInfor: function() {
    let orderId = this.data.orderId;
    let franchiseeId = this.data.franchiseeId;
    let pagePath = '/eCommerce/pages/goodsReturnInfor/goodsReturnInfor?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  hideEventDialog: function() {
    this.setData({
      showEventDialog: false
    })
  },
  sureReceipt: function() {
    var orderId = this.data.orderId,
      that = this,
      addTime = Date.now();

    app.sendRequest({
      url: '/index.php?r=AppShop/comfirmOrder',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function(res) {
        let data = {};
        data['orderInfo.status'] = 3;
        that.setData(data);
        //获取积分弹窗
        app.sendRequest({
          hideLoading: true,
          url: '/index.php?r=appShop/getIntegralLog',
          data: {
            add_time: addTime
          },
          success: function(res) {
            if (res.status == 0) {
              res.data && that.setData({
                'rewardPointObj': {
                  showModal: true,
                  count: res.data,
                  callback: ''
                }
              });
            }
          }
        })
      },
      complete: function() {
        that.setData({
          showEventDialog: false
        });
      }
    })
  },
  // /迭代1.0
})