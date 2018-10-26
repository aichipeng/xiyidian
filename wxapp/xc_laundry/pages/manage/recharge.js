var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        menu: !0,
        shadow: !0
    },
    input: function(a) {
        switch (a.currentTarget.dataset.name) {
          case "amount":
            this.setData({
                amount: a.detail.value
            });
            break;

          case "mobile":
            this.setData({
                mobile: a.detail.value
            });
        }
    },
    submit: function() {
        var e = this, a = e.data.mobile;
        "" != a && null != a && /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/.test(a) ? (e.setData({
            menu_error: !1
        }), app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "get_card",
                mobile: a
            },
            success: function(a) {
                var t = a.data;
                "" != t.data && e.setData({
                    userinfo: t.data,
                    menu: !1,
                    shadow: !1
                });
            }
        })) : e.setData({
            menu_error: !0
        });
    },
    recharge: function() {
        var e = this, n = e.data.amount;
        "" != n && null != n && app.util.request({
            url: "entry/wxapp/manage",
            data: {
                op: "recharge",
                id: e.data.userinfo.id,
                amount: n
            },
            success: function(a) {
                if ("" != a.data.data) {
                    wx.showToast({
                        title: "充值成功",
                        icon: "success",
                        duration: 2e3
                    });
                    var t = e.data.userinfo;
                    t.money = (parseFloat(n) + parseFloat(t.money)).toFixed(2), e.setData({
                        userinfo: t,
                        amount: ""
                    });
                }
            }
        });
    },
    onLoad: function(a) {
        var t = this;
        common.config(t), common.theme(t), t.setData({
            userinfo: ""
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});