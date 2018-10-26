var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    bind: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "bind"
            },
            success: function(n) {
                var o = n.data;
                if ("" != o.data) {
                    wx.showToast({
                        title: "绑定成功",
                        icon: "success",
                        duration: 2e3
                    });
                    var a = t.data.userinfo;
                    a.bind = 1, a.money = o.data.money, t.setData({
                        userinfo: a
                    });
                }
            }
        });
    },
    onLoad: function(n) {
        var a = this;
        common.config(a), common.theme(a), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "userinfo"
            },
            success: function(n) {
                var o = n.data;
                "" != o.data && a.setData({
                    userinfo: o.data
                });
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