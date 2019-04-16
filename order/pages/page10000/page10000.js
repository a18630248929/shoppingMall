var app = getApp();
let request = require('../../../utils/request.js')
var pageData = {
  data: {
    "carousel1": {
      "type": "carousel",
      "style": "margin-left:0;margin-right:auto;margin-top:0;opacity:1;width:750rpx;",
      "content": [{
        "weight": 0,
        "customFeature": {
          "index_value": "",
          "plateId": "",
          "firstClassifyId": "",
          "xcx-page-url": "",
          "xcx-appid": ""
        },
        "pic": "https:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5abb5b2701cc4.png",
        "name": "\u8f6e\u64ad\u98791",
        "widgetIdPath": ["zhichi_455131332617", null]
      }],
      "customFeature": {
        "carouselgroupId": "",
        "groupName": "\u9ed8\u8ba4\u7ec4",
        "autoplay": true,
        "interval": 2,
        "dataObject": false,
        "indicatorActiveColor": "#B7B7BB",
        "indicatorColor": "#D0D0D5",
        "mode": 1,
        "navigateMode": 0,
        "slideIndex": 0,
        "picBorderRadius": "0px"
      },
      "animations": [],
      "hidden": false,
      "id": "zhichi_455131332617",
      "page_form": "",
      "compId": "carousel1"
    },
    "group_buy_list2": {
      "type": "group-buy-list",
      "style": "background-color:rgb(243, 243, 243);margin-top:0rpx;opacity:1;color:rgb(102, 102, 102);font-size:32.8125rpx;height:auto;margin-left:auto;",
      "content": "",
      "customFeature": {
        "lineBackgroundColor": "rgb(255, 255, 255)",
        "lineBackgroundImage": "",
        "margin": "1",
        "lineHeight": 110,
        "imgWidth": 94,
        "imgHeight": 94,
        "vesselAutoheight": 1,
        "height": "300px",
        "form": "group_buy",
        "source": "7398950",
        "mode": 0,
        "name": "\u62fc\u56e2\u5217\u8868",
        "ifUseContact": true,
        "isContent": false,
        "isIntegral": false,
        "isShowSales": true,
        "isShowVirtualPrice": true,
        "isShowCountdown": true,
        "isShowGroupBuyStatus": true,
        "loadingMethod": 1,
        "loadingStyle": "text",
        "loadingText": "\u70b9\u51fb\u52a0\u8f7d",
        "loadingNum": 10,
        "loadingImg": "https:\/\/cdn.jisuapp.cn\/zhichi_frontend\/static\/webapp\/images\/list-vessel\/loading1.png",
        "loadingColor": "#000",
        "addShoppingCartImageSrc": "addshoppingcart1",
        "isGroup": 0,
        "showGroupSetting": false,
        "isShowFinishText": false,
        "id": "zhichi_372405217633"
      },
      "animations": [],
      "hidden": false,
      "id": "zhichi_561246730484",
      "page_form": "",
      "compId": "group_buy_list2",
      "parentCompid": "group_buy_list2",
      "list_style": "margin-bottom:2.34375rpx;background-color:rgb(255, 255, 255);height:257.8125rpx;margin-left:auto;",
      "img_style": "width:220.3125rpx;height:220.3125rpx;margin-left:auto;",
      "title_width": {
        "width": "506.25rpx"
      },
      "param": "{\"id\":\"zhichi_372405217633\",\"form\":\"group_buy\",\"goods_type\":0,\"page\":1,\"app_id\":\"7gM08Oi02e\",\"tpl_id\":null}"
    },
    "has_tabbar": 0,
    "page_hidden": true,
    "page_form": "",
    "top_nav": {
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTextStyle": "black",
      "navigationBarTitleText": "\u62fc\u56e2"
    },
    "dataId": ""
  },
  need_login: false,
  bind_phone: false,
  page_router: 'page10000',
  page_form: 'none',
  dataId: '',
  list_compids_params: [],
  user_center_compids_params: [],
  goods_compids_params: [],
  prevPage: 0,
  tostoreComps: [],
  carouselGroupidsParams: [{
    "compid": "carousel1"
  }],
  relobj_auto: [],
  bbsCompIds: [],
  dynamicVesselComps: [],
  communityComps: [],
  franchiseeComps: [],
  cityLocationComps: [],
  seckillOnLoadCompidParam: [],
  dynamicClassifyGroupidsParams: [],
  newClassifyGroupidsParams: [],
  videoListComps: [],
  videoProjectComps: [],
  newsComps: [],
  popupWindowComps: [],
  formVesselComps: [],
  searchComponentParam: [],
  topicComps: [],
  topicClassifyComps: [],
  topicSortComps: [],
  rowNumComps: [],
  sidebarComps: [],
  slidePanelComps: [],
  newCountComps: [],
  exchangeCouponComps: [],
  communityGroupComps: [],
  groupBuyStatusComps: [],
  groupBuyListComps: [{
    "compid": "group_buy_list2",
    "param": {
      "id": "zhichi_372405217633",
      "form": "group_buy",
      "goods_type": 0,
      "page": 1,
      "app_id": "7gM08Oi02e",
      "tpl_id": null
    }
  }],
  timelineComps: [],
  signInComps: [],
  returnToVersionFlag: true,
  requesting: false,
  requestNum: 1,
  modelChoose: [],
  modelChooseId: '',
  modelChooseName: [],
  onLoad: function (e) {
    if (e.statisticsType == 11) {
      delete e.statisticsType
      delete e.needStatistics
    }
    if (e.franchisee) {
      this.franchiseeId = e.franchisee;
      this.setData({
        franchiseeInfo: {
          id: e.franchisee,
          mode: e.fmode || ''
        }
      });
    }
    app.onPageLoad(e);
    app.isNeedRewardModal();
  },
  dataInitial: function () {
    app.pageDataInitial();
    if (this.page_router === 'userCenterComponentPage') {
      this.getAppECStoreConfig();
    }
  },
  onPageScroll: function (e) {
    app.onPageScroll(e);
  },
  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      if (e.target.dataset && e.target.dataset.from == 'topicButton') {
        let franchiseeId = app.getPageFranchiseeId();
        let chainParam = franchiseeId ? '&franchisee=' + franchiseeId : '';
        return app.shareAppMessage({
          path: '/informationManagement/pages/communityDetail/communityDetail?detail=' + e.target.dataset.id + chainParam,
          desc: e.target.dataset.desc,
          success: function (addTime) {
            app.getIntegralLog(addTime);
            app.CountSpreadCount(e.target.dataset.id);
          }
        });
      }
    };
    return app.onPageShareAppMessage(e, app.getIntegralLog);
  },
  onShow: function () {
    app.onPageShow();
    this.notLoggedin()
  },
  notLoggedin: function () { //判断购物车页面是否登录
    var that = this
    request.http_get('/interface?action=myself', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
      iversion: '',
      devicetype: ''
    }, (res) => {
      // console.log(res)
      if(res.code != 1){
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
    })
  },
  onReady: function () {
  },
  onHide: function () {
    app.onPageHide();
  },
  reachBottomFuc: [],
  onReachBottom: function () {
    app.onPageReachBottom(this.reachBottomFuc);
  },
  onUnload: function () {
    app.onPageUnload(this);
  },
  slidePanelStart: function (e) {
    app.slidePanelStart(e);
  },
  slidePanelEnd: function (e) {
    app.slidePanelEnd(e);
  },
  onPullDownRefresh: function () { //下拉刷新
    app.onPagePullDownRefresh();
  },
  tapPrevewPictureHandler: function (e) {
    app.tapPrevewPictureHandler(e);
  },
  pageScrollFunc: function (e) {
    app.pageScrollFunc(e);
  },
  dynamicVesselScrollFunc: function (e) {
    app.dynamicVesselScrollFunc(e);
  },
  goodsScrollFunc: function (e) {
    app.goodsScrollFunc(e);
  },
  changeCount: function (e) {
    app.changeCount(e);
  },
  tapMapDetail: function (e) {
    app.tapMapDetail(e);
  },
  listVesselTurnToPage: function (e) {
    app.listVesselTurnToPage(e);
  },
  dynamicVesselTurnToPage: function (e) {
    app.dynamicVesselTurnToPage(e);
  },
  userCenterTurnToPage: function (e) {
    app.userCenterTurnToPage(e);
  },
  turnToGoodsDetail: function (e) {
    app.turnToGoodsDetail(e);
  },
  turnToSeckillDetail: function (e) {
    app.turnToSeckillDetail(e);
  },
  sortListFunc: function (e) {
    app.sortListFunc(e);
  },
  selectLocal: function (e) {
    app.selectLocal(e);
  },
  cancelCity: function (e) {
    app.cancelCity(e);
  },
  bindCityChange: function (e) {
    app.bindCityChange(e);
  },
  submitCity: function (e) {
    app.submitCity(e);
  },
  callPhone: function (e) {
    app.callPhone(e);
  },
  tapVideoPlayHandler: function (e) {
    app.tapVideoPlayHandler(e);
  },
  tapToPluginHandler: function (e) {
    app.tapToPluginHandler(e);
  },
  tapRefreshListHandler: function (e) {
    app.tapRefreshListHandler(e);
  },
  turnToCommunityPage: function (e) {
    app.turnToCommunityPage(e);
  },
  tapToTransferPageHandler: function () {
    app.tapToTransferPageHandler();
  },
  showGoodsShoppingcart: function (e) {
    app.showGoodsShoppingcart(e);
  },
  showAddShoppingcart: function (e) {
    app.showAddShoppingcart(e);
  },
  hideAddShoppingcart: function () {
    app.hideAddShoppingcart();
  },
  selectGoodsSubModel: function (e) {
    app.selectGoodsSubModel(e);
  },
  resetSelectCountPrice: function () {
    app.resetSelectCountPrice();
  },
  clickTostoreMinusButton: function (e) {
    app.clickTostoreMinusButton(e);
  },
  clickTostorePlusButton: function (e) {
    app.clickTostorePlusButton(e);
  },
  readyToPay: function () {
    app.readyToTostorePay();
  },
  getValidateTostore: function () {
    app.getValidateTostore();
  },
  goToShoppingCart: function () {
    app.goToShoppingCart();
  },
  stopPropagation: function () { },
  turnToSearchPage: function (e) {
    app.turnToSearchPage(e);
  },
  previewImage: function (e) {
    var dataset = e.currentTarget.dataset;
    app.previewImage({
      current: dataset.src,
      urls: dataset.imgarr || [dataset.src],
    });
  },
  suspensionTurnToPage: function (e) {
    app.suspensionTurnToPage(e);
  },
  keywordList: {},
  bindSearchTextChange: function (e) {
    this.keywordList[e.currentTarget.dataset.compid] = e.detail.value;
  },
  // 文字组件跳到地图
  textToMap: function (e) {
    app.textToMap(e);
  },
  tapDynamicClassifyFunc: function (e) {
    app.tapDynamicClassifyFunc(e);
  },
  // 跳转到资讯详情
  turnToNewsDetail: function (e) {
    app.turnToNewsDetail(e)
  },
  //切换资讯分类
  getNewsCateList: function (e) {
    app.getNewsCateList(e);
  },
  //话题组件
  topicEleScrollFunc: function (e) {
    app.topicEleScrollFunc(e);
  },
  switchTopiclistOrderBy: function (e) {
    app.switchTopiclistOrderBy(e);
  },
  switchTopicCategory: function (e) {
    app.switchTopicCategory(e);
  },
  turnToTopicDetail: function (e) {
    app.turnToTopicDetail(e);
  },
  pageBackTopAct: function (e) {
    app.pageBackTopAct(e);
  },
  turnToTopicPublish: function (e) {
    app.turnToTopicPublish(e);
  },
  showTopicCommentBox: function (e) {
    app.showTopicCommentBox(e);
  },
  showTopicPhoneModal: function (e) {
    app.showTopicPhoneModal(e);
  },
  topicMakePhoneCall: function (e) {
    app.topicMakePhoneCall(e);
  },
  showTopicReplyComment: function (e) {
    app.showTopicReplyComment(e);
  },
  topicCommentReplyInput: function (e) {
    app.topicCommentReplyInput(e);
  },
  topicReplycommentSubmit: function (e) {
    app.topicReplycommentSubmit(e);
  },
  topicPerformLikeAct: function (e) {
    app.topicPerformLikeAct(e);
  },
  topicImgLoad: function (e) {
    app.topicImgLoad(e);
  },
  topicCommentReplyfocus: function (e) {
    app.topicCommentReplyfocus(e);
  },
  topicCommentReplyblur: function (e) {
    app.topicCommentReplyblur(e);
  },

  // 筛选组件 综合排序tab = 0
  sortByDefault: function (e) {
    app.sortByDefault(e);
  },
  // 筛选组件 按销量排序 tab = 1
  sortBySales: function (e) {
    app.sortBySales(e);
  },
  // 筛选组件 按价格排序 tab = 2
  sortByPrice: function (e) {
    app.sortByPrice(e);
  },
  // 筛选组件 按取货排序 tab = 3
  pickUpStyle: function (e) {
    app.pickUpStyle(e);
  },
  hideFilterPickUpBox: function (e) {
    app.hideFilterPickUpBox(e);
  },
  selectPickUp: function (e) {
    app.selectPickUp(e);
  },
  surePickBtn: function (e) {
    app.surePickBtn(e);
  },
  resetPickBtn: function (e) {
    app.resetPickBtn(e);
  },
  // 筛选组件 展示侧边筛选
  filterList: function (e) {
    app.filterList(e);
  },
  // 筛选侧栏确定
  filterConfirm: function (e) {
    app.filterConfirm(e);
  },
  // 动画结束回调函数
  animationEnd: function (e) {
    app.animationEnd(e);
  },
  //排号
  showTakeNumberWindow: function (e) {
    app.showTakeNumberWindow(e);
  },
  hideTakeNumberWindow: function (e) {
    app.hideTakeNumberWindow(e);
  },
  goToPreviewRowNumberOrder: function (e) {
    app.goToPreviewRowNumberOrder(e);
  },
  selectRowNumberType: function (e) {
    app.selectRowNumberType(e);
  },
  sureTakeNumber: function (e) {
    app.sureTakeNumber(e);
  },
  goToCheckRowNunberDetail: function (e) {
    app.goToCheckRowNunberDetail(e);
  },
  cancelCheckRowNunber: function (e) {
    app.cancelCheckRowNunber(e);
  },
  rowNumberRefresh: function (e) {
    app.rowNumberRefresh(e);
  },
  showCancelWindow: function (e) {
    app.showCancelWindow(e)
  },
  hideCancelWindow: function (e) {
    app.hideCancelWindow(e)
  },
  tapEventCommonHandler: function (e) {
    app.tapEventCommonHandler(e);
  },
  getCarouselData: function (e) {
    let compid = e.currentTarget.dataset.compid;
    app._initialCarouselData(this, compid);
  },
  getNewsList: function (e) {
    let compid = e.currentTarget.dataset.compid;
    app.getNewsList({
      compid: compid
    });
  },
  getCommunityList: function (e) {
    let compid = e.currentTarget.dataset.compid;
    app.initialCommunityList(compid);
  },
  getexchangeCoupon: function (e) {
    app.getexchangeCoupon(e);
  },
  turnToexchangeCouponDetail: function (e) {
    app.turnToexchangeCouponDetail(e);
  },
  exchangeCouponScrollFunc: function (e) {
    app.exchangeCouponScrollFunc(e);
  },
  vipCardTurnToPage: function (e) {
    app.vipCardTurnToPage(e);
  },
  showQRRemark: function (e) {
    app.showQRRemark(e);
  },
  tapDynamicShowAllClassify: function (e) {
    app.tapDynamicShowAllClassify(e);
  },
  dynamicSubClassifyAreaScrollEvent: function (e) {
    app.dynamicSubClassifyAreaScrollEvent(e);
  },
  slidePanelScrollEvent: function (e) {
    app.slidePanelScrollEvent(e);
  },
  unfoldSus: function (e) {
    console.log(e)
    let compId = e.currentTarget.dataset.compid;
    let tapType = e.currentTarget.dataset.taptype;
    // app.newSuspension_unfoldSus(compId, tapType);
  },
  newCountTapEvent: function (e) {
    app.newCountTapEvent(e);
  },
  chengeCommunityGroup(e) {
    app.chengeCommunityGroup(e);
  },
  toCommunityGroup(e) {
    app.toCommunityGroup(e);
  },
  communityGroupScrollFunc(e) {
    app.communityGroupScrollFunc(e);
  },
  getAppECStoreConfig: function () {
    app.getAppECStoreConfig((res) => {
      this.setData({
        storeStyle: res.color_config
      })
    });
  },
  ksnavigation() { //快速导航
    var isnavigation = !this.data.isnavigation
    this.setData({
      isnavigation,
      returnss: 'returns', //css类名
      kai: false
    })
  },
  isnavigationyc() { //点击空白处隐藏快速导航
    this.setData({
      isnavigation: false,
      kai: false
    })
  },
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
  }

};
Page(pageData);