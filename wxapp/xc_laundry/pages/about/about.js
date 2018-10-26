var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(n) {
        var t = this;
        common.config(t), common.theme(t), app.util.request({
            url: "entry/wxapp/service",
            data: {
                op: "about",
                xkey: n.xkey
            },
            success: function(n) {
                var o = n.data;
                "" != o.data && t.setData({
                    content: o.data.content
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