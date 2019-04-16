let app = getApp();
let request = require('../../utils/request.js')
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    door: "街道门牌信息",
    address: '请选择地址',
    shengArr: [],
    shiArr: [],
    xianArr: [],
    zhenArr: [],
    shengName: '请选择',
    shiName: '',
    xianName: '',
    zhenName: '',
    shengid: '请选择',
    shiid: '',
    xianid: '',
    zhenid: '',
    boxSwitch: false,
    shengSwitch: false,
    shiSwitch: false,
    xianSwitch: false,
    zhenSwitch: false,
  },
  onLoad: function (e) {
    this.shengObtain()
    this.dizhi()
  },
  onShow: function () {
    wx.hideShareMenu() //隐藏转发
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this;
    if (e.detail.value.name == "") {
      wx.showToast({
        title: '请填写您的姓名！',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.tel == "") {
      wx.showToast({
        title: '请填写您的手机号！',
        icon: 'none',
        duration: 2000
      })
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.address == '请选择地址') {
      wx.showToast({
        title: '请选择您的所在区域',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.door == "") {
      wx.showToast({
        title: '请输入您的具体地址',
        icon: 'none',
        duration: 2000
      })
    } else {
      request.http_get('/interface?action=add_address', {
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        province: this.data.shengName,
        province_code: this.data.shengid,
        city: this.data.shiName,
        city_code: this.data.shiid,
        area: this.data.xianName,
        county_code: this.data.xianid,
        town: this.data.zhenName,
        town_code: this.data.zhenid,
        address: e.detail.value.door,
        uid: wx.getStorageSync('userInfos').uid,
        sid: '',
        ticket: wx.getStorageSync('userInfos').ticket,
        is_on: 0,
        zip: '',
        email: '',
        tag_name: '',
      }, (res) => {
        console.log(res)
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '/pages/address/address'
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      // flag = true;
      // console.log('form发生了submit事件，携带数据为：', e.detail.value)
      // wx.reLaunch({
      //   url: '/pages/navigation/personalservice/address?tel=' + e.detail.value.tel + "&door=" + e.detail.value.door + "&name=" + e.detail.value.name + "&flag=" + flag + "&areavalue=" + that.data.region[0] + "&addrevalue=" + that.data.region[1] + "&cityvalue=" + that.data.region[2]
      //   //？后面跟的是需要传递到下一个页面的参数
      // });
      // console.log("传过去的地址下标是多少？" + e.detail.value.addre)
    }
  },
  shengObtain: function () { //获取地址(省)
    wx.request({
      url: 'https://wap.baiwangkeji.com/shipping/GetProvince',
      data: {}, //请求的参数",
      method: 'POST',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res)
        var photoInfoList = []
        var iterable = res.data.list
        for (let obj in iterable) {
          photoInfoList.push({
            name: obj,
            id: iterable[obj]
          })
          this.setData({
            shengArr: photoInfoList
          })
        }
        console.log(this.data.shengArr)
      }
    });
  },
  shengClick: function (e) { //用省的id获取市的地址
    console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      shengName: name,
      shengid: id,
      shiSwitch: true,
      shengSwitch: false
    })
    wx.request({
      url: 'https://wap.baiwangkeji.com/shipping/getApiJdCity', //开发者服务器接口地址",
      data: {
        id: id
      }, //请求的参数",
      method: 'POST',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res)
        var photoInfoList = []
        var iterable = res.data.list
        for (let obj in iterable) {
          photoInfoList.push({
            name: obj,
            id: iterable[obj]
          })
          this.setData({
            shiArr: photoInfoList
          })
        }
        console.log(this.data.shiArr)
      }
    });
  },
  shiClick: function (e) { //用市的id获取县的地址
    console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      shiName: name,
      shiid: id,
      xianSwitch: true,
      shiSwitch: false
    })
    wx.request({
      url: 'https://wap.baiwangkeji.com/shipping/getApiJdArea', //开发者服务器接口地址",
      data: {
        id: id
      }, //请求的参数",
      method: 'GET',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res)
        var photoInfoList = []
        var iterable = res.data.list
        for (let obj in iterable) {
          photoInfoList.push({
            name: obj,
            id: iterable[obj]
          })
          this.setData({
            xianArr: photoInfoList
          })
        }
        console.log(this.data.xianArr)
      }
    });
  },
  xianClick: function (e) { //用县的id获取县的地址
    console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      xianName: name,
      xianid: id,
    })
    wx.request({
      url: 'https://wap.baiwangkeji.com/shipping/GetApiJdTown', //开发者服务器接口地址",
      data: {
        id: id
      }, //请求的参数",
      method: 'GET',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res)
        var photoInfoList = []
        var iterable = res.data.list
        for (let obj in iterable) {
          photoInfoList.push({
            name: obj,
            id: iterable[obj]
          })
          this.setData({
            zhenArr: photoInfoList,
          })
        }
        console.log(this.data.zhenArr)
        if (this.data.zhenArr.length == 0) {
          this.setData({
            xianSwitch: false,
            boxSwitch: false,
            address: this.data.shengName + this.data.shiName + this.data.xianName
          })
        } else {
          this.setData({
            xianSwitch: false,
            zhenSwitch: true
          })
        }
      }
    });
  },
  zhenClick: function (e) { //获取地址镇
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    this.setData({
      zhenName: name,
      zhenid: id,
      zhenSwitch: false,
      boxSwitch: false,
      address: this.data.shengName + this.data.shiName + this.data.xianName + name
    })
  },
  openbox: function () { //点击选择地址打开选择
    this.setData({
      boxSwitch: true,
      shengSwitch: true,
      shiSwitch: false,
      xianSwitch: false,
      zhenSwitch: false,
      shengName: '请选择',
      shiName: '',
      xianName: '',
      zhenName: '',
      shiArr: [],
      xianArr: [],
      zhenArr: [],
    })
  },
  closebox: function () { //关闭选择地址
    this.setData({
      boxSwitch: false,
      shengName: '请选择',
      shiName: '',
      xianName: '',
      zhenName: '',
      shengSwitch: true,
      shiSwitch: false,
      xianSwitch: false,
      zhenSwitch: false,
      address: '请选择地址'
    })
  },
  dizhi: function () {
    request.http_get('/interface?action=address', {
      uid: wx.getStorageSync('userInfos').uid,
      ticket: wx.getStorageSync('userInfos').ticket,
    }, (res) => {
      console.log(res)
    })
  }
})