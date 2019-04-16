// pages/product/order.js
var KanorderApi = require('../../utils/apis/kanorder.js');
var kanorderApi = new KanorderApi();
var app = getApp();
var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    selectmodel: "",
    order: {},
    goodsInfo: {},
    kanfriends: [],
    cart_id_arr: [],
    kanprice: 0,
    description: '',
    status: "P",
    storeConfig: '',
    express_fee: 0,
    selectAddress: {
      id: 0
    },
    shop: {
      id: "0"
    },
    exchangeCouponData: {
      dialogHidden: true,
      goodsInfo: {},
      selectModelInfo: {},
      hasSelectGoods: false,
      voucher_coupon_goods_info: {}
    },
    useBalance: true,
    selectDiscountInfo: {},
    cashOnDelivery: false,
    is_self_delivery: 0,
    deliverytype: "express",
    noAdditionalInfo: true,
    goods_info: [],
    totalPrice: 0,
    additional_info_obj: {},
    goodsType: '',
    selectDelivery: ''
  },
  additional_info: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      selectmodelObj = JSON.parse(options.selectmodel),
      id = options.id,
      order_id = options.order_id,
      bargainid = options.bargainid,
      model_id = selectmodelObj.modelId;

    //id=104;
    var goods_id = options.goods_id;
    var selectmodel = selectmodelObj.models_text;
    var session_key = wx.getStorageSync('session_key');
    this.cart_id_arr = options.cart_arr ? decodeURIComponent(options.cart_arr).split(',') : [];
    this.setData({
      id: id,
      selectmodel: selectmodel,
      order_id: order_id,
      model_id: model_id,
      goods_id: goods_id
    });
    that.kanjiaDetail(goods_id, bargainid);
    that.getAppECStoreConfig();
  },

  kanjiaDetail(goods_id, bargainid) {
    var that = this;
    app.sendRequest({
      hideLoading: true,
      url: '/BargainGoods/activityDetails',
      method: 'get',
      data: {
        page: 1,
        goods_id: goods_id,
        bargain_id: bargainid,
        order_id: that.data.order_id
      },
      success: function(res) {
        var data = res.data,
          dataArr = [];
        if (res.status == 0) {
          if (res.data == "该商品已下架") {
            var path = '/openPlugin/18Fz4z4D/pages/index/index';
            app.showModal({
              content: res.data,
              confirm: function() {
                app.turnBack(path, true)
              }
            })
            return false;
          };
          var data = res.data,
            hasAdditionalInfo = false,
            additional_info_goods = [],
            additional_goodsid_arr = [],
            address_id = '',
            deliveryId = data[0].form_data.delivery_id,
            goodsId = data[0].form_data.id;

          if (deliveryId && deliveryId != '0' && additional_goodsid_arr.indexOf(goodsId) == -1) {
            additional_info_goods.push(data[0].form_data);
            additional_goodsid_arr.push(goodsId);
            hasAdditionalInfo = true;
          }
          kanorderApi.detail(data, that)
          that.setData({
            hasAdditionalInfo: hasAdditionalInfo,
            goodsId: data[0].form_data
            // express_fee: res.data[0]['express_fee']
          });
          dataArr.push(data[0].form_data)
          app.setPreviewGoodsInfo(additional_info_goods);
          that.loadaddress(res.data)
        }
      }
    }, config.ServerUrl)
  },
  getAppECStoreConfig: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=appShop/getAppECStoreConfig',
      success: function(res) {
        if (res.data.express == 0) {
          _this.getSelfDeliveryList();
        }
        _this.setData({
          storeConfig: res.data,
          is_self_delivery: res.data.express == 0 ? 1 : 0,
          storeStyle: _this.franchisee_id ? '' : res.data.color_config
        })
        _this.getCalculationInfo();
      }
    })
  },
  deliveryWayChange: function(event) {
    let type = event.currentTarget.dataset.type;
    if (this.data.selfPayOnDelivery == 0 && type) {
      this.setData({
        cashOnDelivery: false
      })
    }
    if (type == 1 && !this.data.selectDelivery) {
      this.getSelfDeliveryList();
    }
    this.setData({
      is_self_delivery: type
    })
    this.getCalculationInfo();
  },
  getSelfDeliveryList: function() {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getSelfDeliveryList',
      success: function (res) {
        if (!res.data.store_list_data) {
          app.showModal({
            content: '商家暂无自提门店',
          })
          return;
        }
        _this.setData({
          selectDelivery: res.data.store_list_data[0]
        })
      }
    })
  },
  toDeliveryList: function() {
    let _this = this;
    let url = '';
    if (_this.franchisee_id) {
      url += '?franchiseeId=' + _this.franchisee_id;
      url += _this.data.selectDelivery.id ? '&deliveryId=' + _this.data.selectDelivery.id : '';
    } else {
      url += _this.data.selectDelivery.id ? '?deliveryId=' + _this.data.selectDelivery.id : '';
    }
    app.turnToPage('/eCommerce/pages/goodsDeliveryList/goodsDeliveryList' + url);
  },
  goToAdditionalInfo: function() {
    app.setGoodsAdditionalInfo(this.additional_info);
    app.turnToPage('../pluginAdditionalInfo/pluginAdditionalInfo');
  },

  goToMyAddress: function() {
    var addressId = this.data.selectAddress.id;
    this.isFromSelectAddress = true;
    app.turnToPage('../pluginAddress/pluginAddress?id=' + addressId);
  },
  clickPlusButton: function() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  loadaddress(goodsInfo) {
    var that = this;
    app.sendRequest({
      url: '/index.php/AppShop/DefaultAddress',
      method: 'get',
      success: function(res) {
        var data = res.data,
          dataStr = JSON.stringify(data);
        if (res.status == 0 && data) {
          if (dataStr != "{}" && dataStr != '[]') {
            data.address_info = JSON.parse(data.address_info)
            that.setData({
              selectAddress: res.data
            })
          }
        }
      },
      fail: function() {}
    })
  },
  getCalculationInfo: function() {
    var _this = this,
      goods_id = _this.data.goods_id,
      order_id = _this.data.order_id,
      model_id = _this.data.model_id;

    app.sendRequest({
      url: '/BargainOrder/calculationPrice',
      method: 'post',
      data: {
        goods_id: goods_id,
        order_id: order_id,
        model_id: model_id,
        address_id: this.data.selectAddress.id,
        cart_id_arr: this.cart_id_arr,
        is_balance: this.data.useBalance ? 1 : 0,
        is_self_delivery: this.data.is_self_delivery,
        selected_benefit: this.data.selectDiscountInfo,
        voucher_coupon_goods_info: this.data.exchangeCouponData.voucher_coupon_goods_info
      },
      success: function(res) {
        let info = res.data;
        let benefits = info.can_use_benefit;
        let goods_info = info.goods_info;
        let additional_info_goods = [];
        let selectDiscountInfo = info.selected_benefit_info;
        let suppInfoArr = [];
        let additional_goodsid_arr = [];

        let goodsBenefitsData = [];
        benefits.coupon_benefit && benefits.coupon_benefit.length ? goodsBenefitsData.push({
          label: 'coupon',
          value: benefits.coupon_benefit
        }) : '';
        benefits.all_vip_benefit && benefits.all_vip_benefit.length ? goodsBenefitsData.push({
          label: 'vip',
          value: benefits.all_vip_benefit
        }) : '';
        Array.isArray(benefits.integral_benefit) ? '' : benefits.integral_benefit && goodsBenefitsData.push({
          label: 'integral',
          value: [benefits.integral_benefit]
        });

        // 优惠券：兑换券操作
        if (selectDiscountInfo.discount_type == 'coupon' && selectDiscountInfo.type == 3 && _this.data.exchangeCouponData.hasSelectGoods == false) {
          _this.exchangeCouponInit(parseInt(selectDiscountInfo.value));
        }

        for (var i = 0; i <= goods_info.length - 1; i++) {
          if (goods_info[i].delivery_id && goods_info[i].delivery_id != 0 && additional_goodsid_arr.indexOf(goods_info[i].id) == -1) {
            suppInfoArr.push(goods_info[i].delivery_id);
            additional_goodsid_arr.push(goods_info[i].id);
            additional_info_goods.push(goods_info[i]);
          }
        }
        let group_buy_price = String(info.original_price - info.group_buy_discount_price);
        if (group_buy_price.split('.')[1]) {
          group_buy_price = Number(group_buy_price).toFixed(2);
        }
        if (suppInfoArr.length && !_this.hasRequiredSuppInfo) {
          _this.getSuppInfo(suppInfoArr);
        }
        _this.setData({
          selectAddress: info.address || {},
          discountList: goodsBenefitsData,
          selectDiscountInfo: selectDiscountInfo,
          express_fee: info.express_fee,
          discount_cut_price: info.discount_cut_price,
          balance: info.balance,
          deduction: info.use_balance,
          totalPrice: info.price,
          original_price: info.original_price,
          group_buy_price: group_buy_price,
          totalPayment: info.price,
          noAdditionalInfo: suppInfoArr.length ? false : true,
          canCashDelivery: info.is_pay_on_delivery,
          isUseDiscounts: info.is_use_discounts,
          cashOnDelivery: info.price > 0 ? _this.data.cashOnDelivery : false,
          selfPayOnDelivery: info.self_pay_on_delivery
        })
        app.setPreviewGoodsInfo(additional_info_goods);
      }
    }, config.ServerUrl);
  },
  getSuppInfo: function (suppInfoArr) {
    var _this = this;
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=pc/AppShop/GetDelivery',
      method: 'post',
      data: {
        delivery_ids: suppInfoArr
      },
      success: function (res) {
        for (let i = 0; i < res.data.length; i++) {
          let suppInfo = res.data[i].delivery_info;
          for (let j = 0; j < suppInfo.length; j++) {
            if (suppInfo[j].is_required == 0 && suppInfo[j].is_hidden == 1) {
              _this.setData({
                hasRequiredSuppInfo: true
              })
            }
            if (suppInfo[j].is_hidden == 1) {
              _this.setData({
                noAdditionalInfo: false
              })
            }
          }
        }
       
      }
    })
  },
  commentChange: function(e) {
    var value = e.detail.value;
    if (value.length > 30) {
      app.showModal({
        content: '最多只能输入30个字'
      });
      value = value.slice(0, 30);
    }
    this.setData({
      description: value
    })
  },
  confirmPayment: function(e) {

    var list = this.data.goodsList,
      that = this,
      selected_benefit = this.data.selectDiscountInfo,
      hasWritedAdditionalInfo = false;

    if (this.data.is_self_delivery == 0 && !this.data.selectAddress.id) {
      app.showModal({
        content: '请选择地址'
      });
      return;
    }
    if (this.data.is_self_delivery == 1 && !this.data.selectDelivery.id) {
      app.showModal({
        content: '请选择上门自提地址'
      });
      return;
    }

    for (var key in this.additional_info) {
      if (key !== undefined) {
        hasWritedAdditionalInfo = true;
        break;
      }
    }
    if (!this.data.noAdditionalInfo && !hasWritedAdditionalInfo) {
      app.showModal({
        content: '请填写商品补充信息'
      });
      return;
    }

    if (this.requesting) {
      return;
    }
    this.requesting = true;
    var data = {

    }
    app.sendRequest({
      url: '/BargainOrder/addcartOrder',
      method: 'post',
      data: {
        cart_arr: [{
          cart_id: that.cart_id_arr[0],
          goods_id: that.data.goods_id,
          model_id: that.data.model_id || 0,
          num: 1
        }],
        formId: e.detail.formId,
        selected_benefit: that.data.selectDiscountInfo,
        is_balance: that.data.useBalance ? 1 : 0,
        is_self_delivery: that.data.is_self_delivery,
        self_delivery_app_store_id: that.data.is_self_delivery == 1 ? that.data.selectDelivery.id : '',
        remark: that.data.description,
        address_id: that.data.selectAddress.id || that.data.selectDelivery.id,
        is_pay_on_delivery: that.data.cashOnDelivery ? 1 : 0,
        order_id: that.data.order_id,
        additional_info: that.additional_info,
        express_fee: that.data.express_fee,
      },
      success: function(res) {
        var data = res.data;
        if (res.status == 0) {
          if (that.data.cashOnDelivery) {
            let pagePath = '../pluginOrderPaySuccess/pluginOrderPaySuccess?detail=' + res.data + (that.franchisee_id ? '&franchisee=' + that.franchisee_id : '') + '&is_group=' + !!that.is_group
            app.turnToPage(pagePath, 1);
          } else {
            that.payOrder(res.data);
          }

        } else {
          app.showModal({
            content: res.data
          });
          return
        }
      },
      fail: function() {
        that.requesting = false;
      },
      successStatusAbnormal: function() {
        that.requesting = false;
      }
    }, config.ServerUrl);

  },
  additionInfo: function(orderId) {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/info',
      data: {
        additional_info: this.additional_info,
        order_id: orderId
      },
      success: function(res) {

      }
    }, config.ServerUrl)
  },
  payOrder: function(orderId) {
    var that = this;

    function paySuccess() {
      var pagePath = '../pluginOrderPaySuccess/pluginOrderPaySuccess?detail=' + orderId + (that.franchisee_id ? '&franchisee=' + that.franchisee_id : '') + '&is_group=' + !!that.is_group;
      if (!that.franchisee_id) {
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
    }

    function payFail() {
      app.turnToPage('../pluginOrderDetail/pluginOrderDetail?order_id=' + orderId + (that.franchisee_id ? '&franchisee=' + that.franchisee_id : ''), 1);
    }

    if (this.data.totalPayment == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res) {
          paySuccess();
        },
        fail: function() {
          payFail();
        },
        successStatusAbnormal: function() {
          payFail();
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
        var param = res.data;

        param.orderId = orderId;
        param.success = paySuccess;
        param.goodsType = 0;
        param.fail = payFail;
        app.wxPay(param);
      },
      fail: function() {
        payFail();
      },
      successStatusAbnormal: function() {
        payFail();
      }
    })
  },
  showMemberDiscount: function() {
    this.selectComponent('#component-memberDiscount').showDialog(this.data.selectDiscountInfo);
  },
  afterSelectedBenefit: function(event) {
    this.setData({
      selectDiscountInfo: event.detail.selectedDiscount,
      'exchangeCouponData.hasSelectGoods': false,
      'exchangeCouponData.voucher_coupon_goods_info': {}
    })
    this.getCalculationInfo();
  },
  useBalanceChange: function(e) {
    this.setData({
      useBalance: e.detail.value
    });
    this.getCalculationInfo();
  },
  useCashDelivery: function(e) {
    if (this.data.selfPayOnDelivery == 0 && e.detail.value) {
      this.setData({
        is_self_delivery: false
      })
    }
    this.setData({
      cashOnDelivery: e.detail.value
    })
    this.getCalculationInfo();
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})