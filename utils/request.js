var apiurl = "https://preapi.baiwangkeji.com";
// var apiurl = "https://betaapi.baiwangkeji.com";
let app = getApp();

function http_post(url, data, cb) {
  data.mcode = app.globalData.mcode
  // console.log(data)

  wx.request({

    url: apiurl + url,

    data: data,

    method: 'post',

    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    success: function(res) {
      // console.log(res)
      return typeof cb == "function" && cb(res.data)

    },

    fail: function(res) {

      return typeof cb == "function" && cb(false)

    }

  })

}

function http_get(url, data, cb) {
  data.mcode = app.globalData.mcode
  // console.log(data)

  wx.request({

    url: apiurl + url,

    data: data,

    method: 'get',

    header: {
      'content-type': 'application/json'
      // 默认值
    },

    success: function(res) {
      // console.log(res)
      return typeof cb == "function" && cb(res.data)

    },

    fail: function(res) {

      return typeof cb == "function" && cb(false)

    }

  })

}
function http_json(url, data, cb) {
  data.mcode = app.globalData.mcode
  // console.log(data)

  wx.request({

    url: apiurl + url,

    data: data,

    method: 'post',

    header: {
      'content-type': 'application/json'
      // 默认值
    },

    success: function (res) {
      // console.log(res)
      return typeof cb == "function" && cb(res.data)

    },

    fail: function (res) {

      return typeof cb == "function" && cb(false)

    }

  })

}


module.exports = {

  http_post: http_post, //post请求
  http_get: http_get, //GET请求
  http_json: http_json //post JSON 请求
}