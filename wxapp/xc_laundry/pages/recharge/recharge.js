var app = getApp(), common = require("../common/common.js");

function wxpay(t, n) {
  console.log(t)
  t.appId;
  var a = t.timeStamp.toString(), o = t.package, e = t.nonceStr, c = t.paySign.toUpperCase();
  wx.requestPayment({
    timeStamp: a,
    nonceStr: e,
    package: o,
    signType: "MD5",
    paySign: c,
    success: function (t) {
      wx.showToast({
        title: "充值成功",
        icon: "success",
        duration: 2e3
      }), setTimeout(function () {
        wx.reLaunch({
          url: "../user/user"
        });
      }, 2e3);
    },
    fail: function (t) { }
  });
}

Page({
  data: {
    curr: -1
  },
  choose: function (t) {
    var n = t.currentTarget.dataset.index;
    
    this.setData({
      curr: n
    });
  },
  submit: function () {
    var a = this, t = a.data.curr;
    console.log(t)
    -1 == t ? wx.showModal({
      title: "提示",
      content: "充值金额不能为空",
      success: function (t) {
        t.confirm ? console.log("用户点击确定") : t.cancel && console.log("用户点击取消");
      }
    }) : app.util.request({
      url: "entry/wxapp/cardorder",
      data: {
        curr: t
      },
      success: function (t) {
        var n = t.data;
        "" != n.data && wxpay(n.data, a);
      }
    });
  },
  onLoad: function (t) {
    var a = this;
    common.config(a), common.theme(a), app.util.request({
      url: "entry/wxapp/user",
      data: {
        op: "card"
      },
      success: function (t) {
        var n = t.data;
        "" != n.data && a.setData({
          card: n.data
        });
      }
    });
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});