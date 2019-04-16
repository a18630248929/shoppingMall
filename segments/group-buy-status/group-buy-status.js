var Element = require('../../utils/element.js');
var GroupBuyList = require('../group-buy-list/group-buy-list.js');
var app = getApp();

var groupBuyStatus = new Element({
  events: {
    catchGroupList: function (e) {
      this.catchGroupList(e)
    }
  },
  methods: {
    init: function(compid, pageInstance){
      
    },
    catchGroupList: function(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let compid = e.currentTarget.dataset.compid;
      let pageInstance = app.getAppCurrentPage();
      let component_params = {
        param: {
          page: 1,
          status: e.currentTarget.dataset.index || 0,
        }
      };
      let groupCompid = '';
      let listId = pageInstance.data[compid].customFeature.status_refresh_object;
      for (let i in pageInstance.groupBuyListComps) {
        let comps = pageInstance.groupBuyListComps[i];
        if(listId == comps.param.id){
          groupCompid = comps.compid;
        }
      }
      if(!groupCompid){
        app.showModal({content: '找不到绑定的拼团列表'});
        return;
      }
      if (!!pageInstance.newClassifyGroupidsParams.length) {
        let params = pageInstance.newClassifyGroupidsParams;
        for (let i = 0; i < params.length; i++) {
          let newClassifyCompid = params[i].compid;
          let newClassifyCompData = pageInstance.data[newClassifyCompid];
          if (newClassifyCompData.customFeature.refresh_object == pageInstance.data[groupCompid].customFeature.id) {
            component_params.param.idx_arr = {
              idx: 'category',
              idx_value: newClassifyCompData.selectedCateId
            };
          }
        }
      }
      let newdata = {};
      newdata[compid + '.customFeature.selectNum'] = index;
      newdata[groupCompid + '.selectNum'] = index;
      pageInstance.setData(newdata);
      GroupBuyList.getGroupBuyList(groupCompid, component_params)
    }
  }
});


module.exports = groupBuyStatus;