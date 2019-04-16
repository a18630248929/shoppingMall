var WxParse = require('../../../../components/wxParse/wxParse.js');
var KanorderApi = require('../../utils/apis/kanorder.js');
var kanorderApi = new KanorderApi();
var app = getApp();
var APIConfig = require('../../utils/ApiConfig.js')
var config = new APIConfig();
Page({
  data: {
    isScroll: true,
    id: 0,
    goods_id: '',
    app_id: "",
    member: {},
    hideHeader: true,
    useBalance: true,
    order: {},
    status: "E",
    goodsInfo: {},
    activityData: {},
    userinfo: {},
    hideQrcode: false,
    isScroll: true,
    slidMask: false,
    showBottomKan: false,
    rectWidth: 0,
    qrCode: '',
    coverImg: '',
    is_delete: '',
    is_end: '',
    coverThumb: '',
    selectModelInfo: {
      models: [],
      stock: '',
      price: '',
      virtualPrice: '',
      buyCount: 1,
      models_text: '',
      windowWidth: 0,
      windowHeight: 0,
      contentHeight: 0,
      thinkList: [],
      footer: '',
      offset: 0,
      lineHeight: 30
    },
    toLate: false,
    kanfriends: [],
    kanFriendsNum: 0,
    kanprice: 0,
    kanprice_str: {
      b: "0",
      "s": ".00"
    },
    boradcast: [],
    boradTime: 0,
    kanY: '',
    bangtype: "rank",
    bangtypeNum: '1',
    rankkanfriends: [],
    showmorerankfriends: 0,
    timekanfriends: [],
    showmoretimefriends: 0,
    scolltomiddle: false,
    progressfix: 70.0,
    inshare: false,
    member_kanprice: 0,
    member_extraprice: 0,
    isShowMore: false,
    new_user_price: 0,
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
    is_phone: '',
    is_message: '',
    is_you: 1,
    is_authshow: false,
    imgurlurl: "",
    kanraito: 0,
    is_bargain: 3,
    hideComment: true,
    hideDetail: false,
    fpage: 1,
    formid: [],
    pageQRCodeData: {
      shaeeDialogShow: "100%",
      shareMenuShow: false,
    },
    shareShowModal: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.uid, '分享过来的ID')
    wx.setStorageSync('uid', options.uid)
    var that = this,
      goods_id = options.id,
      fromurl = options.from,
      formid = options.formid ? decodeURIComponent(options.formid).split(',') : [],
      bargainid = options.bargainid,
      order_id = options.order_id,
      franchiseeId = options.franchisee,
      scene = decodeURIComponent(options.scene) && decodeURIComponent(options.scene) != "undefined" ? decodeURIComponent(options.scene) : '';
    if (scene) {
      fromurl = 'qrcodeShare';
      goods_id = '';
      bargainid = scene.split('&')[1] ? scene.split('&')[1].split('=')[1] : '';
      order_id = scene.split('&')[2] ? scene.split('&')[2].split('=')[1] : '';
    }
    that.setData({
      goods_id: goods_id,
      bargainid: bargainid,
      fromUrl: fromurl || '',
      order_id: order_id || '',
      formid: formid || []
    })
    if (fromurl == "bindCellphone") {
      var inkanObj = {
        inkan: options.inkan,
        public_peice: options.member_kanprice,
        member_kanprice: options.member_kanprice,
        member_extraprice: options.member_extraprice,
        new_user_price: options.new_user_price,
        is_phone: options.is_phone
      }
      that.setData({
        is_phone: 0
      })
      that.kanMore(inkanObj);
    }
    that.pageLogin(fromurl, goods_id, bargainid);
  },
  pageLogin(fromer, goodsId, bargainId) {
    var that = this;
    if (app.isLogin()) {
      that.loadAll(fromer, goodsId, bargainId);
    } else {
      app.goLogin({
        success: function () {
          that.loadAll(fromer, goodsId, bargainId);
        }
      })
    }
  },
  loadAll(fromer, goodsId, bargainId) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          offset: res.windowWidth - 80
        });
      }
    });
    that.loadImg()
    that.preCountLoad(fromer, goodsId, bargainId);
    that.goroundtimer = setInterval(function () {
      var goodsInfo = that.data.goodsInfo,
        end_time = goodsInfo.end_time * 1000,
        now_time = Date.parse(new Date());
      if (end_time == now_time) {
        that.setData({
          toLate: true
        })
        that.loadAll('', goodsId, bargainId);
      } else {
        kanorderApi.count(that);
      }
    }, 1000);
    if (that.data.boradTime.length > 0) {
      that.slidShowRound = setInterval(function () {
        that.slidShow();
      }, that.data.boradTime * 10000)
    };
    that.setData({
      kanfriends: [],
      fpage: 1
    });
    that.getAssessList(0, 1);
    that.kanjiaHistory();
    that.loadShowCanvas();
  },
  loadImg() {
    this.downCanvasImage('background', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/background.png');
    this.downCanvasImage('coverRound', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/coverRound.png');
    this.downCanvasImage('qrCodeRound', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/qrCodeRound.png');
    this.downCanvasImage('part1', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part1.png');
    this.downCanvasImage('part2', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part2.png');
    this.downCanvasImage('part3', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part3.png');
    this.downCanvasImage('part4', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part4.png');
    this.downCanvasImage('part5', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part5.png');
    this.downCanvasImage('part6', 'http://cdn.jisuapp.cn/static/plugin/images/bargain/canvas/part6.png');
  },
  downCanvasImage(name, url) {
    var that = this;
    wx.downloadFile({
      url: app.getSiteBaseUrl() + '/index.php?r=Download/DownloadResourceFromUrl&url=' + url,
      success: res => {
        var data = {};
        data[name] = res.tempFilePath;
        that.setData(data)
      }
    })
  },
  bccount: 0,
  goroundtimer: null,
  preCountLoad(fromer, goodsId, bargainId) {
    this.startKanjia(fromer, goodsId, bargainId);
  },
  slidShow() {
    var that = this;
    app.sendRequest({
      url: '/BargainOrder/slidShow',
      success: function (res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType) {
          if (res.status === 0) {
            var boradcast = res.data;
            that.setData({
              boradcast: boradcast,
              boradTime: boradcast.length
            })
          }
        }
      }
    }, config.ServerUrl)
  },
  gokan() {
    var that = this;
    that.setData({
      fpage: 1,
      kanfriends: []
    });
    if (app.isLogin()) {
      that.setData({
        formid: []
      })
      that.loadGoKan();
      that.startKanjia(that.data.fromurl, that.data.goods_id, that.data.bargainid);
    } else {
      app.goLogin({
        success: function () {
          that.loadGoKan();
          that.startKanjia(that.data.options.from, that.data.goods_id, that.data.bargainid);
        },
      });
    }
    return;
  },
  loadGoKan() {
    var that = this;
    app.sendRequest({
      url: '/BargainDetails/helpBargain',
      data: {
        'order_id': that.data.order_id
      },
      success: function (res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType && res.status === 0) {
          var data = res.data;
          kanorderApi.kan({
            order_id: that.data.order_id
          }, function (data1) {
            var inkaning = true,
              member_kanprice = data.public_peice || '',
              member_extraprice = data.verify_phone_price || '',
              new_user_price = data.new_user_price || '';
            that.setData({
              inkaning: inkaning,
              member_kanprice: member_kanprice,
              member_extraprice: member_extraprice,
              new_user_price: new_user_price
            });
            that.startKanjia(false, that.data.goods_id, that.data.bargainid);
            that.kanjiaHistory();
            setTimeout(function () {
              var inkaning = false;
              var inkan = true;
              that.setData({
                inkaning: inkaning,
                inkan: inkan,
                is_phone: data.is_phone
              });
            }, 1000);
          });
        } else {
          app.showModal({
            content: res.data
          })
        }
      }
    }, config.ServerUrl)
  },
  loadShowCanvas() {
    var that = this;
    app.sendRequest({
      url: '/BargainGoods/shareToMomentsSwitch',
      success: res => {
        that.setData({
          isShareCircle: res.data || ''
        })
      }
    }, config.ServerUrl)
  },
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
  close() {
    var that = this,
      goods = that.data.goodsInfo;
    that.bargainMsg(function () {
      that.loadAll('', goods.id, goods.bargain_id);
      that.setData({
        inkan: false
      });
    });
  },
  kanMoreBtn() {
    var that = this,
      pages = getCurrentPages(),
      currentPage = pages[pages.length - 1],
      url = currentPage.route,
      pageEncode = encodeURIComponent(url + '?id=' + that.data.goods_id + '&bargainid=' + that.data.bargainid + '&order_id=' + that.data.order_id + '&inkan=true&member_kanprice=' + that.data.member_kanprice + '&member_extraprice=' + that.data.member_extraprice + '&new_user_price=' + that.data.new_user_price + '&is_phone=' + that.data.is_phone),
      path = '/default/pages/bindCellphone/bindCellphone?p=' + pageEncode;
    app.turnToPage(path, false);
  },
  kanMore(inkandata) {
    var that = this;
    app.sendRequest({
      url: '/BargainDetails/phoneBargain',
      data: {
        'order_id': that.data.order_id
      },
      success: function (res) {
        if (res.status === 0) {
          var inkan = inkandata.inkan,
            member_kanprice = inkandata.member_kanprice,
            new_user_price = inkandata.new_user_price,
            member_extraprice = res.data.verify_phone_price;
          that.setData({
            inkaning: inkan,
            member_kanprice: member_kanprice,
            member_extraprice: member_extraprice
          });
          setTimeout(function () {
            var inkaning = false,
              inkan = true;
            that.setData({
              inkaning: inkaning,
              inkan: inkan
            });
          }, 1000);
        }
      }
    }, config.ServerUrl)
  },
  formSubmit_collect(e) {
    let formid = this.data.formid;
    formid.push(e.detail.formId);
    if (e.currentTarget.dataset.type == 'goKan') {
      this.saveUserFormId();
    }
  },
  gotoMyKan(e) {
    var goodsInfo = this.data.goodsInfo;
    if (e.currentTarget.dataset.type == 'helpBargain') {
      this.bargainMsg(function () {
        wx.navigateTo({
          url: '../productdetail/productdetail?id=' + goodsInfo.id + '&bargainid=' + goodsInfo.bargain_id,
        })
      });
    } else {
      wx.navigateTo({
        url: '../productdetail/productdetail?id=' + goodsInfo.id + '&bargainid=' + goodsInfo.bargain_id,
      })
    }
  },
  startKanjia(isDetail, goods_id, bargainid) {
    var that = this,
      fromUrl = this.data.fromUrl,
      isList = isDetail == 'indexList' ? '/BargainGoods/goodsDetails' : '/BargainGoods/activityDetails';
    app.sendRequest({
      hideLoading: true,
      url: isList,
      method: 'get',
      data: {
        page: 1,
        goods_id: goods_id,
        bargain_id: bargainid,
        order_id: that.data.order_id
      },
      success: function (res) {
        var data = res.data,
          goods = data[0].form_data,
          coverImg, coverThumb;
        if (res.status == 0) {
          if (res.data == "该商品已下架") {
            var path = '';
            if (fromUrl == "share") {
              path = '/openPlugin/18Fz4z4D/pages/index/index';
              app.showModal({
                content: res.data,
                confirm: function () {
                  app.turnToPage(path, true)
                }
              })
            } else {
              path = fromUrl == "detail" ? '/openPlugin/18Fz4z4D/pages/index/index' : '/openPlugin/18Fz4z4D/pages/' + fromUrl + '/' + fromUrl + '';
              app.showModal({
                content: res.data,
                confirm: function () {
                  app.turnBack(path, true)
                }
              })
            }

          } else {
            that.setData({
              is_message: res.is_message || '',
              is_you: res.is_you || '',
              is_delete: goods.is_delete || '',
              is_bargain: res.is_bargain || '',
              is_end: res.is_end || '',
              hideHeader: true,
              goods_id: goods.id,
              bargainid: goods.bargain_id
            })
            kanorderApi.detail(data, that);
            that.slidShow();
            that.downCanvasImage('coverImg', data[0].form_data.cover);
            that.downCanvasImage('coverThumb', data[0].user.cover_thumb);
            that.generateQRCode(goods.id, goods.bargain_id);
            that.getActivityData(goods.id, goods.bargain_id);
            that.getRectY();
          }
        }
      }
    }, config.ServerUrl)
  },
  formSubmit(e) {
    var formid = this.data.formid;
    formid.push(e.detail.formId)
  },
  getRectY: function () {
    var that = this;
    wx.createSelectorQuery().select('.hangKan').boundingClientRect(function (rect) {
      var bottom = rect && rect.bottom // 节点的下边界坐标
      that.setData({
        kanY: bottom
      })
    }).exec()
  },
  clickPlusImages: function (e) {
    app.previewImage({
      current: e.currentTarget.dataset.src,
      urls: e.currentTarget.dataset.srcarr
    })
  },
  onShareAppMessage: function () {
    var that = this,
      goods = that.data.goodsInfo,
      bargain_title = goods.share_title ? goods.share_title : ('快帮我砍一刀，' + goods.title + '限时' + goods.min_price + '元'),
      bargain_path = '/openPlugin/18Fz4z4D/pages/productkanjia/productkanjia?from=share&id=' + that.data.goods_id + '&bargainid=' + that.data.bargainid + '&order_id=' + that.data.order_id + '&uid=' + wx.getStorageSync('userInfos').uid,
      bargain_cover = goods.share_img ? goods.share_img : 'http://cdn.jisuapp.cn/static/plugin/images/bargain/page/maskshare.jpg';
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        that.setData({
          shareShowModal: false
        });
        that.loadAll('', goods.id, goods.bargain_id)
      }
    })
    //来自页面内的按钮的转发
    return {
      title: bargain_title,
      imageUrl: bargain_cover,
      path: bargain_path
    }
  },
  createData: function () {
    var that = this,
      i = 0,
      goods = that.data.goodsInfo,
      lineNum = 12,
      thinkStr = '',
      thinkList = [];
    for (let item of goods.title) {
      if (item === '\n') {
        thinkList.push(thinkStr);
        thinkList.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 10) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    thinkList = [thinkList[0].length >= 10 ? thinkList[0] + '...' : thinkList[0]]
    that.setData({
      thinkList: thinkList
    });
    that.createCanvas(lineNum);
  },
  createCanvas(lineNum) {
    var that = this,
      rem = wx.getSystemInfoSync().windowWidth / 375,
      myConvas = wx.createCanvasContext('myCanvas'),
      goods = this.data.goodsInfo,
      user = this.data.userinfo,
      qrCode = this.data.qrCode,
      cImage = {},
      nickPr = (user.nickname.length * 10 * rem) + (110 * rem),
      minPL = ((goods.min_priceObj.h).length * 15 * rem) + (144 * rem),
      initPR = ((goods.init_price).length * 10 * rem) + (203 * rem);
    cImage = {
      coverImg: that.data.coverImg,
      coverThumb: that.data.coverThumb,
      background: that.data.background,
      coverRound: that.data.coverRound,
      qrCodeRound: that.data.qrCodeRound,
      part1: that.data.part1,
      part2: that.data.part2,
      part3: that.data.part3,
      part4: that.data.part4,
      part5: that.data.part5,
      part6: that.data.part6,
    };
    myConvas.drawImage(cImage.background, 0, 0, 290 * rem, 465 * rem);
    myConvas.drawImage(cImage.part1, 26.5 * rem, 167.5 * rem, 234 * rem, 32 * rem);
    myConvas.drawImage(cImage.part2, 4 * rem, 200.5 * rem, 270 * rem, 90 * rem);
    myConvas.drawImage(cImage.part3, 98 * rem, 240 * rem, 170 * rem, 35 * rem);
    myConvas.drawImage(cImage.coverThumb, 80 * rem, 175 * rem, 20 * rem, 20 * rem);
    myConvas.drawImage(cImage.coverImg, 20 * rem, 206 * rem, 70 * rem, 70 * rem);
    myConvas.drawImage(cImage.coverRound, 80 * rem, 175 * rem, 20 * rem, 20 * rem);

    this.createwords(myConvas, 10 * rem, user.nickname, '#FDEF90', 105 * rem, 189 * rem);
    this.createwords(myConvas, 10 * rem, '正在参加砍价活动', '#FFFFFF', nickPr, 189 * rem);
    this.createwords(myConvas, 9 * rem, '最低', '#FDEF90', 105 * rem, 253 * rem);
    this.createwords(myConvas, 9 * rem, '砍至', '#FDEF90', 105 * rem, 265 * rem);
    this.createwords(myConvas, 13 * rem, '¥', '#FDEF90', 130 * rem, 265 * rem);
    this.createwords(myConvas, 22 * rem, goods.min_priceObj.h + '.', '#FDEF90', 140 * rem, 265 * rem);
    this.createwords(myConvas, 16 * rem, goods.min_priceObj.s, '#FDEF90', minPL, 265 * rem);
    this.createwords(myConvas, 10 * rem, '¥' + goods.init_price, '#FFFFFF', 220 * rem, 263 * rem);
    this.createLine(myConvas, 215 * rem, initPR, 259 * rem);
    for (let item of this.data.thinkList) {
      if (item !== 'a') {
        this.createwords(myConvas, 13 * rem, item, '#333', 100 * rem, 228 * rem);
      }
    };
    if (!that.data.hideQrcode) {
      myConvas.drawImage(cImage.part4, 93 * rem, 290 * rem, 104.5 * rem, 15 * rem)
      myConvas.drawImage(cImage.part5, 72 * rem, 310.5 * rem, 141 * rem, 30 * rem)
      that.createwords(myConvas, 12 * rem, goods.endTime_rel, '#FFFFFF', 88 * rem, 326 * rem);
      myConvas.drawImage(cImage.qrCodeRound, 107 * rem, 347 * rem, 77 * rem, 77 * rem);
      qrCode && myConvas.drawImage(qrCode, 110 * rem, 350 * rem, 70 * rem, 70 * rem);
      myConvas.drawImage(cImage.part6, 40 * rem, 438.5 * rem, 205 * rem, 10 * rem)
    } else {
      myConvas.drawImage(cImage.part4, 93 * rem, 340 * rem, 104.5 * rem, 15 * rem)
      myConvas.drawImage(cImage.part5, 72 * rem, 360.5 * rem, 141 * rem, 30 * rem)
      that.createwords(myConvas, 12 * rem, goods.endTime_rel, '#FFFFFF', 88 * rem, 376 * rem);
    }
    myConvas.fill();
    myConvas.draw();
  },
  createwords(myConvas, font, words, color, left, top) {
    myConvas.setFontSize(font);
    myConvas.setFillStyle(color);
    myConvas.fillText(words, left, top)
  },
  createLine(myConvas, left, right, top) {
    myConvas.beginPath();
    myConvas.strokeStyle = '#FFFFFF'
    myConvas.lineWidth = 2;
    myConvas.moveTo(left, top)
    myConvas.lineTo(right, top)
    myConvas.stroke()
    myConvas.closePath()
  },
  savePic() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '图片保存成功'
            });
          },
          fail: function (res) {
            if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              wx.showModal({
                title: '提示',
                content: '您拒绝授权保存图片到相册，这将影响您使用小程序，您可以点击右上角的菜单按钮，选择关于。进入之后再点击右上角的菜单按钮，选择设置，然后将保存到相册按钮打开，返回之后再重试。',
                showCancel: false,
                confirmText: "确定"
              })
            }
          }

        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  generateQRCode(goodsId, bargainId) {
    var that = this,
      orderid = that.data.order_id;
    let pages = app.getAppCurrentPage(),
      path = pages.route,
      scene = encodeURIComponent('&bargainid=' + bargainId + '&order_id=' + orderid);
    app.sendRequest({
      url: '/BargainGoods/generateQRCode',
      data: {
        qrcode_type: 0,
        path: path,
        scene: scene
      },
      success: function (res) {
        if (res.status == '0') {
          if (res.data == "生成二维码失败") {
            that.setData({
              hideQrcode: true
            })
          } else {
            that.downCanvasImage('qrCode', res.data)
          }
        }
      }
    }, config.ServerUrl)
  },
  // goInshare(e) {
  //   var goods = this.data.goodsInfo,
  //     userInfo = this.data.userinfo;
  //   this.setData({
  //     inshare: true,
  //     isScroll: false,
  //     maskFlow: "hidden",
  //     slidMask: false
  //   });
  //   this.createData();
  // },
  bargainMsg(callback) {
    var that = this;
    app.sendRequest({
      url: '/BargainDetails/sendHelpBargainMsg',
      data: {
        order_id: that.data.order_id
      },
      complete: res => {
        callback && callback();
      }
    }, config.ServerUrl)
  },
  goInshare() {
    if (this.data.formid.length > 0) {
      this.saveUserFormId();
    }
    this.setData({
      shareShowModal: true
    })
  },
  cancelShare() {
    this.setData({
      shareShowModal: false
    })
  },
  closeShare() {
    this.setData({
      inshare: false,
      isScroll: true,
      maskFlow: "auto",
      slidMask: true,
      shareShowModal: true
    });
  },

  buyDirectlyNextStep: function (e) {
    if (wx.getStorageSync('userInfos')) {
      var that = this,
        selectmodel = JSON.stringify(this.data.selectModelInfo),
        goods_id = this.data.goods_id,
        bargainid = this.data.bargainid,
        order_id = this.data.order_id,
        param = {
          goods_id: goods_id,
          model_id: this.data.selectModelInfo.modelId || ''
        };

      if (this.data.goodsInfo.countDiff && this.data.selectModelInfo.stock !== "0") {
        app.sendRequest({
          url: '/BargainOrder/addCart',
          data: param,
          success: function (res) {
            var cart_arr = [res.data],
              pagePath = '../productorder/productorder?id=' + goods_id + '&selectmodel=' + selectmodel + '&order_id=' + order_id + '&goods_id=' + goods_id + '&bargainid=' + bargainid + '&cart_arr=' + encodeURIComponent(cart_arr);
            that.hiddeAddToShoppingCart();
            that.setData({
              addtocart: false
            })
            app.turnToPage(pagePath, true);
          }
        }, config.ServerUrl)
      } else {
        app.showModal({
          content: '该规格商品库存不足'
        })
      }

    } else {
      wx.redirectTo({
        url: '/pages/login/jifenzhuce',
      })
    }
  },
  hiddeAddToShoppingCart: function () {
    this.setData({
      addToShoppingCartHidden: true
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

  resetSelectCountPrice: function () {
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
  inputBuyCount: function (e) {
    var count = +e.detail.value,
      selectModelInfo = this.data.selectModelInfo,
      goodsInfo = this.data.goodsInfo,
      stock = +selectModelInfo.stock;

    if (count >= stock) {
      count = stock;
      app.showModal({
        content: '购买数量不能大于库存'
      });
    }
    if (this.data.isSeckill && count >= +goodsInfo.seckill_buy_limit) {
      count = goodsInfo.seckill_buy_limit;
      app.showModal({
        content: '购买数量不能大于秒杀限购数量'
      });
    }
    this.setData({
      'selectModelInfo.buyCount': +count
    });
  },
  changeComment: function () {
    var hideComment = !this.data.hideComment;
    this.setData({
      hideComment: hideComment
    })
  },
  changeDetail: function () {
    var hideDetail = !this.data.hideDetail;
    this.setData({
      hideDetail: hideDetail
    })
  },
  scroll: function (e) {
    var that = this,
      scrollTop = e.detail.scrollTop,
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
  // clickMinusButton: function (e) {
  //   var count = this.data.selectModelInfo.buyCount;

  //   if (count <= 1) {
  //     return;
  //   }
  //   this.setData({
  //     'selectModelInfo.buyCount': count - 1
  //   });
  // },
  // clickPlusButton: function (e) {
  //   var selectModelInfo = this.data.selectModelInfo,
  //     goodsInfo = this.data.goodsInfo,
  //     count = selectModelInfo.buyCount,
  //     stock = selectModelInfo.stock;

  //   if (count >= stock) {
  //     app.showModal({ content: '购买数量不能大于库存' });
  //     return;
  //   }
  //   if (this.data.isSeckill && count >= goodsInfo.seckill_buy_limit) {
  //     app.showModal({ content: '购买数量不能大于秒杀限购数量' });
  //     return;
  //   }
  //   this.setData({
  //     'selectModelInfo.buyCount': count + 1
  //   });
  // },
  changebangtype(e) {
    var type = e.currentTarget.dataset.type,
      id = e.currentTarget.dataset.id,
      isShowMore = this.data.isShowMore,
      kanfriends = this.data.kanfriends,
      fpage = this.data.fpage;
    if (id != this.data.bangtypeNum) {
      fpage = 1;
      isShowMore = false;
      kanfriends = []
    }
    this.setData({
      bangtype: type,
      bangtypeNum: id,
      fpage: fpage,
      kanfriends: kanfriends,
      isShowMore: isShowMore
    })
    this.kanjiaHistory()
  },
  gotoTryPay() {
    this.setData({
      addtocart: true,
      fromUrl: ''
    })
  },
  closeAddToCart() {
    this.setData({
      addtocart: false
    })
  },
  kanjiaHistory() {
    var that = this,
      fpage = that.data.fpage,
      typeNum = that.data.bangtypeNum;
    app.sendRequest({
      hideLoading: true,
      url: "/BargainDetails/bargainTop",
      method: 'get',
      data: {
        order_id: that.data.order_id,
        type: typeNum || 1,
        page: fpage,
        page_size: 5
      },
      success: function (res) {
        var strType = typeof res.data == 'string' ? false : true;
        if (strType && res.status == 0) {
          var data = res.data,
            isShowMore = that.data.isShowMore,
            kanfriends = that.data.kanfriends;

          for (let index in data) {
            kanfriends.push(data[index])
          }
          if (kanfriends.length >= res.num) {
            isShowMore = false;
          } else {
            isShowMore = true;
          }

          for (let index in kanfriends) {
            kanfriends[index].seq = parseInt(index) + 1
          }
          var kanfriends = {
            kanfriends: kanfriends,
            fpage: fpage + 1,
            kanFriendsNum: res.num,
            isShowMore: isShowMore
          };
          that.setData(kanfriends)
        } else {
          that.setData({
            isShowMore: false
          })
        }
      }
    }, config.ServerUrl)
  },

  getAssessList: function (commnetType, page, append) {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetAssessList',
      method: 'post',
      data: {
        goods_id: that.data.goods_id,
        "idx_arr[idx]": 'level',
        "idx_arr[idx_value]": commnetType,
        page: page,
        page_size: 10,
        sub_shop_app_id: this.data.franchiseeId
      },
      success: function (res) {
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
          displayComment: that.data.goodsInfo.goods_type === '0' ? (+res.num[0] > 0 ? false : true) : (that.data.goodsInfo.appointment_info && that.data.goodsInfo.appointment_info.display_comment == '1' ? that.data.goodsInfo.appointment_info.display_comment : '')
        })
      }
    })

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
  getActivityData: function (goodsid, bargainid) {
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
        setTimeout(function () {
          that.createData();
        }, 2000)
      }
    }, config.ServerUrl)
  },
  authorization(e) {
    var that = this;
    var is_authshow = e.currentTarget.authshow;
    wx.showModal({
      title: '',
      content: '好友非常需要您的帮助哦，真的不帮ta多砍点吗？',
      confirmText: "去授权",
      confirmColor: " #c81e27",
      cancelText: "残忍拒绝",
      cancelColor: '#000',
      success: function (res) {
        var pages = getCurrentPages(),
          currentPage = pages[pages.length - 1],
          url = currentPage.route,
          pageEncode = encodeURIComponent(url + '?id=' + that.data.goods_id + '&bargainid=' + that.data.bargainid + '&order_id=' + that.data.order_id + '&inkan=true&member_kanprice=' + that.data.member_kanprice + '&member_extraprice=' + that.data.member_extraprice + '&new_user_price=' + that.data.new_user_price + '&is_phone=' + that.data.is_phone),
          path = '/default/pages/bindCellphone/bindCellphone?p=' + pageEncode;
        if (res.confirm) {
          that.setData({
            is_authshow: false
          })
          app.turnToPage(path, false)
        } else {
          that.setData({
            is_authshow: true
          })
        }
      }
    })
  },

  goGoodsDetail(e) {
    var id = this.data.goods_id;
    var bargainid = this.data.bargainid
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?detail=' + id + '&contact=true',
    })
  },
  goToCommentPage(e) {
    var that = this,
      formid = that.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function () {
      var franchiseeId = that.data.franchiseeId,
        pagePath = '../pluginComment/pluginComment?detail=' + that.data.goods_id + (franchiseeId ? '&franchisee=' + franchiseeId : '');
      app.turnToPage(pagePath);
    })
  },
  goToHomepage: function (e) {
    var that = this,
      formid = that.data.formid;
    formid.push(e.detail.formId);
    that.saveUserFormId(function () {
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
  showPageCode: function () {
    this.setData({
      inshare: true,
      shareShowModal: false
    })
  },
  rankcheckmore() {
    this.kanjiaHistory();
  },
  useBalanceChange: function (e) {
    this.setData({
      useBalance: e.detail.value
    });
    this.getCalculationInfo();
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
    var that = this,
      fromUrl = that.data.fromUrl;
    if (fromUrl != 'index' && fromUrl != 'detail' && fromUrl != 'order' && fromUrl != 'share' && fromUrl != 'bindCellphone' && fromUrl != 'qrcodeShare') {
      var goods = that.data.goodsInfo;
      that.loadAll('', goods.id, goods.bargain_id);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.slidShowRound);
    clearInterval(this.goroundtimer);
  },

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
    var that = this,
      goods = that.data.goodsInfo;
    this.loadAll('', goods.id, goods.bargain_id);
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
})