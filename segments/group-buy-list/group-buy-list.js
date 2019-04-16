var Element = require('../../utils/element.js');
var app = getApp();

var groupBuyList = new Element({
  events: {
    gotoGroupDetail(e) {
      this.gotoGroupDetail(e);
    },
    remainMe: function (e) {
      this.remainMe(e);
    },
    catchMoreGroupList: function (e) {
      this.catchMoreGroupList(e);
    }
  },
  methods: {
    init: function (compid, pageInstance) {
      let that = this;
      let customFeature = pageInstance.data[compid].customFeature;
      let component_params = {
        param: {
          page: 1,
          status: 0,
        }
      };
      if (pageInstance.groupBuyStatusComps && pageInstance.groupBuyStatusComps.length) {
        for (let index in pageInstance.groupBuyStatusComps) {
          let statusCompid = pageInstance.groupBuyStatusComps[index].compid;
          let groupStatusData = pageInstance.data[statusCompid].customFeature;
          if (groupStatusData.status_refresh_object == customFeature.id){
            let checkOptionsOne = groupStatusData.checkOptionsOne;
            for (let selectIndex in checkOptionsOne) {
              if (checkOptionsOne[selectIndex].checked) {
                component_params = {
                  param: {
                    page: 1,
                    status: selectIndex,
                  }
                }
                let newdata = {};
                newdata[statusCompid + '.customFeature.selectNum'] = selectIndex;
                newdata[compid + '.selectNum'] = selectIndex;
                pageInstance.setData(newdata);
                break;
              }
            }
          }
        }
      }
      var isClassify = false;
      if (!!pageInstance.newClassifyGroupidsParams.length) {
        let params = pageInstance.newClassifyGroupidsParams;
        for (let i = 0; i < params.length; i++) {
          let newClassifyCompid = params[i].compid;
          if (pageInstance.data[newClassifyCompid].customFeature.refresh_object == customFeature.id) {
            isClassify = true;
          }
        }
      }
      if (!isClassify) {
        that.getGroupBuyList(compid, component_params);
      }
    },
    getGroupBuyList: function (compid, component_params) {
      let pageInstance = app.getAppCurrentPage();
      let newdata = {};
      let compData = pageInstance.data[compid];
      let customFeature = compData.customFeature;
      let loadingNum = customFeature.loadingNum || 10;
      newdata[compid + '.loading'] = true;
      newdata[compid + '.loadingFail'] = false;
      newdata[compid + '.goods_data'] = [];
      newdata[compid + '.is_more'] = 1;
      newdata[compid + '.curpage'] = 0;
      //清除定时器
      if (pageInstance.downcountObject && pageInstance.downcountObject[compid]) {
        let downcountArr = pageInstance.downcountObject[compid];
        if (downcountArr && downcountArr.length) {
          for (let i = 0; i < downcountArr.length; i++) {
            downcountArr[i] && downcountArr[i].clear();
          }
        }
      }
      pageInstance.setData(newdata);

      component_params.param.page_size = loadingNum;
      if (customFeature.source && customFeature.source != 'none') {
        component_params.param.idx_arr = {
          idx: 'category',
          idx_value: customFeature.source
        }
      }
      app.sendRequest({
        hideLoading: true, // 页面第一个请求才展示loading
        url: '/index.php?r=appGroupBuy/goodsList',
        data: component_params.param,
        method: 'post',
        chain: true,
        subshop: pageInstance.franchiseeId || '',
        success: function (res) {
          if (res.data) {
            let rdata = res.data,
              newdata = {},
              downcountArr = [];

            for (let i = 0; i < rdata.length; i++) {
              let f = rdata[i],
                dc;
              f.description = '';
              f.downCount = {
                hours: '00',
                minutes: '00',
                seconds: '00'
              };
              f.original_price = f.virtual_price == '0.00' ? f.original_price : f.virtual_price;
              f.server_time = res.current_time || (Date.parse(new Date()) / 1000);
              f.seckill_end_time = f.end_date;
              f.seckill_start_time = f.start_date;
              if (f.status == 0 || f.status == 1 || f.status == 2) {
                dc = app.beforeGroupDownCount(f, pageInstance, compid + '.goods_data[' + i + ']');
              } else if (f.status == 3) {
                if (f.end_date != '-1') {
                  dc = app.duringGroupDownCount(f, pageInstance, compid + '.goods_data[' + i + ']');
                }
              }
              dc && downcountArr.push(dc);
            }
            newdata[compid + '.goods_data'] = res.data;
            newdata[compid + '.is_more'] = res.is_more;
            newdata[compid + '.curpage'] = res.current_page;
            newdata[compid + '.loading'] = false;
            newdata[compid + '.loadingFail'] = false;
            pageInstance.downcountObject[compid] = downcountArr;
            pageInstance.setData(newdata);
          }
        },
        fail: function (res) {
          let newdata = {};
          newdata[compid + '.loadingFail'] = true;
          newdata[compid + '.loading'] = false;
          pageInstance.setData(newdata);
        }
      });
    },
    remainMe: function (e) {
      let pageInstance = app.getAppCurrentPage();
      let data = e.currentTarget.dataset;
      let compid = data.compid;
      let index = data.index;

      app.sendRequest({
        url: '/index.php?r=appShop/careActivity',
        data: {
          data_id: data.goodsid,
          activity_id: data.activityid,
          activity_type: 0
        },
        success: res => {
          app.showToast({
            title: '提醒成功！',
            duration: 2000
          });
          var newdata = {};
          newdata[compid + '.goods_data[' + i + '].status'] = 2
          pageInstance.setData(newdata);
        }
      })
    },
    catchMoreGroupList: function (event) {
      let pageInstance = app.getAppCurrentPage();
      let compid = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
      let compData = pageInstance.data[compid];
      let customFeature = compData.customFeature;
      let curpage = compData.curpage + 1;
      let param = {};
      let newData = {};

      if (compData.loading || !compData.is_more) {
        return;
      }
      newData[compid + '.loading'] = true;
      newData[compid + '.loadingFail'] = false;
      pageInstance.setData(newData);

      param.page_size = customFeature.loadingNum || 10;
      param.page = curpage;
      param.status = 0;
      param.is_count = 0;
      param.status = compData.selectNum;
      if (customFeature.source && customFeature.source != 'none') {
        param.idx_arr = {
          idx: 'category',
          idx_value: customFeature.source
        }
      }

      app.sendRequest({
        hideLoading: true,
        url: '/index.php?r=appGroupBuy/goodsList',
        data: param,
        method: 'post',
        chain: true,
        subshop: pageInstance.franchiseeId || '',
        success: function (res) {
          if (res.data) {
            let rdata = res.data,
              newdata = {},
              length = compData.goods_data.length,
              downcountArr = pageInstance.downcountObject[compid] || [];

            for (let i = 0; i < rdata.length; i++) {
              let f = rdata[i],
                dc;
              f.description = '';
              f.downCount = {
                hours: '00',
                minutes: '00',
                seconds: '00'
              };
              f.server_time = (Date.parse(new Date()) / 1000);
              f.seckill_end_time = f.end_date;
              f.seckill_start_time = f.start_date;
              if (f.status == 0 || f.status == 1 || f.status == 2) {
                dc = app.beforeGroupDownCount(f, pageInstance, compid + '.goods_data[' + (i + length) + ']');
              } else if (f.status == 3) {
                if (f.end_date != '-1') {
                  dc = app.duringGroupDownCount(f, pageInstance, compid + '.goods_data[' + (i + length) + ']');
                }
              }
              dc && downcountArr.push(dc);
            }
            var dataArr = res.data;
            newdata[compid + '.goods_data'] = compData.goods_data.concat(dataArr);
            newdata[compid + '.is_more'] = res.is_more;
            newdata[compid + '.curpage'] = res.current_page;
            newdata[compid + '.loading'] = false;
            newdata[compid + '.loadingFail'] = false;
            pageInstance.downcountObject[compid] = downcountArr;
            pageInstance.setData(newdata);
          }

        },
        fail: function (res) {
          let newdata = {};
          newdata[compid + '.loadingFail'] = true;
          newdata[compid + '.loading'] = false;
          pageInstance.setData(newdata);
        }
      });
    },
    remainMe: function(e) {
      let pageInstance = app.getAppCurrentPage();
      let data = e.currentTarget.dataset;
      let compid = data.compid;
      let index = data.index;
  
      app.sendRequest({
        url: '/index.php?r=appShop/careActivity',
        data: {
          data_id: data.goodsid,
          activity_id: data.activityid,
          activity_type: 0
        },
        success: res => {
          app.showToast({
            title: '提醒成功！',
            duration: 2000
          });
          var newdata = {};
          newdata[compid + '.goods_data[' + i + '].status'] = 2
          pageInstance.setData(newdata);
        }
      })
    },
    catchMoreGroupList: function (event) {
      let pageInstance = app.getAppCurrentPage();
      let compid = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
      let compData = pageInstance.data[compid];
      let customFeature = compData.customFeature;
      let curpage = compData.curpage + 1;
      let param = {};
      let newData = {};
  
      if (compData.loading || !compData.is_more) {
        return;
      }
      newData[compid + '.loading'] = true;
      newData[compid + '.loadingFail'] = false;
      pageInstance.setData(newData);
  
      param.page_size = customFeature.loadingNum || 10;
      param.page = curpage;
      param.status = 0;
      param.is_count = 0;
      param.status = compData.selectNum;
      if (customFeature.source && customFeature.source != 'none'){
        param.idx_arr = {
          idx: 'category',
          idx_value: customFeature.source
        }
      }
  
      app.sendRequest({
        hideLoading: true,
        url: '/index.php?r=appGroupBuy/goodsList',
        data: param,
        method: 'post',
        chain: true,
        subshop: pageInstance.franchiseeId || '',
        success: function(res) {
          if (res.data) {
            let rdata = res.data,
              newdata = {},
              length = compData.goods_data.length,
              downcountArr = pageInstance.downcountObject[compid] || [];
  
            for (let i = 0; i < rdata.length; i++) {
              let f = rdata[i],
                dc;
              f.description = '';
              f.downCount = {
                hours: '00',
                minutes: '00',
                seconds: '00'
              };
              f.server_time = res.current_time || (Date.parse(new Date()) / 1000);
              f.seckill_end_time = f.end_date;
              f.seckill_start_time = f.start_date;
              if (f.status == 0 || f.status == 1 || f.status == 2) {
                dc = app.beforeGroupDownCount(f, pageInstance, compid + '.goods_data[' + (i + length) + ']');
              } else if (f.status == 3) {
                if (f.end_date != '-1') {
                  dc = app.duringGroupDownCount(f, pageInstance, compid + '.goods_data[' + (i + length) + ']');
                }
              }
              dc && downcountArr.push(dc);
            }
            var dataArr = res.data;
            newdata[compid + '.goods_data'] = compData.goods_data.concat(dataArr);
            newdata[compid + '.is_more'] = res.is_more;
            newdata[compid + '.curpage'] = res.current_page;
            newdata[compid + '.loading'] = false;
            newdata[compid + '.loadingFail'] = false;
            pageInstance.downcountObject[compid] = downcountArr;
            pageInstance.setData(newdata);
          }
  
        },
        fail: function(res) {
          let newdata = {};
          newdata[compid + '.loadingFail'] = true;
          newdata[compid + '.loading'] = false;
          pageInstance.setData(newdata);
        }
      });
  
    },
    gotoGroupDetail: function(e) {
      console.log(e)
      let franchisee = app.getPageFranchiseeId();
      let chainParam = franchisee ? '&franchisee=' + franchisee : '';
      let data = e.currentTarget.dataset,
          pageUrl = data.status == 4 ? '': '/group/pages/gpgoodsDetail/gpgoodsDetail?goods_id=' + data.goodsid + '&activity_id=' + data.activityid + chainParam;
      app.turnToPage(pageUrl);
    }
  }
});


module.exports = groupBuyList;