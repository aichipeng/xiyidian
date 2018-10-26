var app = getApp(), common = require("../common/common.js");

Page({
    data: {},
    onLoad: function(e) {
        common.login(this), app.util.request({
            url: "entry/wxapp/index",
            showLoadin: !1,
            data: {
                op: "base"
            },
            success: function(a) {
                var n = a.data;
                if ("" != n.data && ("" != n.data.config && null != n.data.config && (app.config = n.data.config), 
                "" != n.data.userinfo && null != n.data.userinfo && (app.userinfo = n.data.userinfo), 
                "" != n.data.shop && null != n.data.shop && (app.shop = n.data.shop), "" != n.data.theme && null != n.data.theme && (app.theme = n.data.theme)), 
                "" != e.share && null != e.share) {
                    var o = unescape(e.share);
                    wx.redirectTo({
                        url: o
                    });
                } else wx.redirectTo({
                    url: "../index/index"
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