var app = getApp(),
  common = require("../common/common.js");

function sign(a) {
  var t = a.data.name,
    n = a.data.mobile,
    o = a.data.password,
    e = !0;
  "" != t && null != t || (e = !1);
  "" != n && null != n && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(n) || (e = !1),
    "" != o && null != o || (e = !1), a.setData({
      submit: e
    });
}

Page({
  data: {
    pagePath: "../user/user",
    submit: !1,
    submit1: !0,
  },
  to_card: function() {
    1 == this.data.userinfo.card ? wx.navigateTo({
      url: "../card/card_on"
    }) : wx.navigateTo({
      url: "../card/card"
    });
  },
  recharge: function() {
    1 == this.data.userinfo.card ? wx.navigateTo({
      url: "../recharge/recharge"
    }) : wx.showModal({
      title: "提示",
      content: "请先激活会员卡",
      success: function(a) {
        a.confirm ? console.log("用户点击确定") : a.cancel && console.log("用户点击取消");
      }
    });
  },
  call: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.contact.content.mobile
    });
  },
  menu_on: function() {
    this.setData({
      menu: !0,
      shadow: !0
    });
  },
  menu_on1: function() {
    this.setData({
      menu1: !0,
      shadow: !0
    });
  },
  menu_close: function() {
    // console.log(11);
    this.setData({
      menu: !1,
      menu1: !1,
      shadow: !1,
    });
  },
  input: function(a) {
    var t = this;
    switch (a.currentTarget.dataset.name) {
      case "name":
        t.setData({
          name: a.detail.value
        });
        break;
      case "mobile":
        t.setData({
          mobile: a.detail.value
        });
        break;
      case "password":
        t.setData({
          password: a.detail.value
        });
        break;
      case "cardnum":
        t.setData({
          cardnum: a.detail.value
        });
        break;
      case "mobile1":
        t.setData({
          mobile1: a.detail.value
        });
    }
    sign(t);
  },
  submit: function() {
    var t = this;
    t.data.submit && app.util.request({
      url: "entry/wxapp/user",
      data: {
        op: "apply",
        name: t.data.name,
        mobile: t.data.mobile,
        password: t.data.password
      },
      success: function(a) {
        "" != a.data.data && (t.setData({
          menu: !1,
          shadow: !1,
          name: "",
          mobile: "",
          password: ""
        }), wx.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2e3
        }));
      }
    });
  },
  submit_1: function() {
    var t = this;
    t.data.submit1 && app.util.request({
      url: "entry/wxapp/user",
      data: {
        op: "cardbind1",
        mobile: t.data.mobile1,
        cardnum: t.data.cardnum,
      },
      success: function(a) {
        "" != a.data.data && (t.setData({
          menu1: !1,
          shadow: !1,
          mobile1: "",
          password: ""
        }), wx.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2e3
        }));
      }
    });
  },
  onLoad: function(a) {
    var n = this;
    common.config(n), common.theme(n), app.util.request({
      url: "entry/wxapp/user",
      data: {
        op: "user"
      },
      success: function(a) {
        var t = a.data;
        "" != t.data && ("" != t.data.contact && null != t.data.contact && n.setData({
          contact: t.data.contact
        }), "" != t.data.coupon && null != t.data.coupon && n.setData({
          coupon: t.data.coupon
        }), "" != t.data.userinfo && null != t.data.userinfo && (n.setData({
          userinfo: t.data.userinfo
        }), app.userinfo = t.data.userinfo), "" != t.data.card && null != t.data.card && n.setData({
          card: t.data.card
        }));
      }
    });
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {}
});