var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(o) {
        var a = this;
        common.config(a), common.theme(a), app.util.request({
            url: "entry/wxapp/user",
            data: {
                op: "card"
            },
            success: function(o) {
                var n = o.data;
                "" != n.data && a.setData({
                    card: n.data
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