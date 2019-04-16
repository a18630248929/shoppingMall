//使用方法，下面两句复制到page的js文件的头部，然后你猜
//var KanorderApi=require('/apis/kanorder.js');
//var kanorderApi=new KanorderApi();
var APIConfig = require('../ApiConfig.js');
var apiconfig = new APIConfig();
var app = getApp();
var WxParse = require('../../../../components/wxParse/wxParse.js');

class KanorderApi {
  constructor(){}
  detail(param, label, isList) {
    var prePage = label,
      that = this,
      data = param;
    if (isList) {
      for (let index in data) {
        var goods = data[index];
        goods.now_time = Date.parse(new Date());
        goods.endBox = (goods.now_time / 1000) < parseInt(goods.end_time) && (goods.now_time / 1000) > parseInt(goods.start_time) ? true : false;
        goods.startBox = (goods.now_time / 1000) < parseInt(goods.end_time) && (goods.now_time / 1000) > parseInt(goods.start_time) ? true : false;
        that.timeSplit(goods, prePage, isList);
        // that.count(prePage, data, true, that.timeSplit(goods, prePage, isList));
      }
      var goodsList = {
        goodsList: data || '',
        listType: true
      };
      prePage.setData(goodsList);
    } else {
      that.loadDetail(data, prePage);
    }
  };
  loadDetail(data, label) {
    var that = this,
      prePage = label,
      goodsModel = [],
      selectModels = [],
      modelStrs = {},
      price = 0,
      discountStr = '',
      allStock = 0,
      selectStock, selectPrice, selectModelId, matchResult, selectVirtualPrice, selectText = '"',
      selectImgurl = '',
      goods = data[0].form_data,
      userInfo = data[0].user || '',
      endTime_rel = new Date(goods.end_time * 1000),
      endTime_obj = {
        year: endTime_rel.getFullYear(),
        month: (endTime_rel.getMonth() + 1 < 10 ? '0' + (endTime_rel.getMonth() + 1) : endTime_rel.getMonth() + 1),
        date: ('' + endTime_rel.getDate()).length < 2 ? '0' + endTime_rel.getDate() : endTime_rel.getDate(),
        hour: ('' + endTime_rel.getHours()).length < 2 ? '0' + endTime_rel.getHours() : endTime_rel.getHours(),
        min: ('' + endTime_rel.getMinutes()).length < 2 ? '0' + endTime_rel.getMinutes() : endTime_rel.getMinutes(),
        sec: ('' + endTime_rel.getSeconds()).length < 2 ? '0' + endTime_rel.getSeconds() : endTime_rel.getSeconds()
      },
      endTime_arr = [],
      now_price = goods.now_price ? (((goods.now_price * 100) / 100) + '') : goods.goods_price,
      kan_price = '' + (Math.ceil(goods.init_price * 100 - now_price * 100) / 100),
      kan_price = kan_price.indexOf(".") == -1 ? (kan_price + '.00') : kan_price.substring(0, kan_price.indexOf(".")) + '.' + kan_price.substring(kan_price.indexOf(".") + 1, kan_price.indexOf(".") + 3),
      process = goods.now_price == goods.min_price ? 1 : (goods.init_price - goods.now_price) / (goods.init_price - goods.min_price),
      modelObj = goods.model;
    goods.now_time = Date.parse(new Date());
    if (parseInt(goods.goods_num) - parseInt(goods.sales) <= 0 || prePage.data.is_delete != "0" || goods.status != "0") {
      goods.endtime_s = {
        hour: ['0'],
        minute: ['0', '0'],
        second: ['0', '0']
      };
      goods.originPay = true;
    } else {
      if ((goods.now_time / 1000) < parseInt(goods.end_time) && (goods.now_time / 1000) > parseInt(goods.start_time)) {
        goods.endBox = true;
        goods.originPay = false;
        goods.startBox = true;
      } else if ((goods.now_time / 1000) > parseInt(goods.end_time)) {
        goods.endBox = false;
        goods.startBox = false;
        goods.originPay = true;
      } else if ((goods.now_time / 1000) < parseInt(goods.start_time)) {
        goods.startBox = true;
        goods.originPay = true;
      }
    }

    goods.goods_num = parseInt(goods.goods_num);
    goods.endTime_rel = endTime_obj.year + '-' + endTime_obj.month + '-' + endTime_obj.date + ' ' + endTime_obj.hour + ':' + endTime_obj.min + ':' + endTime_obj.sec;
    goods.model = [];
    goods.sales = parseInt(goods.sales);
    goods.min_priceObj = {
      h: goods.min_price.split('.')[0],
      s: goods.min_price.split('.')[1]
    };
    goods.now_priceObj = {
      h: now_price.indexOf(".") == -1 ? now_price : now_price.substring(0, now_price.indexOf(".")),
      s: now_price.indexOf(".") == -1 ? '00' : now_price.substring(now_price.indexOf(".") + 1, now_price.indexOf(".") + 3)
    };
    goods.kan_price = kan_price;
    that.timeSplit(goods, prePage);
    if (goods.end_time * 1000 <= Date.parse(new Date())) {
      goods.endtime_s = {
        hour: ['0'],
        minute: ['0', '0'],
        second: ['0', '0']
      }
    }
    for (let i in modelObj) {
      goods.model.push(modelObj[i]);
    }
    if (goods.model_items && goods.model_items.length) {
      var items = goods.model_items;
      for (let i = 0; i < items.length; i++) {
        price = Number(items[i].price);
        var virtual_price = Number(items[i].virtual_price);
        goods.highPrice = goods.highPrice > price ? goods.highPrice : price;
        goods.lowPrice = goods.lowPrice < price ? goods.lowPrice : price;
        if (virtual_price != 0) {
          goods.virtual_highPrice = goods.virtual_highPrice ? (goods.virtual_highPrice > virtual_price ? goods.virtual_highPrice : virtual_price) : virtual_price;
        }
        allStock += Number(items[i].stock);
        if (i == 0) {
          selectPrice = price;
          selectStock = items[0].stock;
          selectModelId = items[0].id;
          selectImgurl = items[0].img_url;
          selectVirtualPrice = items[0].virtual_price;
        }
      }
    } else {
      selectPrice = goods.price;
      selectStock = goods.stock;
      selectVirtualPrice = goods.virtual_price;
      selectImgurl = goods.cover;
    }
    for (let key in goods.model) {
      if (key) {
        var model = goods.model[key];
        goodsModel.push(model);
        if (model && model.subModelName) {
          if (key == '1' && goods.goods_type == '1') {
            for (let index in model.subModelName) {
              var adjustTime = model.subModelName[index].split('-'),
                submodel = model.subModelName[index].substring(6, 8),
                endHours = (submodel - 24) >= 10 ? (submodel - 24) : '0' + (submodel - 24);
              model.subModelName[index] = submodel >= 24 ? adjustTime[0] + '-' + '次日' + endHours + ':' + adjustTime[1].split(':')[1] : adjustTime[0] + '-当日' + adjustTime[1];
            }
          }
          if (goods.goods_type == '1' && model.id == '0') {
            for (let index in model.subModelName) {
              model.subModelName[index] = model.subModelName[index] + (goods.appointment_info && goods.appointment_info.unit);
            }
          }
          modelStrs[key] = model.subModelName.join('、');
          selectModels.push(model.subModelId[0]);
          if(key == goods.model.length - 1 ){
            selectText += model.subModelName[0];
          }else{
            selectText += ''+ model.subModelName[0] + ', ';
          }
        }

      }
    }
    selectText += '"';
    goods.process = process <= 1 ? process : 0;
    var goodsInfo = {
      'goodsInfo': goods,
      'userinfo': userInfo || '',
      'selectModelInfo.models': selectModels || '',
      'selectModelInfo.stock': selectStock || '',
      'selectModelInfo.price': selectPrice || '',
      'selectModelInfo.modelId': selectModelId || '',
      'selectModelInfo.models_text': selectText || '',
      'selectModelInfo.imgurl': selectImgurl || '',
      'selectModelInfo.virtualPrice': selectVirtualPrice || '',
      allStock: allStock || '',
      priceDiscountStr: discountStr || ''
    }
    if (goodsInfo.goodsInfo.description) {
      WxParse.wxParse('wxParseDescription', 'html', goodsInfo.goodsInfo.description, prePage, 10);
    }
    prePage.setData(goodsInfo);
  };
  timeSplit(goodsCreate, label, isList) {
    var that = this,
      prePage = label,
      timeStart = parseInt((goodsCreate.start_time * 1000)),
      timeEnd = parseInt((goodsCreate.end_time * 1000)),
      now_time = parseInt(goodsCreate.now_time),
      time = now_time >= timeStart ? (timeEnd - now_time) : (timeStart - now_time),
      minprice = goodsCreate.min_price >= 999999 ? '9999.99' : goodsCreate.min_price;
    goodsCreate.timeDiff = goodsCreate.start_time * 1000 - Date.parse(new Date()) > 0 ? true : false;
    goodsCreate.startdiff = timeStart - goodsCreate.now_time > 0 ? true : false;
    goodsCreate.enddiff = timeEnd - goodsCreate.now_time > 0 ? true : false;
    goodsCreate.countDiff = parseInt(goodsCreate.goods_num) - parseInt(goodsCreate.sales);
    prePage.setData({
      'goodsInfo.timeDiff': goodsCreate.timeDiff || '',
      'goodsInfo.startdiff': goodsCreate.startdiff || '',
      'goodsInfo.enddiff': goodsCreate.enddiff || '',
      'goodsInfo.countDiff': goodsCreate.countDiff || ''
    })
  };
  calNum(goodsCreate, label, time, timeStart, timeEnd, index) {
    var prePage = label,
      isList = prePage.data.isList,
      goodsList,
      goodsItem,
      secondTime = time / 1000,
      timeSec = '',
      minuteTime = '',
      hourTime = '',
      secondNum = parseInt(secondTime),
      timeSec, timeMin, timeHour,
      timeObj = {};
    if (isList && secondNum <= 1) {
      if (isList == "index") {
        if (goodsCreate.startdiff) {
          goodsCreate.startdiff = !goodsCreate.startdiff;
          goodsCreate.startBox = true;
          goodsCreate.endBox = true;
        } else {
          goodsCreate.endBox = false;
        }
      } else if (secondNum <= 0) {
        if (isList == "detail") {
          if (goodsCreate.startdiff) {
            goodsCreate.startdiff = !goodsCreate.startdiff;
            goodsCreate.endBox = true;
            goodsCreate.originPay = false;
          } else {
            goodsCreate.endBox = false;
            goodsCreate.originPay = true;
            goodsCreate.endtime_s = {
              hour: ['0'],
              minute: ['0', '0'],
              second: ['0', '0']
            };
            goodsCreate.enddiff = !goodsCreate.enddiff;
          }
        } else {
          if (goodsCreate.startdiff) {} else {
            goodsCreate.enddiff = !goodsCreate.enddiff;
          }
        }

      }
    } else {
      if (secondNum > 0) {
        if (secondTime >= 36002400) {
          timeHour = '9999';
          timeMin = '99';
          timeSec = '99'
        } else {
          if (secondNum < 1) {
            timeSec = "00";
          } else {
            if (secondTime >= 60) {
              minuteTime = parseInt(secondTime / 60).toString();
              secondTime = parseInt(secondTime % 60).toString();
              if (minuteTime > 60) {
                hourTime = parseInt(minuteTime / 60).toString();
                minuteTime = parseInt(minuteTime % 60).toString();
              }
            } else if (secondTime < 60 && secondTime > 1) {
              secondTime = parseInt(secondTime % 60).toString();
            }
          }

          timeHour = hourTime <= 0 || !hourTime || goodsCreate.is_delete == '1' ? '00' : this.isSingerNum(hourTime, 1);
          timeMin = ((hourTime <= 0 || !hourTime) && (minuteTime <= 0 || !minuteTime)) || goodsCreate.is_delete == '1' ? '00' : this.isSingerNum(minuteTime, 0);
          timeSec = ((hourTime <= 0 || !hourTime) && (minuteTime <= 0 || !minuteTime) && (secondTime <= 0 || !secondTime)) || goodsCreate.is_delete == '1' ? '00' : this.isSingerNum(secondTime, 0);
        };
        timeObj = {
          hour: timeHour,
          minute: timeMin,
          second: timeSec
        }
      } else {
        if (!goodsCreate.startdiff) {
          goodsCreate.originPay = true;
          goodsCreate.enddiff = !goodsCreate.enddiff;
        }
        timeObj = {
          hour: ['0'],
          minute: ['0', '0'],
          second: ['0', '0']
        }
      }
      if (timeEnd > goodsCreate.now_time && goodsCreate.endBox) {
        goodsCreate.endtime_s = timeObj;
      } else {
        goodsCreate.starttime_s = timeObj;
      }
    }

    return goodsCreate;
  };
  isSingerNum(n, isH) {
    if (n) {
      if (isH) {
        n = n;
      } else {
        switch (n.length) {
          case 1:
            n = '0' + n;
            break;
          default:
            n = n;
            n = n;
            break;
        }
      }
      return n.split('');
    }
  };
  count(label) {
    var prePage = label,
      that = this,
      goodsList,
      isList = prePage.data.isList,
      now_time = Date.parse(new Date());
    if (isList == 'index') {
      goodsList = prePage.data.goodsList;
      for (let index in goodsList) {
        var index = Number(index),
          goodsDetail = goodsList[index],
          newData = {};
        var timeStart = parseInt(goodsDetail.start_time * 1000),
          timeEnd = parseInt(goodsDetail.end_time * 1000),
          time = 0;
        if (now_time < timeEnd) {
          time = now_time >= timeStart ? (timeEnd - now_time) : (timeStart - now_time);
          time = time + 1;
          var goodsCreate = that.calNum(goodsDetail, label, time, timeStart, timeEnd, index);
          newData['goodsList[' + index + '].endtime_s'] = goodsCreate.endtime_s || '';
          newData['goodsList[' + index + '].starttime_s'] = goodsCreate.starttime_s || '';
          newData['goodsList[' + index + '].startBox'] = goodsCreate.startBox || '';
          newData['goodsList[' + index + '].endBox'] = goodsCreate.endBox || '';
          newData['goodsList[' + index + '].enddiff'] = goodsCreate.enddiff || '';
          newData['goodsList[' + index + '].startdiff'] = goodsCreate.startdiff || '';
          prePage.setData(newData);
        } else {
          continue;
        }
      }
    } else {
      var goodsInfo = prePage.data.goodsInfo,
        now_time = Date.parse(new Date()),
        timeStarts = goodsInfo.start_time * 1000,
        timeEnds = goodsInfo.end_time * 1000,
        time = 0;
      if (now_time < timeEnds) {
        time = now_time >= timeStarts ? (timeEnds - now_time) : (timeStarts - now_time);
        time = time - 1;
        var goodsCreate = that.calNum(goodsInfo, label, time, timeStarts, timeEnds);
        prePage.setData({
          'goodsInfo.endtime_s': goodsInfo.endtime_s || '',
          'goodsInfo.starttime_s': goodsInfo.starttime_s || '',
          'goodsInfo.startBox': goodsCreate.startBox || '',
          'goodsInfo.endBox': goodsCreate.endBox || '',
          'goodsInfo.enddiff': goodsCreate.enddiff || '',
          'goodsInfo.startdiff': goodsCreate.startdiff || '',
          'goodsInfo.originPay': goodsCreate.originPay || ''
        })
      } else {
        if (goodsInfo.countDiff < 0 || goodsInfo.enddiff < 0) {
          goodsInfo.endtime_s = {
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
      }
    }
  };
  kan(json, callback, showLoading = true) {
    if (showLoading) {
      apiconfig.ShowLoading();
    }
    var app = getApp();
    callback(false);
    if (showLoading) {
      apiconfig.CloseLoading();
    }
  };
}
module.exports = KanorderApi;