var app = getApp(), common = require("../common/common.js");

Page({
    data: {
        curr: 1
    },
    tab: function(t) {
        var n = this, a = t.currentTarget.dataset.index;
        n.data.curr != a && (n.setData({
            curr: a,
            list: []
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "coupon",
                curr: n.data.curr
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && n.setData({
                    list: a.data
                });
            }
        }));
    },
    setcoupon: function(t) {
        var n = this, o = t.currentTarget.dataset.index;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "setcoupon",
                cid: n.data.list[o].id
            },
            success: function(t) {
                if ("" != t.data.data) {
                    var a = n.data.list;
                    a.splice(o, 1), n.setData({
                        list: a
                    }), wx.showToast({
                        title: "领取成功",
                        icon: "success",
                        duration: 2e3
                    });
                }
            }
        });
    },
    to_shop: function() {
        wx.navigateTo({
            url: "../service/service"
        });
    },
    onLoad: function(t) {
        var n = this;
        common.config(n, app), common.theme(n), app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "coupon",
                curr: n.data.curr
            },
            success: function(t) {
                var a = t.data;
                "" != a.data && n.setData({
                    list: a.data
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