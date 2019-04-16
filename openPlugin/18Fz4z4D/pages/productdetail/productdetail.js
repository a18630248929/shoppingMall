// pages/product/detail.js
var WxParse = require('../../../../components/wxParse/wxParse.js');
var KanorderApi = require('../../utils/apis/kanorder.js');
var kanorderApi = new KanorderApi();
var app = getApp();
var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();
Page({

  /**
   * 页面的初始数据
   * status: N:未发起砍价
   */
  data: {
    id: 0,
    goods_id: '',
    app_id: "",
    scrollTop: 0,
    isScroll: true,
    showBottomKan: false,
    member: {},
    order: {},
    formid: [],
    status: "E",
    goodsInfo: {},
    userinfo: {},
    kanY: '',
    slidMask: false,
    selectModelInfo: {
      models: [],
      stock: '',
      price: '',
      virtualPrice: '',
      buyCount: 1,
      models_text: ''
    },
    kanfriends: [],
    kanprice: 0,
    kanprice_str: {
      b: "0",
      "s": ".00"
    },
    boradcast: [],
    boradTime: 0,
    bangtype: "rank",
    rankkanfriends: [],
    showmorerankfriends: 0,
    timekanfriends: [],
    showmoretimefriends: 0,
    scolltomiddle: false,
    progressfix: 70.0,
    inshare: false,
    member_kanprice: 0,
    member_extraprice: 0,
    inkaning: false,
    inkan: false,
    addtocart: false,
    count: 1,
    selectedoptionstr: "",
    stock: 0,
    selectmodel: [],
    showdescription: false,
    showevaluate: false,
    evaluate: [],
    is_message: '',
    imgurlurl: "",
    kanraito: 0,
    background: '',
    fixedY: '',
    fixedT: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id;
    var formid = options.formid ? decodeURIComponent(options.formid).split(',') : [];
    var bargainid = options.bargainid;
    that.setData({
      fromUrl: options.from,
      formid: formid
    })
    //id=23;
    that.pageLogin(id, bargainid)
  },
  bccount: 0,
  goroundtimer: null,
  pageLogin(id, bargainid) {
    var that = this;
    if (app.isLogin()) {
      that.loadAll(id, bargainid)
    } else {
      app.goLogin({
        success: function() {
          that.loadAll(id, bargainid)
        }
      })
    }
  },
  loadAll(id, bargainid) {
    var that = this;
    that.preCountLoad(id, bargainid)
    that.setData({
      goods_id: id,
      bargainid: bargainid,
      isList: "detail"
    })
    that.goroundtimer = setInterval(function() {
      kanorderApi.count(that, false);
    }, 1000);
    if (that.data.boradTime.length > 0) {
      that.slidShowRound = setInterval(function() {
        that.slidShow();
      }, that.data.boradTime * 10000)
    }
    that.getAssessList(0, 1);
    that.getActivityData(id, bargainid);
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
      complete: function(res) {
        app.hideLoading();
        callback && callback();
        _this.setData({
          formid: []
        })
      }
    })
  },
  preCountLoad(id, bargainid) {
    this.loadDetail(id, bargainid)
  },
  clickPlusImages: function(e) {
    app.previewImage({
      current: e.currentTarget.dataset.src,
      urls: e.currentTarget.dataset.srcarr
    })
  },
  slidShow() {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/slidShow',
      success: function(res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType && res.status === 0) {
          var boradcast = res.data;
          that.setData({
            boradcast: boradcast,
            boradTime: res.data.length
          })
        }
      }
    }, config.ServerUrl)
  },

  loadDetail(goods_id, bargainid) {
    var that = this,
      fromUrl = this.data.fromUrl,
      goodsModel = [],
      selectModels = [],
      modelStrs = {},
      price = 0,
      discountStr = '',
      allStock = 0,
      selectStock, selectPrice, selectModelId, matchResult, selectVirtualPrice, selectText = '',
      selectImgurl = '';
    app.sendRequest({
      hideLoading: true,
      url: '/BargainGoods/goodsDetails',
      method: 'get',
      data: {
        page: 1,
        goods_id: goods_id,
        bargain_id: bargainid
      },
      success: function(res) {
        var data = res.data,
        formData = data[0].form_data;
        if (data == "该商品已下架") {
          var path = '';
          if (fromUrl == "share") {
            path = '/openPlugin/18Fz4z4D/pages/index/index';
            app.showModal({
              content: res.data,
              confirm: function() {
                app.turnToPage(path, true)
              }
            })
          } else {
            path = '/openPlugin/18Fz4z4D/pages/' + fromUrl + '/' + fromUrl + '';
            app.showModal({
              content: res.data,
              confirm: function() {
                app.turnBack(path, true)
              }
            })
          }
        } else {
          if (data[0].user) {
            path = '../productkanjia/productkanjia?from=index&id=' + formData.id + '&bargainid=' + formData.bargain_id + '&order_id=' + formData.order_id;
            app.turnToPage(path,true)
          } else {
            var strType = typeof res.data == 'string' ? false : true;
            that.slidShow();
            that.setData({
              is_delete: formData.is_delete || ''
            });
            if (strType && res.status == 0) {
              kanorderApi.detail(data, that)
            };
            that.getRectY();
          }
        }
      }
    }, config.ServerUrl)
  },
  tryAddToCart(e) {
    let that = this,
      formid = this.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function() {
      app.sendRequest({
        url: '/BargainGoods/startBargain',
        method: 'get',
        data: {
          page: 1,
          goods_id: that.data.goods_id,
          bargain_id: that.data.bargainid,
          goods_name: that.data.goodsInfo.title,
          cover: that.data.goodsInfo.cover
        },
        success: function(res) {
          if (res.status === 0) {
            var dataT = e.currentTarget.dataset,
              id = dataT.id,
              order_id = res.data[0].form_data.order_id,
              bargainid = dataT.bargainid,
              path = '../productkanjia/productkanjia?from=detail&id=' + id + '&bargainid=' + bargainid + '&order_id=' + order_id + '&formid=' + formid;
            app.turnToPage(path, true)
          } else if (res.status === 1) {
            app.showModal({
              title: '发起活动失败',
              content: res.data,
              confirmColor: ' #c81e27'
            });
          }
        },
        fail: function() {

        }
      }, config.ServerUrl)
    })
  },
  goToHomepage: function(e) {
    var that = this,
      formid = that.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function() {
      if (that.data.franchiseeId) {
        var pages = getCurrentPages();
        var url = '/franchisee/pages/franchiseeDetail/franchiseeDetail';
        var delta = 1;
        for (let i = pages.length - 1; i >= 0; i--) {
          var page = pages[i];
          if (page.route == url && page.options.detail == that.data.franchiseeId) {
            delta = pages.length - 1 - i;
            app.turnBack({
              delta: delta
            });
            return;
          }
        }
        app.turnToPage('/franchisee/pages/franchiseeDetail/franchiseeDetail?detail=' + that.data.franchiseeId, true);
      } else {
        var router = app.getHomepageRouter();
        app.reLaunch({
          url: '/pages/' + router + '/' + router
        });
      }
    });

  },
  goGoodsDetail() {
    this.setData({
      addtocart: true
    })
  },
  closeAddToCart() {
    this.setData({
      addtocart: false
    })
  },
  selectSubModel(e) {
    var dataset = e.target.dataset,
      modelIndex = dataset.modelIndex,
      submodelIndex = dataset.submodelIndex,
      data = {},
      selectModels = this.data.selectModelInfo.models,
      model = this.data.goodsInfo.model,
      text = '"';

    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];

    // 拼已选中规格文字
    for (let i = 0; i < selectModels.length; i++) {
      var selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if (selectModels[i] == selectSubModelId[j]) {
          if (i == selectModels.length - 1) {
            text += model[i].subModelName[j];
          } else {
            text += '' + model[i].subModelName[j] + ',';
          }
        }
      }
    }
    text += '"';
    data['selectModelInfo.models'] = selectModels;
    data['selectModelInfo.models_text'] = text;

    this.setData(data);
    this.resetSelectCountPrice();
  },

  resetSelectCountPrice: function() {
    var _this = this,
      selectModelIds = this.data.selectModelInfo.models.join(','),
      modelItems = this.data.goodsInfo.model_items,
      data = {};

    for (let i = modelItems.length - 1; i >= 0; i--) {
      if (modelItems[i].model == selectModelIds) {
        data['selectModelInfo.stock'] = modelItems[i].stock;
        data['selectModelInfo.price'] = modelItems[i].price;
        data['selectModelInfo.modelId'] = modelItems[i].id;
        data['selectModelInfo.imgurl'] = modelItems[i].img_url;
        data['selectModelInfo.virtualPrice'] = modelItems[i].virtual_price;
      }
    }
    this.setData(data);
  },
  getAssessList: function(commnetType, page, append) {
    var that = this;
    app.getAssessList({
      method: 'post',
      data: {
        goods_id: that.data.goods_id,
        idx_arr: {
          idx: 'level',
          idx_value: commnetType
        },
        page: page,
        page_size: 20,
        sub_shop_app_id: this.data.franchiseeId
      },
      success: function(res) {
        var commentData = res.data;
        if (append) {
          commentData = that.data.commentArr.concat(commentData);
        }

        that.setData({
          commentArr: commentData,
          commentNums: res.num,
          commentPage: that.data.commentPage + 1,
          commentExample: res.data[0] || '',
          commentTotalPage: res.total_page,
        })
      }
    });
  },
  getActivityData: function(goodsid, bargainid) {
    var that = this;
    app.sendRequest({
      url: '/BargainGoods/activityData',
      data: {
        'goods_id': goodsid,
        'bargain_id': bargainid
      },
      success: res => {
        var data = res.data,
          activityData = {
            'visit_num': res.visit_num > 100000 ? parseInt(res.visit_num / 10000) + 'W+' : res.visit_num,
            'help_bargain_num': res.help_bargain_num > 100000 ? parseInt(res.help_bargain_num / 10000) + 'W+' : res.help_bargain_num,
            'participation_num': res.participation_num > 100000 ? parseInt(res.participation_num / 10000) + 'W+' : res.participation_num,
            'help_bargain_cover': res.data
          }
        that.setData({
          activityData: activityData
        })
      }
    }, config.ServerUrl)
  },
  clickMinusButton: function(e) {
    var count = this.data.selectModelInfo.buyCount;

    if (count <= 1) {
      return;
    }
    this.setData({
      'selectModelInfo.buyCount': count - 1
    });
  },
  clickPlusButton: function(e) {
    var selectModelInfo = this.data.selectModelInfo,
      goodsInfo = this.data.goodsInfo,
      count = selectModelInfo.buyCount,
      stock = selectModelInfo.stock;

    if (count >= stock) {
      app.showModal({
        content: '购买数量不能大于库存'
      });
      return;
    }
    if (this.data.isSeckill && count >= goodsInfo.seckill_buy_limit) {
      app.showModal({
        content: '购买数量不能大于秒杀限购数量'
      });
      return;
    }
    this.setData({
      'selectModelInfo.buyCount': count + 1
    });
  },
  buyDirectlyNextStep: function(e) {
    var franchiseeId = this.data.franchiseeId,
      that = this,
      param = {
        goods_id: this.data.goods_id,
        model_id: this.data.selectModelInfo.modelId || '',
        num: this.data.selectModelInfo.buyCount,
        sub_shop_app_id: franchiseeId || '',
        is_seckill: this.data.isSeckill ? 1 : ''
      };
    if (that.data.goodsInfo.countDiff) {
      app.sendRequest({
        url: '/index.php?r=AppShop/addCart',
        data: param,
        success: function(res) {
          var cart_arr = [res.data],
            pagePath = '/eCommerce/pages/previewGoodsOrder/previewGoodsOrder?cart_arr=' + encodeURIComponent(cart_arr);

          franchiseeId && (pagePath += '&franchisee=' + franchiseeId);
          that.hiddeAddToShoppingCart();
          app.turnToPage(pagePath);
        }
      })
    } else {
      app.showModal({
        content: '库存不足'
      })
    }

  },
  goToCommentPage() {
    var franchiseeId = this.data.franchiseeId,
      pagePath = '../pluginComment/pluginComment?detail=' + this.data.goods_id + (franchiseeId ? '&franchisee=' + franchiseeId : '');
    app.turnToPage(pagePath);
  },
  hiddeAddToShoppingCart: function() {
    this.setData({
      addToShoppingCartHidden: true
    })
  },
  getRectY: function() {
    var that = this;
    wx.createSelectorQuery().select('.hangKan').boundingClientRect(function(rect) {
      var bottom = rect && rect.bottom // 节点的下边界坐标
      that.setData({
        kanY: bottom
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.goroundtimer);
    clearInterval(this.slidShowRound);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPageScroll(e) {
    var that = this,
      scrollTop = e.scrollTop,
      rectY = that.data.kanY,
      slidMask,
      showBottomKan;

    if (scrollTop > 0) {
      slidMask = true
    } else {
      slidMask = false
    }
    if (scrollTop >= rectY) {
      showBottomKan = true;
    } else {
      showBottomKan = false;
    }
    that.setData({
      showBottomKan: showBottomKan,
      slidMask: slidMask
    })
  },
  onPullDownRefresh: function() {
    var goods = this.data.goodsInfo;
    this.loadAll(goods.id, goods.bargain_id);
    this.pullRefreshTime = setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 1000);
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
    var that = this,
      goods = that.data.goodsInfo,
      path = '/openPlugin/18Fz4z4D/pages/productdetail/productdetail?from=share&id=' + that.data.goods_id + '&bargainid=' + that.data.bargainid;
    wx.showShareMenu({
      withShareTicket: true,
      success: function(res) {
        that.setData({
          inshare: false
        });
      }
    })
    //来自页面内的按钮的转发
    return {
      path: path
    }
  }
})