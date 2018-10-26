var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(n) {
        var o = this;
        common.config(o, app), common.theme(o, app), "" != n.url && null != n.url && o.setData({
            url: unescape(n.url)
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});